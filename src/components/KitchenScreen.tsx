import { useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle, ChefHat } from '@phosphor-icons/react';
import { Order, OrderStatus } from '@/lib/types';
import { formatTime, calculateOrderTime, getOrderUrgency } from '@/lib/data';
import { toast } from 'sonner';

export function KitchenScreen() {
  const [orders, setOrders] = useKV<Order[]>('orders', []);

  const activeOrders = useMemo(() => {
    return (orders || []).filter((order) =>
      ['pending', 'preparing'].includes(order.status)
    ).sort((a, b) => a.createdAt - b.createdAt);
  }, [orders]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      (prevOrders || []).map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: Date.now(), ...(status === 'completed' ? { completedAt: Date.now() } : {}) }
          : order
      )
    );
    toast.success(`Order updated to ${status}`);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'preparing':
        return 'bg-primary text-primary-foreground';
      case 'ready':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUrgencyBorder = (order: Order) => {
    const urgency = getOrderUrgency(order);
    switch (urgency) {
      case 'urgent':
        return 'border-l-4 border-l-destructive';
      case 'warning':
        return 'border-l-4 border-l-warning';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" weight="duotone" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display</h1>
              <p className="text-sm text-muted-foreground">
                {activeOrders.length} active {activeOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <ChefHat className="w-16 h-16 mb-4 opacity-50" weight="duotone" />
            <p className="text-lg font-semibold">No Active Orders</p>
            <p className="text-sm">New orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className={`p-4 space-y-3 ${getUrgencyBorder(order)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">#{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.source}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(order.createdAt)}</span>
                  <span className="text-muted-foreground">
                    ({calculateOrderTime(order)} min ago)
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="bg-warning/10 p-2 rounded text-sm">
                    <p className="font-semibold">Note:</p>
                    <p>{order.notes}</p>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  {order.status === 'pending' && (
                    <Button
                      className="w-full"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      className="w-full bg-success hover:bg-success/90"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Ready
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
