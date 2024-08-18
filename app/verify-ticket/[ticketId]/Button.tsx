'use client';

import { Button, type ButtonProps } from 'flowbite-react';
import { useFormStatus } from 'react-dom';

type Props = ButtonProps & {
  pendingText?: string;
};

export function SubmitButton ( { children, pendingText, ...props }: Props )
{
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button { ...props } type="submit" aria-disabled={ isPending }>
      { isPending ? pendingText : children }
    </Button>
  );
}
