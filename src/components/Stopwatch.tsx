import { useState, useEffect, useRef } from 'react';

interface Lap {
  id: number;
  time: number;
  diff: number;
}

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        accumulatedTimeRef.current = time;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0'),
    };
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    accumulatedTimeRef.current = 0;
    setLaps([]);
  };

  const handleLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const diff = time - lastLapTime;
    setLaps([{ id: laps.length + 1, time, diff }, ...laps]);
  };

  const { minutes, seconds, centiseconds } = formatTime(time);

  const getBestAndWorst = () => {
    if (laps.length < 2) return { best: -1, worst: -1 };
    const diffs = laps.map(lap => lap.diff);
    const best = Math.min(...diffs);
    const worst = Math.max(...diffs);
    return { best, worst };
  };

  const { best, worst } = getBestAndWorst();

  return (
    <div className="lcd-panel rounded-2xl p-6">
      <h2 className="digital-text text-xl text-primary mb-6 text-center">STOPWATCH</h2>

      {/* Time Display */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <span className="digital-text text-5xl md:text-7xl tracking-wider text-primary">
            {minutes}
          </span>
          <span className="digital-text text-5xl md:text-7xl text-primary">:</span>
          <span className="digital-text text-5xl md:text-7xl tracking-wider text-primary">
            {seconds}
          </span>
          <span className="digital-text text-3xl md:text-5xl text-digital-dim">.</span>
          <span className="digital-text text-3xl md:text-5xl tracking-wider text-digital-dim">
            {centiseconds}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {!isRunning ? (
          <>
            <button onClick={handleStart} className="btn-digital">
              {time === 0 ? 'START' : 'RESUME'}
            </button>
            {time > 0 && (
              <button onClick={handleReset} className="btn-digital-danger">
                RESET
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={handleLap} className="btn-digital-secondary">
              LAP
            </button>
            <button onClick={handlePause} className="btn-digital">
              PAUSE
            </button>
          </>
        )}
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="mt-6">
          <h3 className="digital-text-dim text-sm mb-3 text-center">LAPS</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {laps.map((lap) => {
              const lapTime = formatTime(lap.diff);
              const totalTime = formatTime(lap.time);
              const isBest = lap.diff === best && laps.length >= 2;
              const isWorst = lap.diff === worst && laps.length >= 2;
              
              return (
                <div 
                  key={lap.id} 
                  className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                    isBest ? 'bg-accent/20 border border-accent/30' : 
                    isWorst ? 'bg-destructive/20 border border-destructive/30' : 
                    'bg-muted/50'
                  }`}
                >
                  <span className={`font-digital text-sm ${
                    isBest ? 'text-accent' : isWorst ? 'text-digital-red' : 'text-muted-foreground'
                  }`}>
                    LAP {lap.id.toString().padStart(2, '0')}
                  </span>
                  <span className={`font-digital text-sm ${
                    isBest ? 'text-accent' : isWorst ? 'text-digital-red' : 'text-foreground'
                  }`}>
                    +{lapTime.minutes}:{lapTime.seconds}.{lapTime.centiseconds}
                  </span>
                  <span className="font-digital text-sm text-muted-foreground">
                    {totalTime.minutes}:{totalTime.seconds}.{totalTime.centiseconds}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
