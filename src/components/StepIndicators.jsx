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
        const step = i + 1;
        const state = step === currentStep ? 'active' : (step < currentStep ? 'completed' : '');
        return (
          <button
            key={label}
            className={`step-indicator ${state}`}
            aria-selected={step === currentStep}
            aria-label={`Step ${step}: ${label}`}
            onClick={() => setStep(step)}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
}
