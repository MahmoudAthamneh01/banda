'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

/**
 * Switch - Toggle form input
 * 
 * Allows users to toggle between on/off states
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, className = '', disabled, checked, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label
          className={`flex items-center gap-3 cursor-pointer group ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              disabled={disabled}
              checked={checked}
              className="peer sr-only"
              {...props}
            />

            {/* Track */}
            <div
              className={`w-11 h-6 rounded-full transition-all ${
                error
                  ? 'bg-danger-500'
                  : 'bg-ink-700 peer-checked:bg-panda-500'
              } ${
                !disabled && 'group-hover:bg-ink-600 peer-checked:group-hover:bg-panda-400'
              } ${className}`}
            >
              {/* Thumb */}
              <motion.div
                animate={{
                  x: checked ? 22 : 2,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </div>
          </div>

          {label && (
            <span className="text-slate-200 text-sm select-none group-hover:text-panda-500 transition-colors">
              {label}
            </span>
          )}
        </label>

        {error && <span className="text-danger-500 text-xs ml-14">{error}</span>}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
