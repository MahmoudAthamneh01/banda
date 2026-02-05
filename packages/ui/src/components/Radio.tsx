import React, { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

/**
 * Radio - Form input for single selection
 * 
 * Allows users to select one option from a group
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label
          className={`flex items-center gap-2 cursor-pointer group ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative">
            <input
              ref={ref}
              type="radio"
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-5 h-5 border-2 rounded-full transition-all ${
                error
                  ? 'border-danger-500'
                  : 'border-ink-700 peer-checked:border-panda-500'
              } ${
                !disabled && 'group-hover:border-panda-400'
              } ${className}`}
            >
              <div
                className="absolute inset-0 m-auto w-2.5 h-2.5 bg-panda-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity scale-0 peer-checked:scale-100"
              />
            </div>
          </div>

          {label && (
            <span className="text-slate-200 text-sm select-none group-hover:text-panda-500 transition-colors">
              {label}
            </span>
          )}
        </label>

        {error && <span className="text-danger-500 text-xs ml-7">{error}</span>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
