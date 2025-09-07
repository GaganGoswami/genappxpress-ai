import React from 'react';

/**
 * TechOption - Technology selection card
 * @param {Object} props
 * @param {Object} props.tech
 * @param {string} props.category
 * @param {boolean} props.isSelected
 * @param {(cat:string,id:string)=>void} props.onToggle
 * @param {boolean} props.isIncompatible
 */
export default function TechOption({ tech, category, isSelected, onToggle, isIncompatible }) {
  return (
    <div
      className={`tech-option${isSelected ? ' selected' : ''}${isIncompatible ? ' incompatible' : ''}`}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={tech.name + (isIncompatible ? ' incompatible' : '')}
      tabIndex={isIncompatible ? -1 : 0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !isIncompatible) {
          e.preventDefault();
          onToggle(category, tech.id);
        }
      }}
      onClick={() => !isIncompatible && onToggle(category, tech.id)}
    >
      <div className="checkbox">{isSelected ? '✓' : ''}</div>
      <h4>{tech.name}</h4>
      <p>{tech.description}</p>
      <div className="badge-bar">
        {tech.compatible && tech.compatible.slice(0, 3).map(c => (
          <span key={c} className="tag" title="Compatible tag">{c}</span>
        ))}
      </div>
    </div>
  );
}
