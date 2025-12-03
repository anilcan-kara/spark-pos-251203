import { useMemo, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Download, MagnifyingGlass, CreditCard, Money } from '@phosphor-icons/react';
import { Order, PaymentMethod } from '@/lib/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/data';

export function AccountantScreen() {
  const [orders] = useKV<Order[]>('orders', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const completedOrders = useMemo(() => {
    return (orders || []).filter((order) => order.status === 'completed');
  }, [orders]);

  const filteredTransactions = useMemo(() => {
    return completedOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toString().includes(searchQuery) ||
        order.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPayment = filterPayment === 'all' || order.paymentMethod === filterPayment;
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [completedOrders, searchQuery, filterPayment, filterStatus]);

  const financialSummary = useMemo(() => {
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalTax = completedOrders.reduce((sum, order) => sum + order.tax, 0);
    const totalDiscounts = completedOrders.reduce((sum, order) => sum + order.discount, 0);
    const totalTips = completedOrders.reduce((sum, order) => sum + order.tip, 0);

    const byPaymentMethod: Record<string, number> = {};
    completedOrders.forEach((order) => {
      if (order.paymentMethod) {
        byPaymentMethod[order.paymentMethod] = (byPaymentMethod[order.paymentMethod] || 0) + order.total;
      }
    });

    return {
      totalRevenue,
      totalTax,
      totalDiscounts,
      totalTips,
      netRevenue: totalRevenue - totalDiscounts,
      byPaymentMethod,
    };
  }, [completedOrders]);

  const getPaymentIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'cash':
        return <Money className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const exportData = () => {
    const csvData = filteredTransactions.map((order) => ({
      OrderNumber: order.orderNumber,
      Date: formatDate(order.createdAt),
      Time: formatTime(order.createdAt),
      Source: order.source,
      PaymentMethod: order.paymentMethod || 'N/A',
      Subtotal: order.subtotal,
      Tax: order.tax,
      Discount: order.discount,
      Tip: order.tip,
      Total: order.total,
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary-foreground" weight="duotone" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Accountant Dashboard</h1>
              <p className="text-sm text-muted-foreground">Financial tracking & reconciliation</p>
            </div>
          </div>
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">{formatCurrency(financialSummary.totalRevenue)}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Net Revenue</h3>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(financialSummary.netRevenue)}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tax Collected</h3>
              <p className="text-3xl font-bold">{formatCurrency(financialSummary.totalTax)}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Tips</h3>
              <p className="text-3xl font-bold text-warning">
                {formatCurrency(financialSummary.totalTips)}
              </p>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by order number or source..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterPayment} onValueChange={setFilterPayment}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Tax</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono font-semibold">#{order.orderNumber}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatDate(order.createdAt)}</div>
                              <div className="text-muted-foreground">{formatTime(order.createdAt)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {order.source.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 capitalize">
                              {getPaymentIcon(order.paymentMethod)}
                              {order.paymentMethod}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(order.subtotal)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(order.tax)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-destructive">
                            {order.discount > 0 ? `-${formatCurrency(order.discount)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">
                            {formatCurrency(order.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="reconciliation" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Payment Method Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(financialSummary.byPaymentMethod).map(([method, amount]) => (
                      <div key={method} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 capitalize">
                          {getPaymentIcon(method as PaymentMethod)}
                          {method}
                        </div>
                        <span className="font-bold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Transaction Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span>Total Transactions</span>
                      <span className="font-bold">{completedOrders.length}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span>Gross Revenue</span>
                      <span className="font-bold">{formatCurrency(financialSummary.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span>Total Discounts</span>
                      <span className="font-bold text-destructive">
                        -{formatCurrency(financialSummary.totalDiscounts)}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-success/10 border border-success">
                      <span className="font-semibold">Net Revenue</span>
                      <span className="font-bold text-success">
                        {formatCurrency(financialSummary.netRevenue)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
