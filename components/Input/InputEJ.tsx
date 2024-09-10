import type { InputHTMLAttributes} from 'react';
import React, { forwardRef } from 'react';
import styles from './InputEJ.module.css';

// Define the types for the props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>
{
  label: string;
  variant?: 'outlined' | 'standard';
}

// Use forwardRef to pass the ref to the input element
const InputFieldEJ = forwardRef<HTMLInputElement, InputFieldProps>(
  ( { label, variant = 'outlined', ...props }, ref ) =>
  {
    return (
      <div className={ variant === 'outlined' ? styles[ 'outlined-input' ] : styles[ 'standard-input' ] }>
        <input ref={ ref } { ...props } placeholder=" " />
        <label>{ label }</label>
        { variant === 'standard' && <span className={ styles[ 'underline' ] }></span> }
      </div>
    );
  }
);

// Set displayName for better debugging experience in React DevTools
InputFieldEJ.displayName = 'InputFieldEJ';

export default InputFieldEJ;
