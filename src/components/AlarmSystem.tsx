import { useState, useEffect, useRef, useCallback } from 'react';

interface Alarm {
  id: number;
  time: string;
  enabled: boolean;
  label: string;
}

const AlarmSystem = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAlarmSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'square';
    gainNode.gain.value = 0.2;
    
    oscillator.start();
    
    // Beep pattern
    let beepCount = 0;
    const beepInterval = setInterval(() => {
      if (beepCount >= 5 || !activeAlarm) {
        oscillator.stop();
        clearInterval(beepInterval);
        return;
      }
      gainNode.gain.value = gainNode.gain.value > 0 ? 0 : 0.2;
      beepCount++;
    }, 300);

    return () => {
      oscillator.stop();
      clearInterval(beepInterval);
    };
  }, [activeAlarm]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime && now.getSeconds() === 0) {
          setActiveAlarm(alarm);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ Alarm: ${alarm.label || 'Time!'}`, {
              body: `It's ${alarm.time}`,
              requireInteraction: true,
            });
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  useEffect(() => {
    if (activeAlarm) {
      const cleanup = playAlarmSound();
      return cleanup;
    }
  }, [activeAlarm, playAlarmSound]);

  const addAlarm = () => {
    if (!newAlarmTime) return;
    
    const newAlarm: Alarm = {
      id: Date.now(),
      time: newAlarmTime,
      enabled: true,
      label: newAlarmLabel || `Alarm ${alarms.length + 1}`,
    };
    
    setAlarms([...alarms, newAlarm]);
    setNewAlarmLabel('');
  };

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: number) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const dismissAlarm = () => {
    setActiveAlarm(null);
  };

  return (
    <div className="lcd-panel rounded-2xl p-6">
      <h2 className="digital-text text-xl text-primary mb-6 text-center">ALARMS</h2>

      {/* Active Alarm Alert */}
      {activeAlarm && (
        <div className="mb-6 p-4 bg-digital-amber/20 border border-digital-amber/50 rounded-lg animate-pulse">
          <div className="text-center">
            <p className="digital-text-amber text-2xl mb-2">⏰ ALARM!</p>
            <p className="digital-text text-xl text-digital-amber">{activeAlarm.time}</p>
            <p className="text-muted-foreground mt-1">{activeAlarm.label}</p>
            <button 
              onClick={dismissAlarm}
              className="btn-digital mt-4"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Add New Alarm */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            className="input-digital flex-1"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAlarmLabel}
            onChange={(e) => setNewAlarmLabel(e.target.value)}
            placeholder="Alarm label (optional)"
            className="input-digital flex-1 text-sm"
          />
          <button onClick={addAlarm} className="btn-digital">
            ADD
          </button>
        </div>
      </div>

      {/* Alarms List */}
      <div className="space-y-3">
        {alarms.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No alarms set
          </p>
        ) : (
          alarms.map((alarm) => (
            <div 
              key={alarm.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                alarm.enabled 
                  ? 'bg-secondary glow-border' 
                  : 'bg-muted/30 opacity-50'
              }`}
            >
              <div className="flex-1">
                <p className={`font-digital text-2xl ${
                  alarm.enabled ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {alarm.time}
                </p>
                <p className="text-sm text-muted-foreground">{alarm.label}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    alarm.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all ${
                      alarm.enabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="text-muted-foreground hover:text-digital-red transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmSystem;
