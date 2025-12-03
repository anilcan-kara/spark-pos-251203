import { useState, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MagnifyingGlass, 
  Plus, 
  Minus, 
  Trash, 
  CreditCard, 
  Money,
  ShoppingCart,
  X,
} from '@phosphor-icons/react';
import { MenuItem, Order, OrderItem, OrderSource } from '@/lib/types';
import { generateMenuItems, MENU_CATEGORIES, formatCurrency, calculateOrderTotals, generateOrderNumber } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CashierScreen() {
  const { currentUser } = useAuth();
  const [menuItems] = useKV<MenuItem[]>('menu-items', generateMenuItems());
  const [orders, setOrders] = useKV<Order[]>('orders', []);
  const [currentCart, setCurrentCart] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(MENU_CATEGORIES[0]);
  const [orderSource, setOrderSource] = useState<OrderSource>('dine-in');
  const [discount, setDiscount] = useState(0);

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.available;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const addToCart = (menuItem: MenuItem) => {
    setCurrentCart((cart) => {
      const existingItem = cart.find((item) => item.menuItemId === menuItem.id);
      if (existingItem) {
        return cart.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...cart,
        {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCurrentCart((cart) => {
      return cart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCurrentCart((cart) => cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCurrentCart([]);
    setDiscount(0);
  };

  const totals = useMemo(() => {
    return calculateOrderTotals(currentCart, discount, 0);
  }, [currentCart, discount]);

  const completeOrder = (paymentMethod: 'cash' | 'card') => {
    if (currentCart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      items: currentCart,
      status: 'pending',
      source: orderSource,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      tip: 0,
      total: totals.total,
      paymentMethod,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: currentUser?.id || 'unknown',
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    toast.success(`Order #${newOrder.orderNumber} completed - $${totals.total.toFixed(2)}`);
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col bg-background">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center gap-3">
            <Select value={orderSource} onValueChange={(v) => setOrderSource(v as OrderSource)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">Dine-In</SelectItem>
                <SelectItem value="takeout">Takeout</SelectItem>
                <SelectItem value="uber-eats">Uber Eats</SelectItem>
                <SelectItem value="doordash">DoorDash</SelectItem>
                <SelectItem value="yemeksepeti">Yemeksepeti</SelectItem>
                <SelectItem value="getir">Getir</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              {MENU_CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="p-3 cursor-pointer hover:border-primary transition-colors"
                onClick={() => addToCart(item)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                    <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  )}
                  <p className="text-lg font-bold">{formatCurrency(item.price)}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-96 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="font-bold text-lg">Current Order</h2>
            </div>
            {currentCart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {currentCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
              <p>Cart is empty</p>
              <p className="text-sm">Add items to start an order</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentCart.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <div className="flex-1 text-right font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%)</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-destructive">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={() => completeOrder('card')}
              disabled={currentCart.length === 0}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay with Card
            </Button>
            <Button
              className="w-full"
              variant="outline"
              size="lg"
              onClick={() => completeOrder('cash')}
              disabled={currentCart.length === 0}
            >
              <Money className="w-5 h-5 mr-2" />
              Pay with Cash
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
