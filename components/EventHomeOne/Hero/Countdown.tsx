"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps
{
  startDate: string; // Format: "Month Day, Year HH:mm:ss"
}

const Countdown: React.FC<CountdownProps> = ( { startDate } ) =>
{
  const calculateTimeLeft = () =>
  {
    const startDateTime = new Date( startDate ).getTime(); // Use the startDate prop
    const now = new Date().getTime();
    const timeRemaining = startDateTime - now;

    if ( timeRemaining > 0 )
    {
      const days = Math.floor( timeRemaining / ( 1000 * 60 * 60 * 24 ) );
      const hours = Math.floor(
        ( timeRemaining % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 )
      );
      const minutes = Math.floor(
        ( timeRemaining % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 )
      );
      const seconds = Math.floor( ( timeRemaining % ( 1000 * 60 ) ) / 1000 );

      return { days, hours, minutes, seconds };
    } else
    {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [ countdown, setCountdown ] = useState( calculateTimeLeft() );

  useEffect( () =>
  {
    const interval = setInterval( () =>
    {
      setCountdown( calculateTimeLeft() );
    }, 1000 );

    return () => clearInterval( interval );
  }, [ startDate ] );

  return (
    <div className=" text-left">
      <div className="flex flex-wrap gap-4">
        <div  className="flex flex-col">
          <span className="text-3xl font-bold">{ countdown.days }</span>
          <span className="text-sm">Days</span>
        </div>
        <div  className="flex flex-col">
          <span className="text-3xl font-bold">{ countdown.hours }</span>
          <span className="text-sm">Hours</span>
        </div>
        <div  className="flex flex-col">
          <span className="text-3xl font-bold">{ countdown.minutes }</span>
          <span className="text-sm">Minutes</span>
        </div>
        <div  className="flex flex-col">
          <span className="text-3xl font-bold">{ countdown.seconds }</span>
          <span className="text-sm">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
