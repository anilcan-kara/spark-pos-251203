import { useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, Money, Receipt, Users, TrendUp } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export function ManagerScreen() {
  const [orders] = useKV('orders', []);
  const [staff] = useKV('staff-users', []);

  const todayStart = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  }, []);

  const todayOrders = useMemo(() => {
    return (orders || []).filter((order) => order.createdAt >= todayStart && order.status === 'completed');
  }, [orders, todayStart]);

  const stats = useMemo(() => {
    const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = todayOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    const byPaymentMethod = todayOrders.reduce((acc, order) => {
      if (order.paymentMethod) {
        acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
      }
      return acc;
    }, {});

    const bySource = todayOrders.reduce((acc, order) => {
      acc[order.source] = (acc[order.source] || 0) + order.total;
      return acc;
    }, {});

    return { totalSales, totalOrders, averageOrderValue, byPaymentMethod, bySource };
  }, [todayOrders]);

  const topItems = useMemo(() => {
    const itemMap = new Map();
    
    todayOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = itemMap.get(item.menuItemId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          itemMap.set(item.menuItemId, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [todayOrders]);

  const staffPerformance = useMemo(() => {
    const performanceMap = new Map();
    
    todayOrders.forEach((order) => {
      const existing = performanceMap.get(order.createdBy);
      const staffMember = (staff || []).find((s) => s.id === order.createdBy);
      if (existing) {
        existing.orders += 1;
        existing.revenue += order.total;
      } else {
        performanceMap.set(order.createdBy, {
          name: staffMember?.name || 'Unknown',
          orders: 1,
          revenue: order.total,
        });
      }
    });

    return Array.from(performanceMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [todayOrders, staff]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <ChartBar className="w-6 h-6 text-primary-foreground" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground">{formatDate(Date.now())}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
                <Money className="w-5 h-5 text-success" weight="duotone" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalSales)}</p>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                <Receipt className="w-5 h-5 text-primary" weight="duotone" />
              </div>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed today</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg Order Value</h3>
                <TrendUp className="w-5 h-5 text-warning" weight="duotone" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Staff</h3>
                <Users className="w-5 h-5 text-accent" weight="duotone" />
              </div>
              <p className="text-3xl font-bold">{(staff || []).filter((s) => s.active).length}</p>
              <p className="text-xs text-muted-foreground mt-1">On duty</p>
            </Card>
          </div>

          <Tabs defaultValue="sales" className="w-full">
            <TabsList>
              <TabsTrigger value="sales">Sales Breakdown</TabsTrigger>
              <TabsTrigger value="items">Top Items</TabsTrigger>
              <TabsTrigger value="staff">Staff Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">By Payment Method</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byPaymentMethod).map(([method, amount]) => (
                      <div key={method} className="flex items-center justify-between">
                        <span className="capitalize">{method}</span>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">By Order Source</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.bySource).map(([source, amount]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="capitalize">{source.replace('-', ' ')}</span>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="items" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Top Selling Items</h3>
                <div className="space-y-3">
                  {topItems.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                      <span className="font-bold">{formatCurrency(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Staff Performance Today</h3>
                <div className="space-y-3">
                  {staffPerformance.map((perf) => (
                    <div key={perf.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">{perf.name}</p>
                        <p className="text-sm text-muted-foreground">{perf.orders} orders</p>
                      </div>
                      <span className="font-bold text-lg">{formatCurrency(perf.revenue)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
