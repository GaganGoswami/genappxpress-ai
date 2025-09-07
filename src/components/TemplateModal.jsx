import React from 'react';
import { TECH_STACK } from '../data/techData';

/**
 * TemplateModal - Modal for selecting predefined templates
 * @param {Object} props
 * @param {() => void} props.onClose
 * @param {(preset:Object) => void} props.applyTemplate
 */
export default function TemplateModal({ onClose, applyTemplate }) {
  const list = TECH_STACK.templates;
  return (
    <div className="template-modal" role="dialog" aria-modal="true" aria-label="Template Selection">
      <div className="template-dialog">
        <button className="close-btn" onClick={onClose} aria-label="Close template dialog">Close</button>
        <h2 style={{ marginTop: 0 }}>Templates</h2>
        <p style={{ marginTop: -8 }}>Choose a predefined stack (includes AI selections).</p>
        <div className="template-grid">
          {list.map(t => (
            <div className="template-card" key={t.id}>
              <h4>{t.name}</h4>
              <p>{t.description}</p>
              <button onClick={() => applyTemplate(t.preset)}>Use</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
