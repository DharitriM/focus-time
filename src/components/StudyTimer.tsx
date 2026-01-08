import { useState, useEffect, useRef, useCallback } from 'react';

const StudyTimer = () => {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('25');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = ((duration - timeLeft) / duration) * 100;

  const playAlarm = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 500);

    // Try to send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Session Complete! 🎉', {
        body: 'Great work! Time to take a break.',
        icon: '⏰',
      });
    }
  }, []);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, playAlarm]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const handleSetDuration = () => {
    const mins = parseInt(inputMinutes) || 25;
    const newDuration = mins * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const presetTimes = [
    { label: '15m', value: 15 },
    { label: '25m', value: 25 },
    { label: '45m', value: 45 },
    { label: '60m', value: 60 },
    { label: '90m', value: 90 },
  ];

  return (
    <div className="lcd-panel rounded-2xl p-6">
      <h2 className="digital-text text-xl text-primary mb-6 text-center">STUDY TIMER</h2>

      {/* Timer Display */}
      <div className={`text-center mb-6 ${isCompleted ? 'animate-pulse-glow' : ''}`}>
        <span className={`digital-text text-5xl md:text-7xl tracking-wider ${
          isCompleted ? 'text-digital-amber' : 'text-primary'
        }`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary progress-glow rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="text-center mb-6">
        <span className="digital-text-dim text-sm">
          {progress.toFixed(1)}% COMPLETE
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {presetTimes.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setInputMinutes(preset.value.toString());
              const newDuration = preset.value * 60;
              setDuration(newDuration);
              setTimeLeft(newDuration);
              setIsCompleted(false);
            }}
            className={`btn-digital-secondary text-sm px-4 py-2 ${
              duration === preset.value * 60 ? 'border-primary text-primary' : ''
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Duration Input */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          className="input-digital w-20 text-center"
          min="1"
          max="480"
        />
        <span className="text-muted-foreground">min</span>
        <button onClick={handleSetDuration} className="btn-digital text-sm px-4 py-2">
          SET
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button onClick={handleStart} className="btn-digital">
            {timeLeft === 0 || isCompleted ? 'RESTART' : 'START'}
          </button>
        ) : (
          <button onClick={handlePause} className="btn-digital-secondary">
            PAUSE
          </button>
        )}
        <button onClick={handleReset} className="btn-digital-danger">
          RESET
        </button>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-6 text-center">
          <p className="digital-text-amber text-lg mb-2">🎉 SESSION COMPLETE!</p>
          <p className="text-muted-foreground text-sm">
            Great focus! Consider taking a 5-10 minute break.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
