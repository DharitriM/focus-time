import { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, year, weekday };
  };

  const { hours, minutes, seconds } = formatTime(time);
  const { day, month, year, weekday } = formatDate(time);

  return (
    <div className="lcd-panel rounded-2xl p-8 mb-8">
      <div className="text-center">
        {/* Main time display */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="digital-text text-6xl md:text-8xl tracking-wider text-primary">
            {hours}
          </span>
          <span className="digital-text text-6xl md:text-8xl animate-blink text-primary">:</span>
          <span className="digital-text text-6xl md:text-8xl tracking-wider text-primary">
            {minutes}
          </span>
          <span className="digital-text text-6xl md:text-8xl animate-blink text-primary">:</span>
          <span className="digital-text text-6xl md:text-8xl tracking-wider text-primary">
            {seconds}
          </span>
        </div>

        {/* Date display */}
        <div className="flex flex-col items-center gap-1">
          <span className="digital-text-dim text-lg tracking-widest uppercase">
            {weekday}
          </span>
          <span className="digital-text-accent text-xl tracking-wider">
            {day}/{month}/{year}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
