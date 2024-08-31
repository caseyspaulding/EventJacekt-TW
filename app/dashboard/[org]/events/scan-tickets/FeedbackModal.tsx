import React from 'react';

interface FeedbackModalProps
{
  type: 'success' | 'error';
  isOpen: boolean;
  message: string;  // Add message prop
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ( { type, isOpen, message, onClose } ) =>
{
  if ( !isOpen ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center justify-center">
        { type === 'success' ? (
          <>
            <img src="/images/success-checkmark.png" alt="Success" width={ 100 } height={ 100 } className="mb-4" />
            <p className="text-green-600 font-semibold">{ message }</p>
          </>
        ) : (
          <>
            <img src="/images/error-cross.png" alt="Error" width={ 100 } height={ 100 } className="mb-4" />
            <p className="text-red-600 font-semibold">{ message }</p>
          </>
        ) }
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={ onClose }
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
