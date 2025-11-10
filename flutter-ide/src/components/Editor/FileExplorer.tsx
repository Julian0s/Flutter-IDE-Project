import { useState } from 'react';
import { useFileExplorerStore } from '../../stores/fileExplorerStore';
import { FileNode, FileSystemService } from '../../services/fileSystem';
import './FileExplorer.css';

export function FileExplorer() {
  const {
    workspaceRoot,
    fileTree,
    currentFile,
    expandedFolders,
    selectFolder,
    toggleFolder,
    openFile,
  } = useFileExplorerStore();

  const [loading, setLoading] = useState(false);

  const handleSelectFolder = async () => {
    setLoading(true);
    try {
      await selectFolder();
    } catch (error) {
      console.error('Error selecting folder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFolder = async (path: string, node: FileNode) => {
    const isExpanded = expandedFolders.has(path);

    await toggleFolder(path);

    // If expanding and children not loaded yet, load them
    if (!isExpanded && (!node.children || node.children.length === 0)) {
      try {
        const children = await FileSystemService.readDirectory(path);
        // Update the node with children
        const updatedTree = updateNodeChildren(fileTree, path, children);
        useFileExplorerStore.setState({ fileTree: updatedTree });
      } catch (error) {
        console.error('Failed to load folder contents:', error);
      }
    }
  };

  const updateNodeChildren = (
    nodes: FileNode[],
    targetPath: string,
    children: FileNode[]
  ): FileNode[] => {
    return nodes.map((node) => {
      if (node.path === targetPath) {
        return { ...node, children };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeChildren(node.children, targetPath, children),
        };
      }
      return node;
    });
  };

  const handleOpenFile = async (path: string) => {
    try {
      await openFile(path);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const getFileIcon = (node: FileNode) => {
    if (node.is_directory) {
      return expandedFolders.has(node.path) ? '📂' : '📁';
    }

    const extension = node.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'dart':
        return '📄';
      case 'yaml':
      case 'yml':
        return '📋';
      case 'json':
        return '{}';
      case 'md':
        return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isActive = currentFile === node.path;
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div key={node.path}>
        <div
          className={`file-item ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.is_directory) {
              handleToggleFolder(node.path, node);
            } else {
              handleOpenFile(node.path);
            }
          }}
        >
          <span className="file-icon">{getFileIcon(node)}</span>
          <span className="file-name">{node.name}</span>
        </div>

        {node.is_directory && isExpanded && node.children && (
          <div className="file-children">
            {node.children.map((child) => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="sidebar-header">
        <h3>Explorador</h3>
        <button
          className="btn-open-folder"
          onClick={handleSelectFolder}
          disabled={loading}
          title="Abrir Pasta"
        >
          📁
        </button>
      </div>

      <div className="sidebar-content">
        {loading && (
          <div className="explorer-loading">
            <p>Carregando...</p>
          </div>
        )}

        {!loading && !workspaceRoot && (
          <div className="explorer-empty">
            <p>Nenhuma pasta aberta</p>
            <button className="btn-open-folder-large" onClick={handleSelectFolder}>
              Abrir Pasta Flutter
            </button>
          </div>
        )}

        {!loading && workspaceRoot && (
          <div className="file-tree">
            {fileTree.map((node) => renderFileNode(node))}
          </div>
        )}
      </div>
    </div>
  );
}
