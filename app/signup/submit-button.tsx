'use client';

import type { ButtonProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom'; 

type Props = ButtonProps & {
    pendingText?: string;
};

export function SubmitButton ( { children, pendingText = "Loading...", ...props }: Props )
{
    const { pending, action } = useFormStatus();

    const isPending = pending && action === props.formAction;

    return (
        <Button
            { ...props }
            disabled={ isPending } // Use 'disabled' directly for button disable state
        >
            { isPending ? pendingText : children }
        </Button>
    );
}
