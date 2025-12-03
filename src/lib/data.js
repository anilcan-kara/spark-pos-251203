export const MENU_CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Beverages',
  'Desserts',
  'Specials',
];

export const generateMenuItems = () => {
  return [
    { id: '1', name: 'Caesar Salad', category: 'Appetizers', price: 12.99, available: true, description: 'Fresh romaine, parmesan, croutons' },
    { id: '2', name: 'Garlic Bread', category: 'Appetizers', price: 6.99, available: true, description: 'Toasted with herb butter' },
    { id: '3', name: 'Chicken Wings', category: 'Appetizers', price: 14.99, available: true, description: 'Buffalo or BBQ' },
    { id: '4', name: 'Mozzarella Sticks', category: 'Appetizers', price: 9.99, available: true },
    
    { id: '5', name: 'Grilled Salmon', category: 'Main Course', price: 24.99, available: true, description: 'With seasonal vegetables' },
    { id: '6', name: 'Ribeye Steak', category: 'Main Course', price: 32.99, available: true, description: '12oz premium cut' },
    { id: '7', name: 'Pasta Carbonara', category: 'Main Course', price: 16.99, available: true },
    { id: '8', name: 'Margherita Pizza', category: 'Main Course', price: 14.99, available: true },
    { id: '9', name: 'Chicken Alfredo', category: 'Main Course', price: 18.99, available: true },
    { id: '10', name: 'Veggie Burger', category: 'Main Course', price: 13.99, available: true },
    
    { id: '11', name: 'Coca Cola', category: 'Beverages', price: 2.99, available: true },
    { id: '12', name: 'Iced Tea', category: 'Beverages', price: 2.99, available: true },
    { id: '13', name: 'Fresh Juice', category: 'Beverages', price: 4.99, available: true },
    { id: '14', name: 'Coffee', category: 'Beverages', price: 3.99, available: true },
    { id: '15', name: 'Beer', category: 'Beverages', price: 5.99, available: true },
    
    { id: '16', name: 'Chocolate Cake', category: 'Desserts', price: 7.99, available: true },
    { id: '17', name: 'Ice Cream', category: 'Desserts', price: 5.99, available: true },
    { id: '18', name: 'Tiramisu', category: 'Desserts', price: 8.99, available: true },
    
    { id: '19', name: 'Chef Special', category: 'Specials', price: 28.99, available: true, description: 'Daily special - ask your server' },
  ];
};

export const generateTables = () => {
  const tables = [];
  const positions = [
    { x: 50, y: 50 }, { x: 200, y: 50 }, { x: 350, y: 50 }, { x: 500, y: 50 },
    { x: 50, y: 200 }, { x: 200, y: 200 }, { x: 350, y: 200 }, { x: 500, y: 200 },
    { x: 50, y: 350 }, { x: 200, y: 350 }, { x: 350, y: 350 }, { x: 500, y: 350 },
  ];
  
  positions.forEach((pos, idx) => {
    tables.push({
      id: `table-${idx + 1}`,
      number: idx + 1,
      seats: [2, 4, 4, 6, 2, 4, 4, 6, 4, 4, 6, 8][idx],
      status: 'available',
      x: pos.x,
      y: pos.y,
    });
  });
  
  return tables;
};

export const generateStaffUsers = () => {
  return [
    { id: 'user-1', name: 'John Manager', email: 'manager@pos.com', role: 'manager', active: true },
    { id: 'user-2', name: 'Sarah Cashier', email: 'cashier@pos.com', role: 'cashier', active: true },
    { id: 'user-3', name: 'Mike Chef', email: 'chef@pos.com', role: 'kitchen', active: true },
    { id: 'user-4', name: 'Lisa Accountant', email: 'accountant@pos.com', role: 'accountant', active: true },
    { id: 'user-5', name: 'Tom Waiter', email: 'waiter@pos.com', role: 'waiter', active: true },
  ];
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateOrderTime = (order) => {
  const now = Date.now();
  return Math.floor((now - order.createdAt) / 1000 / 60);
};

export const getOrderUrgency = (order) => {
  const minutes = calculateOrderTime(order);
  if (minutes > 30) return 'urgent';
  if (minutes > 20) return 'warning';
  return 'normal';
};

export const calculateOrderTotals = (
  items,
  discount = 0,
  tip = 0,
  taxRate = 0.08
) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + tax + tip;
  
  return { subtotal, tax, discount: discountAmount, tip, total };
};

let orderCounter = 1000;

export const generateOrderNumber = () => {
  return orderCounter++;
};
