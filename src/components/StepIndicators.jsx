import React from 'react';

/**
 * StepIndicators - Wizard step navigation bar
 * @param {Object} props
 * @param {number} props.currentStep
 * @param {string[]} props.steps
 * @param {(step:number)=>void} props.setStep
 */
export default function StepIndicators({ currentStep, steps, setStep }) {
  return (
    <div className="steps-bar" role="tablist" aria-label="Wizard Steps">
      {steps.map((label, i) => {
        // Use zero-based indices; stepIndex is i
        const state = i === currentStep ? 'active' : (i < currentStep ? 'completed' : '');
        return (
          <button
            key={label}
            className={`step-indicator ${state}`}
            aria-selected={i === currentStep}
            aria-label={`Step ${i}: ${label}`}
            onClick={() => setStep(i)}
          >
            {i+1}
          </button>
        );
      })}
    </div>
  );
}
