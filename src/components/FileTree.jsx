import React, { useMemo } from 'react';
import { generateStructure, flattenStructure } from '../data/techData';

/**
 * FileTree - Recursive file tree preview
 * @param {Object} props
 * @param {Object} props.cfg
 */
export default function FileTree({ cfg }) {
  const structure = useMemo(() => generateStructure(cfg), [cfg]);
  const files = flattenStructure(structure);
  return (
    <div className="file-tree" aria-label="File tree preview">
      {files.map(f => (
        <div key={f}>
          <span className={f.endsWith('/') ? 'tree-dir' : ''}>{f}</span>
        </div>
      ))}
    </div>
  );
}
