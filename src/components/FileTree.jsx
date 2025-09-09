import React, { useMemo } from 'react';
import { generateStructure, flattenStructure } from '../data/techData';
import { getFileIcon, getFileIconColor } from '../utils/fileIcons';

/**
 * FileTree - Recursive file tree preview
 * @param {Object} props
 * @param {Object} props.cfg
 */
export default function FileTree({ cfg, activeFile, onSelect, editedOverrides }) {
  const structure = useMemo(() => generateStructure(cfg), [cfg]);
  const files = flattenStructure(structure);

  function getContent(path) {
    const parts = path.split('/').filter(Boolean);
    let node = structure;
    for (let i=0;i<parts.length;i++) {
      const part = parts[i];
      if (!node) return '';
      node = node[part];
    }
    return typeof node === 'string' ? node : '';
  }

  return (
    <div className="file-tree" aria-label="File tree preview">
      {files.map(f => {
        const isDir = f.endsWith('/');
        const isActive = f === activeFile;
        const modified = !isDir && editedOverrides && Object.prototype.hasOwnProperty.call(editedOverrides, f);
        const fileName = f.split('/').pop() || f;
        const extension = isDir ? '' : (fileName.split('.').pop()?.toLowerCase() || '');
        const icon = getFileIcon(fileName, isDir, false);
        const iconColor = getFileIconColor(fileName, isDir);
        
        return (
          <div key={f}>
            <button
              type="button"
              className={"tree-entry "+(isDir?'dir ':'')+(isActive?'active':'')}
              disabled={isDir}
              onClick={() => !isDir && onSelect && onSelect(f, modified ? editedOverrides[f] : getContent(f))}
              aria-label={isDir?`Directory ${f}`:`File ${f}${modified?' (modified)':''}`}
            >
              <span 
                className="file-icon-wrapper" 
                style={{ color: iconColor }}
                title={isDir ? `Folder: ${fileName}` : `File: ${fileName}`}
                role="img"
                aria-label={isDir ? `Folder icon` : `${extension || 'File'} icon`}
              >
                {icon}
              </span>
              <span className="file-name">
                {f}{modified && ' *'}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
