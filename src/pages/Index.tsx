import { useState } from 'react';
import DigitalClock from '@/components/DigitalClock';
import TabNavigation from '@/components/TabNavigation';
import StudyTimer from '@/components/StudyTimer';
import Stopwatch from '@/components/Stopwatch';
import AlarmSystem from '@/components/AlarmSystem';
import WorldTime from '@/components/WorldTime';

type TabType = 'timer' | 'stopwatch' | 'alarm' | 'world';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('timer');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'timer':
        return <StudyTimer />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'alarm':
        return <AlarmSystem />;
      case 'world':
        return <WorldTime />;
      default:
        return <StudyTimer />;
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="digital-text text-2xl text-primary tracking-widest mb-1">
            FOCUS STATION
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Study Productivity Suite
          </p>
        </header>

        {/* Main Clock Display */}
        <DigitalClock />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Active Tab Content */}
        <main className="animate-in fade-in duration-300">
          {renderActiveComponent()}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-muted-foreground/50 text-xs font-mono">
            Stay focused. Stay productive.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
