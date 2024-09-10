import React from 'react';
import { Button } from '@nextui-org/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';


interface QuantitySelectorProps
{
  quantity: number;
  setQuantity: ( quantity: number ) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ( { quantity, setQuantity, min = 0, max = Infinity } ) =>
{
  const handleDecrement = () =>
  {
    if ( quantity > min )
    {
      setQuantity( quantity - 1 );
    }
  };

  const handleIncrement = () =>
  {
    if ( quantity < max )
    {
      setQuantity( quantity + 1 );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={ handleDecrement }
        disabled={ quantity <= min }
        className="p-2 bg-gray-200 rounded-full"
        size="sm"
      >
        <MinusIcon  />
      </Button>
      <span className="w-8 text-center font-semibold">{ quantity }</span>
      <Button
        onClick={ handleIncrement }
        disabled={ quantity >= max }
        className="p-2 bg-blue-500 text-white rounded-full"
        size="sm"
      >
        <PlusIcon  />
      </Button>
    </div>
  );
};

export default QuantitySelector;