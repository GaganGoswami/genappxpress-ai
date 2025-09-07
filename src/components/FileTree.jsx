import React, { useMemo } from 'react';
import { generateStructure, flattenStructure } from '../data/techData';

/**
 * FileTree - Recursive file tree preview
 * @param {Object} props
 * @param {Object} props.cfg
 */
export default function FileTree({ cfg, activeFile, onSelect }) {
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
        return (
          <div key={f}>
            <button
              type="button"
              className={"tree-entry "+(isDir?'dir ':'')+(isActive?'active':'')}
              disabled={isDir}
              onClick={() => !isDir && onSelect && onSelect(f, getContent(f))}
              aria-label={isDir?`Directory ${f}`:`File ${f}`}
            >
              {f}
            </button>
          </div>
        );
      })}
    </div>
  );
}
