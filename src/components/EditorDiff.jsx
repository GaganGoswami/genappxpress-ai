import React, { useEffect, useRef, useState, useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import jsonLang from 'highlight.js/lib/languages/json';
import diffLang from 'highlight.js/lib/languages/diff';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', jsonLang);
hljs.registerLanguage('diff', diffLang);

/**
 * EditorDiff - inline editable code area with syntax highlight overlay & diff output.
 * Props:
 *  - path: file path (used for language inference)
 *  - original: original content
 *  - value: current edited value
 *  - onChange: (newVal)=>void
 */
export default function EditorDiff({ path, original, value, onChange }) {
  const textRef = useRef(null);
  const overlayRef = useRef(null);
  const [showDiff, setShowDiff] = useState(false);

  // Basic language guess
  const autoLang = useMemo(()=>{
    if(/\.py$/.test(path)) return 'python';
    if(/\.jsx?$/.test(path)) return 'javascript';
    if(/\.sh$/.test(path)) return 'bash';
    if(/\.json$/.test(path)) return 'json';
    if(/\.ya?ml$/.test(path)) return 'yaml';
    return 'plaintext';
  }, [path]);
  const [manualLang, setManualLang] = useState(null);
  const lang = manualLang || autoLang;

  useEffect(()=>{
    if(!overlayRef.current) return;
    let code = value || '';
    try {
      if(lang !== 'plaintext') {
        const { value: highlighted } = hljs.highlight(code, { language: lang.startsWith('yaml') ? 'json' : lang });
        overlayRef.current.innerHTML = highlighted + '\n';
      } else {
        overlayRef.current.textContent = code + '\n';
      }
    } catch(e) {
      overlayRef.current.textContent = code + '\n';
    }
  }, [value, lang]);

  // Scroll sync
  useEffect(()=>{
    const t = textRef.current; const o = overlayRef.current; if(!t||!o) return;
    function sync(){ o.scrollTop = t.scrollTop; o.scrollLeft = t.scrollLeft; }
    t.addEventListener('scroll', sync); return ()=>{ t.removeEventListener('scroll', sync); };
  }, []);

  const diffLines = useMemo(()=>{
    if(!showDiff) return [];
    const oldL = (original||'').split(/\r?\n/);
    const newL = (value||'').split(/\r?\n/);
    // Simple LCS diff (line-based)
    const m = oldL.length, n = newL.length;
    const dp = Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j] = oldL[i-1]===newL[j-1]? dp[i-1][j-1]+1: Math.max(dp[i-1][j], dp[i][j-1]);
    const ops=[]; let i=m,j=n;
    while(i>0 && j>0){ if(oldL[i-1]===newL[j-1]) { ops.push({type:'ctx', line:oldL[i-1], i:i-1, j:j-1}); i--; j--; } else if(dp[i-1][j] >= dp[i][j-1]) { ops.push({type:'del', line:oldL[i-1], i:i-1}); i--; } else { ops.push({type:'add', line:newL[j-1], j:j-1}); j--; } }
    while(i>0){ ops.push({type:'del', line:oldL[i-1], i:i-1}); i--; }
    while(j>0){ ops.push({type:'add', line:newL[j-1], j:j-1}); j--; }
    return ops.reverse();
  }, [showDiff, original, value]);

  function downloadEdited(){
    const blob = new Blob([value], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = path.split('/').pop(); a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
  }

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', overflow:'hidden'}}>
      <div className="editor-toolbar">
        <strong style={{fontSize:12, flex:1}}>{path}</strong>
        <select aria-label="Select language" value={manualLang || autoLang} onChange={e=>setManualLang(e.target.value===autoLang? null : e.target.value)} style={{fontSize:11}}>
          {['plaintext','javascript','python','bash','json','yaml'].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button type="button" onClick={()=>setShowDiff(d=>!d)}>{showDiff? 'Hide Diff':'Show Diff'}</button>
        <button type="button" onClick={downloadEdited}>Download</button>
      </div>
      <div className="code-editor" style={{flex:1, background:'#111b1c', color:'#d6f2f4', borderTop:'1px solid var(--color-border)'}}>
        <pre ref={overlayRef} className="hljs-overlay" aria-hidden="true" />
        <textarea ref={textRef} value={value} spellCheck={false} aria-label={`Edit ${path}`} onChange={e=>onChange(e.target.value)} />
      </div>
      {showDiff && (
        <div className="diff-view" aria-label="Diff view">
          {diffLines.map((d,idx)=>(
            <div key={idx} className={`diff-line ${d.type}`}>
              <span className="ln">{d.type==='add'? '+': d.type==='del'? '-': ''}{d.i!=null? d.i+1:''}</span>
              <code>{d.line || '\u00A0'}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
