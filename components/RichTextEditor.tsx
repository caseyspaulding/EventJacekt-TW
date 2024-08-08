import React, { useCallback, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient( 'https://mphgaanpbwsetutodyvl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGdhYW5wYndzZXR1dG9keXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwOTQyMDAsImV4cCI6MjAzNzY3MDIwMH0.wzzXs8PWbo4QyHv142w9Oy1q-2nYtDz8A4lRuuN_jLo' );

interface RichTextEditorProps
{
  value: string;
  onChange: ( content: string ) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ( { value, onChange } ) =>
{
  const quillRef = useRef<ReactQuill>( null );

  const imageHandler = useCallback( () =>
  {
    const input = document.createElement( 'input' );
    input.setAttribute( 'type', 'file' );
    input.setAttribute( 'accept', 'image/*' );
    input.click();

    input.onchange = async () =>
    {
      const file = input.files?.[ 0 ];
      if ( !file ) return;

      try
      {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from( 'images' ) // Replace 'images' with your bucket name
          .upload( `blog-images/${ Date.now() }-${ file.name }`, file );

        if ( error ) throw error;

        // Get public URL of the uploaded image
        const { data: { publicUrl }} = supabase.storage
          .from( 'images' )
          .getPublicUrl( data.path );

        

        // Insert image into editor
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection( true );
        if ( quill && range )
        {
          quill.insertEmbed( range.index, 'image', publicUrl );
        }
      } catch ( error )
      {
        console.error( 'Error uploading image: ', error );
        // Handle error (e.g., show a notification to the user)
      }
    };
  }, [] );

  const modules = {
    toolbar: {
      container: [
        [ { 'header': [ 1, 2, false ] } ],
        [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
        [ 'link', 'image' ],
        [ 'clean' ]
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  return (
    <ReactQuill
      ref={ quillRef }
      theme="snow"
      value={ value }
      onChange={ onChange }
      modules={ modules }
    />
  );
};

export default RichTextEditor;