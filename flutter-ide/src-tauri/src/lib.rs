use std::fs;
use std::path::Path;
use std::process::{Command, Stdio, Child};
use std::sync::{Arc, Mutex};
use std::io::{BufReader, BufRead};
use std::thread;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};

// Global state para processos Flutter
lazy_static::lazy_static! {
    static ref FLUTTER_PROCESS: Arc<Mutex<Option<Child>>> = Arc::new(Mutex::new(None));
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileNode {
    name: String,
    path: String,
    is_directory: bool,
    children: Option<Vec<FileNode>>,
}

#[tauri::command]
async fn run_flutter(app: AppHandle, project_path: String) -> Result<String, String> {
    // Check if Flutter is already running
    {
        let process = FLUTTER_PROCESS.lock().unwrap();
        if process.is_some() {
            println!("Flutter is already running, skipping start");
            return Ok("http://localhost:8080".to_string());
        }
    }

    println!("Starting Flutter in: {}", project_path);

    // Get current PATH and add Flutter bin directory
    let current_path = std::env::var("PATH").unwrap_or_default();
    let user_profile = std::env::var("USERPROFILE").unwrap_or_default();
    let user_flutter_path = format!(r"{}\flutter\bin", user_profile);

    let flutter_paths = vec![
        r"C:\flutter\bin",
        r"C:\src\flutter\bin",
        user_flutter_path.as_str(),
    ];

    let mut new_path = current_path.clone();
    for flutter_path in flutter_paths {
        if !new_path.contains(flutter_path) {
            new_path = format!("{};{}", flutter_path, new_path);
        }
    }

    // Start Flutter run process
    let mut child = Command::new("flutter")
        .args(["run", "-d", "chrome", "--web-port=8080"])
        .current_dir(&project_path)
        .env("PATH", new_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start Flutter: {}", e))?;

    // Capture stdout for logging and VM Service URI
    if let Some(stdout) = child.stdout.take() {
        let app_handle = app.clone();
        thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(line) = line {
                    println!("[Flutter] {}", line);

                    // Check for VM Service URI
                    if line.contains("Dart VM") || line.contains("Observatory") || line.contains("ws://") {
                        // Extract URI from line (format: "The Dart VM service is listening on http://...")
                        if let Some(start) = line.find("http://") {
                            if let Some(end) = line[start..].find(|c: char| c.is_whitespace()) {
                                let vm_uri = &line[start..start + end];
                                println!("[DevTools] VM Service URI: {}", vm_uri);
                                let _ = app_handle.emit("vm-service-uri", vm_uri.to_string());
                            } else {
                                let vm_uri = &line[start..];
                                println!("[DevTools] VM Service URI: {}", vm_uri);
                                let _ = app_handle.emit("vm-service-uri", vm_uri.to_string());
                            }
                        }
                    }

                    let _ = app_handle.emit("flutter-log", line);
                }
            }
        });
    }

    // Capture stderr for logging
    if let Some(stderr) = child.stderr.take() {
        let app_handle = app.clone();
        thread::spawn(move || {
            let reader = BufReader::new(stderr);
            for line in reader.lines() {
                if let Ok(line) = line {
                    eprintln!("[Flutter Error] {}", line);
                    let _ = app_handle.emit("flutter-error", line);
                }
            }
        });
    }

    // Store process
    let mut process = FLUTTER_PROCESS.lock().unwrap();
    *process = Some(child);

    Ok("http://localhost:8080".to_string())
}

#[tauri::command]
async fn stop_flutter() -> Result<(), String> {
    let mut process = FLUTTER_PROCESS.lock().unwrap();

    if let Some(mut child) = process.take() {
        child.kill().map_err(|e| format!("Failed to kill Flutter process: {}", e))?;
        println!("Flutter process stopped");
    }

    Ok(())
}

#[tauri::command]
async fn hot_reload() -> Result<String, String> {
    // Send 'r' command to Flutter process for hot reload
    // Note: This is simplified - in production, you'd need to communicate with the process
    println!("Hot reload triggered");
    Ok("Hot reload triggered".to_string())
}

#[tauri::command]
async fn hot_restart() -> Result<String, String> {
    // Send 'R' command to Flutter process for hot restart
    println!("Hot restart triggered");
    Ok("Hot restart triggered".to_string())
}

#[tauri::command]
fn open_folder_dialog(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    use std::sync::{Arc, Mutex};
    use std::time::Duration;

    let result = Arc::new(Mutex::new(None));
    let result_clone = result.clone();

    app.dialog()
        .file()
        .set_title("Selecione uma pasta Flutter")
        .pick_folder(move |folder_path| {
            let mut r = result_clone.lock().unwrap();
            *r = Some(folder_path);
        });

    // Wait for dialog to complete (with timeout)
    for _ in 0..100 {
        std::thread::sleep(Duration::from_millis(50));
        let r = result.lock().unwrap();
        if r.is_some() {
            break;
        }
    }

    let final_result = result.lock().unwrap();
    match final_result.as_ref() {
        Some(Some(path)) => {
            Ok(Some(path.to_string()))
        },
        _ => Ok(None),
    }
}

#[tauri::command]
fn read_directory(path: String) -> Result<Vec<FileNode>, String> {
    let dir_path = Path::new(&path);

    if !dir_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if !dir_path.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }

    let mut entries = Vec::new();

    match fs::read_dir(dir_path) {
        Ok(read_dir) => {
            for entry in read_dir {
                if let Ok(entry) = entry {
                    let entry_path = entry.path();
                    let is_directory = entry_path.is_dir();
                    let name = entry.file_name().to_string_lossy().to_string();

                    // Skip hidden files and common ignore patterns
                    if name.starts_with('.') || name == "node_modules" || name == "build" {
                        continue;
                    }

                    entries.push(FileNode {
                        name,
                        path: entry_path.to_string_lossy().to_string(),
                        is_directory,
                        children: None,
                    });
                }
            }
        }
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    }

    // Sort: directories first, then files, both alphabetically
    entries.sort_by(|a, b| {
        match (a.is_directory, b.is_directory) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(entries)
}

#[tauri::command]
fn read_file_content(path: String) -> Result<String, String> {
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
fn write_file_content(path: String, content: String) -> Result<(), String> {
    match fs::write(&path, content) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to write file: {}", e)),
    }
}

#[tauri::command]
fn create_file(path: String) -> Result<(), String> {
    match fs::File::create(&path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to create file: {}", e)),
    }
}

#[tauri::command]
fn create_directory(path: String) -> Result<(), String> {
    match fs::create_dir_all(&path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to create directory: {}", e)),
    }
}

#[tauri::command]
fn delete_path(path: String) -> Result<(), String> {
    let path_buf = Path::new(&path);

    if !path_buf.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if path_buf.is_dir() {
        match fs::remove_dir_all(&path) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to delete directory: {}", e)),
        }
    } else {
        match fs::remove_file(&path) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to delete file: {}", e)),
        }
    }
}

#[tauri::command]
fn rename_path(old_path: String, new_path: String) -> Result<(), String> {
    match fs::rename(&old_path, &new_path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to rename: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            run_flutter,
            stop_flutter,
            hot_reload,
            hot_restart,
            open_folder_dialog,
            read_directory,
            read_file_content,
            write_file_content,
            create_file,
            create_directory,
            delete_path,
            rename_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
