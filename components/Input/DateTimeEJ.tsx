import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import styles from './InputEJ.module.css';

// Define the types for the props
interface DateTimeFieldProps extends InputHTMLAttributes<HTMLInputElement>
{
  label: string;
  variant?: 'outlined' | 'standard';
  type?: 'date' | 'time'; // Restrict types to 'date' or 'time'
}

// Use forwardRef to pass the ref to the input element
const DateTimeFieldEJ = forwardRef<HTMLInputElement, DateTimeFieldProps>(
  ( { label, variant = 'outlined', type = 'date', ...props }, ref ) =>
  {
    // Date and time inputs do not need floating placeholders
    const renderLabel = type !== 'date' && type !== 'time';

    return (
      <div className={ variant === 'outlined' ? styles[ 'outlined-input' ] : styles[ 'standard-input' ] }>
        <input
          ref={ ref }
          type={ type }
          { ...props }
          placeholder={ renderLabel ? ' ' : undefined }
          className={ `${ styles.input } ${ props.className || '' }` }
        />
        { renderLabel && <label>{ label }</label> }
        { variant === 'standard' && <span className={ styles[ 'underline' ] }></span> }
      </div>
    );
  }
);

// Set displayName for better debugging experience in React DevTools
DateTimeFieldEJ.displayName = 'DateTimeFieldEJ';

export default DateTimeFieldEJ;
