import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { CashierScreen } from './components/CashierScreen';
import { KitchenScreen } from './components/KitchenScreen';
import { ManagerScreen } from './components/ManagerScreen';
import { AccountantScreen } from './components/AccountantScreen';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('pos');

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case 'cashier':
        case 'waiter':
          setCurrentView('pos');
          break;
        case 'kitchen':
          setCurrentView('kitchen');
          break;
        case 'manager':
          setCurrentView('manager');
          break;
        case 'accountant':
          setCurrentView('accountant');
          break;
      }
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'pos':
        return <CashierScreen />;
      case 'kitchen':
        return <KitchenScreen />;
      case 'manager':
        return <ManagerScreen />;
      case 'accountant':
        return <AccountantScreen />;
      default:
        return <CashierScreen />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;