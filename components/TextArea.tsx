import * as React from 'react';

interface ITextAreaProps
{
	name: string;
	rows?: number;
	cols?: number;
	role?: string;
	defaultValue?: string | number;
	handleChange: ( target: any ) => void;
	hideLabel?: boolean;
	value?: string | number;
	label?: string;
	placeholder?: string; // New prop for placeholder text
}

export const TextArea = ( { name, handleChange, role, rows, cols, defaultValue, hideLabel, value, label, placeholder }: ITextAreaProps ) =>
{
	return (
		<div style={ { display: 'flex', flexDirection: 'column', marginBottom: '6px', whiteSpace: 'pre-line' } }>
			{ !hideLabel && <label htmlFor={ name }>{ label || name }</label> }
			<textarea
				id={ name }
				name={ name }
				onChange={ handleChange }
				rows={ rows }
				cols={ cols }
				role={ role }
				defaultValue={ defaultValue }
				value={ value }
				placeholder={ placeholder } // Apply placeholder here
			/>
		</div>
	);
}
