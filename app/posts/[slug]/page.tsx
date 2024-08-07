import { createReader } from "@keystatic/core/reader";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import keystaticConfig from "../../../keystatic.config";
import { Button } from "flowbite-react/components/Button";

const reader = createReader( process.cwd(), keystaticConfig );

export default async function Post ( { params }: { params: { slug: string } } )
{
  const post = await reader.collections.posts.read( params.slug );
  if ( !post )
  {
    return <div>No Post Found</div>;
  }
  const { node } = await post.content();
  const errors = Markdoc.validate( node );
  if ( errors.length )
  {
    console.error( errors );
    throw new Error( 'Invalid content' );
  }
  const renderable = Markdoc.transform( node );
  return (
    <>
      <h1 className="text-3xl font-extrabold">{ post.title }</h1>
      { post.image && (
        <Image
          src={ post.image }
          alt={ post.title }
          width={ 400 }
          height={ 300 }
        />
      ) }
      <p>Posted on: { post.datePosted } </p>
      { Markdoc.renderers.react( renderable, React ) }
      <hr />
      <Button color='blue' href={ `/posts` }>Back to Posts</Button>
    </>
  );
}