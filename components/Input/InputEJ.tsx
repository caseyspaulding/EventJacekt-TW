import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './InputEJ.module.css';

// Define the types for the props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>
{
  label: string;
  variant?: 'outlined' | 'standard';
}

const InputFieldEJ: React.FC<InputFieldProps> = ( { label, variant = 'outlined', ...props } ) =>
{
  return (
    <div className={ variant === 'outlined' ? styles[ 'outlined-input' ] : styles[ 'standard-input' ] }>
      <input { ...props } placeholder=" " />
      <label>{ label }</label>
      { variant === 'standard' && <span className={ styles[ 'underline' ] }></span> }
    </div>
  );
};

export default InputFieldEJ;
