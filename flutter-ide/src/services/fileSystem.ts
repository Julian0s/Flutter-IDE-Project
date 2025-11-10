import { invoke } from '@tauri-apps/api/core';

export interface FileNode {
  name: string;
  path: string;
  is_directory: boolean;
  children?: FileNode[];
}

export class FileSystemService {
  /**
   * Open a folder picker dialog and return the selected path
   */
  static async openFolder(): Promise<string | null> {
    try {
      console.log('Opening folder picker...');
      const selected = await invoke<string | null>('open_folder_dialog');
      console.log('Selected folder:', selected);
      return selected;
    } catch (error) {
      console.error('Error opening folder:', error);
      throw error;
    }
  }

  /**
   * Read directory contents
   */
  static async readDirectory(path: string): Promise<FileNode[]> {
    try {
      return await invoke<FileNode[]>('read_directory', { path });
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  }

  /**
   * Read file content
   */
  static async readFile(path: string): Promise<string> {
    try {
      return await invoke<string>('read_file_content', { path });
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  /**
   * Write file content
   */
  static async writeFile(path: string, content: string): Promise<void> {
    try {
      await invoke('write_file_content', { path, content });
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

  /**
   * Create a new file
   */
  static async createFile(path: string): Promise<void> {
    try {
      await invoke('create_file', { path });
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  /**
   * Create a new directory
   */
  static async createDirectory(path: string): Promise<void> {
    try {
      await invoke('create_directory', { path });
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  /**
   * Delete a file or directory
   */
  static async deletePath(path: string): Promise<void> {
    try {
      await invoke('delete_path', { path });
    } catch (error) {
      console.error('Error deleting path:', error);
      throw error;
    }
  }

  /**
   * Rename/move a file or directory
   */
  static async renamePath(oldPath: string, newPath: string): Promise<void> {
    try {
      await invoke('rename_path', { oldPath, newPath });
    } catch (error) {
      console.error('Error renaming path:', error);
      throw error;
    }
  }

  /**
   * Check if path is a Flutter project
   */
  static async isFlutterProject(path: string): Promise<boolean> {
    try {
      const files = await this.readDirectory(path);
      return files.some(
        (file) => file.name === 'pubspec.yaml' && !file.is_directory
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file extension
   */
  static getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  /**
   * Check if file is a Dart file
   */
  static isDartFile(filename: string): boolean {
    return this.getFileExtension(filename).toLowerCase() === 'dart';
  }
}
