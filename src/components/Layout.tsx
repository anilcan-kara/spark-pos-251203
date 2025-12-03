import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  House,
  ChartBar,
  ChefHat,
  Calculator,
  SignOut,
  Receipt,
  UserCircle,
  Gear,
} from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  const getRoleViews = (role: UserRole) => {
    const baseViews = [
      { id: 'pos', label: 'POS', icon: Receipt, roles: ['cashier', 'waiter'] },
      { id: 'kitchen', label: 'Kitchen', icon: ChefHat, roles: ['kitchen', 'manager'] },
      { id: 'manager', label: 'Dashboard', icon: ChartBar, roles: ['manager'] },
      { id: 'accountant', label: 'Finance', icon: Calculator, roles: ['accountant', 'manager'] },
    ];

    return baseViews.filter((view) => view.roles.includes(role));
  };

  const availableViews = currentUser ? getRoleViews(currentUser.role) : [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'manager':
        return 'bg-primary text-primary-foreground';
      case 'kitchen':
        return 'bg-warning text-warning-foreground';
      case 'accountant':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary-foreground" weight="bold" />
            </div>
            <span className="font-bold text-xl">POS Pro</span>
          </div>

          <nav className="flex items-center gap-2">
            {availableViews.map((view) => (
              <Button
                key={view.id}
                variant={currentView === view.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(view.id)}
                className="gap-2"
              >
                <view.icon className="w-4 h-4" weight={currentView === view.id ? 'fill' : 'regular'} />
                {view.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </Badge>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <SignOut className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
