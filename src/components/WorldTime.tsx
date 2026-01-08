import { useState, useEffect } from 'react';

interface TimeZone {
  id: string;
  name: string;
  offset: number;
  city: string;
  country: string;
}

const timeZones: TimeZone[] = [
  { id: 'utc', name: 'UTC', offset: 0, city: 'London', country: 'UK' },
  { id: 'ist', name: 'IST', offset: 5.5, city: 'Mumbai', country: 'India' },
  { id: 'est', name: 'EST', offset: -5, city: 'New York', country: 'USA' },
  { id: 'pst', name: 'PST', offset: -8, city: 'Los Angeles', country: 'USA' },
  { id: 'cst', name: 'CST', offset: -6, city: 'Chicago', country: 'USA' },
  { id: 'cet', name: 'CET', offset: 1, city: 'Paris', country: 'France' },
  { id: 'jst', name: 'JST', offset: 9, city: 'Tokyo', country: 'Japan' },
  { id: 'aest', name: 'AEST', offset: 10, city: 'Sydney', country: 'Australia' },
  { id: 'gmt', name: 'GMT', offset: 0, city: 'Dublin', country: 'Ireland' },
  { id: 'hkt', name: 'HKT', offset: 8, city: 'Hong Kong', country: 'China' },
  { id: 'sgt', name: 'SGT', offset: 8, city: 'Singapore', country: 'Singapore' },
  { id: 'brt', name: 'BRT', offset: -3, city: 'São Paulo', country: 'Brazil' },
];

const WorldTime = () => {
  const [selectedZones, setSelectedZones] = useState<string[]>(['ist', 'utc', 'est', 'pst']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeInZone = (offset: number) => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utc + (offset * 3600000));
    
    return {
      hours: zoneTime.getHours().toString().padStart(2, '0'),
      minutes: zoneTime.getMinutes().toString().padStart(2, '0'),
      seconds: zoneTime.getSeconds().toString().padStart(2, '0'),
      date: zoneTime.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short',
        weekday: 'short'
      }),
      isNextDay: zoneTime.getDate() !== currentTime.getDate(),
      isPrevDay: zoneTime.getDate() < currentTime.getDate(),
    };
  };

  const toggleZone = (zoneId: string) => {
    if (selectedZones.includes(zoneId)) {
      if (selectedZones.length > 1) {
        setSelectedZones(selectedZones.filter(id => id !== zoneId));
      }
    } else {
      setSelectedZones([...selectedZones, zoneId]);
    }
  };

  const formatOffset = (offset: number) => {
    const sign = offset >= 0 ? '+' : '';
    const hours = Math.floor(Math.abs(offset));
    const minutes = (Math.abs(offset) % 1) * 60;
    return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
  };

  return (
    <div className="lcd-panel rounded-2xl p-6">
      <h2 className="digital-text text-xl text-primary mb-6 text-center">WORLD TIME</h2>

      {/* Zone Selector Dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full btn-digital-secondary flex items-center justify-between"
        >
          <span>Select Time Zones ({selectedZones.length})</span>
          <svg 
            className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {timeZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => toggleZone(zone.id)}
                className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors ${
                  selectedZones.includes(zone.id) ? 'bg-secondary' : ''
                }`}
              >
                <div>
                  <span className="font-digital text-sm text-foreground">{zone.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">
                    {zone.city}, {zone.country}
                  </span>
                </div>
                {selectedZones.includes(zone.id) && (
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Time Zones Display */}
      <div className="space-y-4">
        {selectedZones.map((zoneId) => {
          const zone = timeZones.find(z => z.id === zoneId);
          if (!zone) return null;
          
          const time = getTimeInZone(zone.offset);
          
          return (
            <div 
              key={zone.id}
              className="p-4 bg-secondary/50 rounded-lg glow-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-digital text-lg text-primary">{zone.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    {zone.city}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs font-digital">
                  {formatOffset(zone.offset)}
                </span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="digital-text text-3xl text-primary">
                  {time.hours}:{time.minutes}
                </span>
                <span className="digital-text-dim text-xl">
                  :{time.seconds}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  {time.date}
                  {time.isNextDay && <span className="text-accent ml-1">+1</span>}
                  {time.isPrevDay && <span className="text-digital-amber ml-1">-1</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Difference Info */}
      {selectedZones.length >= 2 && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="digital-text-dim text-xs mb-3">TIME DIFFERENCES</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {selectedZones.slice(0, -1).map((zoneId, idx) => {
              const zone1 = timeZones.find(z => z.id === zoneId);
              const zone2 = timeZones.find(z => z.id === selectedZones[idx + 1]);
              if (!zone1 || !zone2) return null;
              
              const diff = zone2.offset - zone1.offset;
              const diffHours = Math.abs(diff);
              const sign = diff >= 0 ? '+' : '-';
              
              return (
                <div key={`${zone1.id}-${zone2.id}`} className="text-muted-foreground">
                  <span className="text-foreground">{zone1.name}</span>
                  <span className="mx-1">→</span>
                  <span className="text-foreground">{zone2.name}</span>
                  <span className="text-primary ml-2">{sign}{diffHours}h</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldTime;
