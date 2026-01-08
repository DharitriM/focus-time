import { Clock, Timer, Bell, Globe } from 'lucide-react';

type TabType = 'timer' | 'stopwatch' | 'alarm' | 'world';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'timer' as TabType, label: 'TIMER', icon: Timer },
  { id: 'stopwatch' as TabType, label: 'STOPWATCH', icon: Clock },
  { id: 'alarm' as TabType, label: 'ALARM', icon: Bell },
  { id: 'world' as TabType, label: 'WORLD', icon: Globe },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="flex justify-center mb-8">
      <div className="inline-flex bg-card rounded-xl p-1 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg font-digital text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
