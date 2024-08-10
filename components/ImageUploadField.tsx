import * as React from 'react';

interface IImageUploadFieldProps
{
	name: string;
	handleChange: ( target: any ) => void;
	label?: string;  // Custom label prop
	hideName?: boolean;  // Prop to hide the name label
}

export const ImageUploadField = ( { name, handleChange, label, hideName }: IImageUploadFieldProps ) =>
{

	const retrievePathFile = ( files: any ) =>
	{
		const file = files[ 0 ];
		if ( file.type !== 'image/png' && file.type !== 'image/jpeg' )
		{
			console.error( 'Only png and jpg/jpeg allowed.' )
		} else
		{
			const target: any = {};
			const reader = new FileReader();
			reader.readAsDataURL( file );
			reader.onloadend = e =>
			{
				target.name = name;
				target.value = reader.result;
				target.logoName = file.name;
				handleChange( { target } );
			};
		}
	}

	return (
		<div style={  { display: 'flex', flexDirection: 'column', marginBottom: '6px' } }>
			{ !hideName && <label htmlFor={ name }>{ label || name }</label> }
			<input
				type='file'
				accept='image/*'
				name={ name }
				onChange={ e => retrievePathFile( e.target.files )
				
				 }
			/>
		</div>
	);
}
