
import React from 'react';
import { useElectionContext } from '@/contexts/ElectionContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Check, Plus, Settings, User, Users, Vote } from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useElectionContext();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-sidebar-accent text-sidebar-accent-foreground' : '';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2">
              <Vote className="h-8 w-8 text-election-accent" />
              <h1 className="text-2xl font-bold text-white">ElectPro</h1>
            </div>
            <div className="text-xs text-slate-300 mt-1">Corporate Election Platform</div>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <nav className="space-y-1 mt-4">
              <Link to="/" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive('/')}`}>
                <Calendar className="h-5 w-5" />
                <span>Elections</span>
              </Link>
              
              <Link to="/create" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive('/create')}`}>
                <Plus className="h-5 w-5" />
                <span>Create Election</span>
              </Link>
              
              <Link to="/results" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive('/results')}`}>
                <Check className="h-5 w-5" />
                <span>Results</span>
              </Link>
              
              <Link to="/settings" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive('/settings')}`}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <User className="h-4 w-4" />
                    <span>{currentUser.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="w-full bg-sidebar-accent hover:bg-sidebar-accent-foreground hover:text-sidebar-accent text-sidebar-accent-foreground"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button 
                    className="w-full bg-election-accent text-black hover:bg-yellow-400"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="flex p-4 border-b items-center">
            <SidebarTrigger />
            <h1 className="text-xl font-medium ml-2">ElectPro</h1>
            <div className="flex-1" />
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentUser.name}</span>
                <User className="h-5 w-5" />
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
