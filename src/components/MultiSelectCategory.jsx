import React from 'react';
import TechOption from './TechOption';

/**
 * MultiSelectCategory - Renders a category of tech options
 * @param {Object} props
 * @param {string} props.category
 * @param {string[]} props.selected
 * @param {(cat:string,id:string)=>void} props.onToggle
 * @param {(cat:string,item:Object)=>boolean} [props.computeIncompat]
 */
export default function MultiSelectCategory({ category, selected, onToggle, computeIncompat }) {
  const TECH_STACK = require('../data/techData').TECH_STACK;
  const items = TECH_STACK[category] || [];
  return (
    <div className="section" aria-labelledby={`heading-${category}`}>
      <h2 id={`heading-${category}`}>{require('../data/techData').CATEGORY_LABELS[category]}</h2>
      <div className="tech-grid">
        {items.map(item => {
          const isSelected = selected.includes(item.id);
          const isIncompatible = computeIncompat && computeIncompat(category, item);
          return (
            <TechOption
              key={item.id}
              tech={item}
              category={category}
              isSelected={isSelected}
              onToggle={onToggle}
              isIncompatible={isIncompatible}
            />
          );
        })}
      </div>
    </div>
  );
}
