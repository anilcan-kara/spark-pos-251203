import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Lock } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth-context';

export function LoginScreen() {
  const { setCurrentUser } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('cashier');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    if (name && role) {
      setCurrentUser({
        id: `user-${Date.now()}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@pos.com`,
        role,
        active: true,
      });
    }
  };

  const quickLogin = (role, name) => {
    setCurrentUser({
      id: `user-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@pos.com`,
      role,
      active: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Receipt className="w-8 h-8 text-primary-foreground" weight="duotone" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">POS Pro</h1>
          <p className="text-muted-foreground">Cloud Point of Sale System</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Staff Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN (Optional)</Label>
            <Input
              id="pin"
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            <Lock className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-medium mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => quickLogin('cashier', 'Sarah Cashier')}>
              Cashier
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('kitchen', 'Mike Chef')}>
              Kitchen
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('manager', 'John Manager')}>
              Manager
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('accountant', 'Lisa Accountant')}>
              Accountant
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
