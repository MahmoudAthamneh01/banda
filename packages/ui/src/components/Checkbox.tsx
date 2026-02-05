import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

/**
 * Checkbox - Form input for multiple selections
 * 
 * Allows users to select one or more options
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className = '', disabled, ...props }, ref) => {
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
              type="checkbox"
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-5 h-5 border-2 rounded transition-all ${
                error
                  ? 'border-danger-500'
                  : 'border-ink-700 peer-checked:border-panda-500 peer-checked:bg-panda-500'
              } ${
                !disabled && 'group-hover:border-panda-400 peer-checked:group-hover:bg-panda-400'
              } ${indeterminate ? 'bg-panda-500' : 'peer-checked:bg-panda-500'} ${className}`}
            >
              <Check
                className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                size={14}
              />
              {indeterminate && (
                <div className="absolute inset-0 m-auto w-2 h-0.5 bg-white" />
              )}
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
