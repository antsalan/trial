import { Link, useLocation } from "wouter";
import { useWebSocket } from "@/hooks/use-websocket";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const { isConnected } = useWebSocket();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', testId: 'nav-dashboard' },
    { path: '/buses', icon: 'fas fa-bus', label: 'Bus Management', testId: 'nav-buses' },
    { path: '/stations', icon: 'fas fa-map-marker-alt', label: 'Stations', testId: 'nav-stations' },
    { path: '/dispatch', icon: 'fas fa-route', label: 'Dispatch', testId: 'nav-dispatch' },
    { path: '/alerts', icon: 'fas fa-exclamation-triangle', label: 'Alerts', testId: 'nav-alerts' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings', testId: 'nav-settings' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location === '/' || location === '/dashboard';
    }
    return location === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm fixed w-full top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">
              <i className="fas fa-bus mr-2 text-primary"></i>
              Bus Monitoring System
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-secondary px-3 py-1 rounded-md">
              <i className="fas fa-clock text-primary text-sm"></i>
              <span className="text-sm font-mono" data-testid="current-time">{currentTime}</span>
            </div>
            
            <button 
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-alerts"
            >
              <i className="fas fa-bell"></i>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-user text-primary-foreground text-sm"></i>
              </div>
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                data-testid={item.testId}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}