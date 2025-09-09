import React, { useMemo } from 'react';
import { TECH_STACK } from '../data/techData';

/**
 * TemplateModal - Modal for selecting predefined templates
 * @param {Object} props
 * @param {() => void} props.onClose
 * @param {(preset:Object) => void} props.applyTemplate
 */
export default function TemplateModal({ onClose, applyTemplate }) {
  const list = TECH_STACK.templates || [];

  // Derive grouping. Primary grouping uses existing category; we also compute a synthetic
  // "Full Stack" group for templates that include both frontend & backend stacks in preset.
  const groups = useMemo(() => {
    const order = [
      'Full Stack',
      'Conversational',
      'RAG / Retrieval',
      'Research / Automation',
      'Orchestration',
      'Dev Tools',
      'Observability',
      'Multimodal',
      'Local & Edge',
      'Integrations',
      'Knowledge'
    ];
    const map = {};
    list.forEach(t => {
      const hasFE = (t.preset?.frontend || []).length > 0;
      const hasBE = (t.preset?.backend || []).length > 0;
      const fullStackKey = (hasFE && hasBE) ? 'Full Stack' : null;
      const catKey = t.category || 'Other';
      const targetKeys = fullStackKey ? [fullStackKey, catKey] : [catKey];
      targetKeys.forEach(k => {
        map[k] = map[k] || [];
        map[k].push(t);
      });
    });
    // Sort templates within each group alphabetically
    Object.values(map).forEach(arr => arr.sort((a,b)=> a.name.localeCompare(b.name)));
    // Compute ordered list of group keys: explicit order first, then remaining alphabetical
    const remaining = Object.keys(map).filter(k => !order.includes(k)).sort();
    const orderedKeys = [...order.filter(k => map[k]), ...remaining];
    return { orderedKeys, map };
  }, [list]);

  return (
    <div className="template-modal" role="dialog" aria-modal="true" aria-label="Template Selection">
      <div className="template-dialog template-dialog-large">
        <button className="close-btn" onClick={onClose} aria-label="Close template dialog">Close</button>
        <h2 style={{ marginTop: 0 }}>Templates</h2>
        <p style={{ marginTop: -8 }}>Grouped gallery. Pick a template to auto-select a starter stack.</p>
        <div className="template-groups" aria-label="Grouped templates">
          {groups.orderedKeys.map(group => (
            <div className="template-group-modal" key={group} aria-label={group + ' group'}>
              <h3>{group}</h3>
              <div className="template-cards" role="list">
                {groups.map[group].map(t => (
                  <div className="template-card small" key={t.id} role="listitem">
                    <h4>{t.name}</h4>
                    <p>{t.description}</p>
                    <button onClick={() => applyTemplate(t)} aria-label={`Use ${t.name} template`}>Use</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
