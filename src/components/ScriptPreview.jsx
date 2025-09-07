import React, { useMemo } from 'react';
import { generateScript } from '../data/techData';

/**
 * ScriptPreview - Shows generated shell script
 * @param {Object} props
 * @param {Object} props.cfg
 */
export default function ScriptPreview({ cfg }) {
  const script = useMemo(() => generateScript(cfg), [cfg]);
  return <pre className="code-block" aria-label="Script Preview">{script}</pre>;
}
