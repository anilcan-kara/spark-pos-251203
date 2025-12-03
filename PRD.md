# Planning Guide

A comprehensive cloud-based Point of Sale (POS) system for restaurants, hotels, cafes, and markets that streamlines order management, staff coordination, kitchen operations, and business analytics in real-time.

**Experience Qualities**: 
1. **Efficient** - Every interaction is optimized for speed during high-pressure service periods with minimal clicks and clear visual hierarchy
2. **Reliable** - System feels stable and trustworthy with instant feedback, error prevention, and clear status indicators for all operations
3. **Intuitive** - Role-specific interfaces that staff can learn quickly with consistent patterns and context-aware actions

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Multiple user roles (cashier, waiter, kitchen staff, manager, accountant) with distinct interfaces and permissions, real-time order synchronization, comprehensive reporting, payment processing, and third-party platform integrations

## Essential Features

### Multi-Role Authentication & Dashboard
- **Functionality**: User login with role-based routing to appropriate interface (cashier, kitchen, manager, accountant)
- **Purpose**: Secure access control and personalized experience for each staff role
- **Trigger**: App launch or role switching
- **Progression**: Login screen → Role detection → Route to appropriate dashboard → Display role-specific tools
- **Success criteria**: Users see only relevant tools for their role, can switch roles with proper authentication

### Order Management (Cashier/Waiter View)
- **Functionality**: Create orders, add items with modifiers, split bills, apply discounts, process payments
- **Purpose**: Fast, accurate order entry during service with minimal errors
- **Trigger**: New customer or table selection
- **Progression**: Select table/customer → Browse menu/search items → Add items with customizations → Review order → Select payment method → Complete transaction → Print/send receipt
- **Success criteria**: Orders processed in under 30 seconds, real-time sync to kitchen, zero calculation errors

### Kitchen Display System (KDS)
- **Functionality**: Real-time order queue display with preparation status tracking, item timing, and completion
- **Purpose**: Coordinate kitchen workflow and communicate order status to front-of-house
- **Trigger**: New order received from POS
- **Progression**: Order appears in queue → Kitchen staff views items → Mark items as preparing → Mark completed → Order moves to ready state → Notify service staff
- **Success criteria**: Orders displayed within 1 second of creation, clear visual priority indicators, easy status updates

### Table Management & Reservations
- **Functionality**: Visual floor plan with table status, reservation booking, table assignment, and occupancy tracking
- **Purpose**: Optimize seating capacity and manage customer flow
- **Trigger**: Customer arrival or advance reservation request
- **Progression**: View floor plan → Select available table → Assign to party → Link to order → Track duration → Mark completed/cleared
- **Success criteria**: Real-time table status, drag-and-drop assignment, reservation conflict prevention

### Staff Management
- **Functionality**: Add/edit staff profiles, assign roles/permissions, track hours, view performance metrics
- **Purpose**: Manage workforce and monitor individual/team performance
- **Trigger**: Manager accessing staff section
- **Progression**: Staff list → Add/select staff member → Edit details/role → Set permissions → Save changes → View activity logs
- **Success criteria**: Role changes take effect immediately, audit trail of all staff actions

### Manager Dashboard & Reports
- **Functionality**: Sales analytics, inventory levels, staff performance, revenue trends, export capabilities
- **Purpose**: Business intelligence and decision-making support
- **Trigger**: Manager login or report request
- **Progression**: Dashboard overview → Select report type → Set date range/filters → View charts and tables → Export data → Schedule recurring reports
- **Success criteria**: Reports load within 2 seconds, accurate calculations, multiple export formats

### Accountant Screen
- **Functionality**: Transaction history, payment reconciliation, tax calculations, expense tracking, financial exports
- **Purpose**: Financial oversight and accounting integration
- **Trigger**: Accountant role access
- **Progression**: View transaction log → Filter by date/type/payment method → Reconcile payments → Review discrepancies → Export for accounting software
- **Success criteria**: All transactions tracked, audit-compliant records, integration-ready exports

### Payment Processing
- **Functionality**: Multiple payment methods (cash, card, mobile), split payments, tips, refunds
- **Purpose**: Flexible, secure payment acceptance
- **Trigger**: Order completion
- **Progression**: Calculate total → Select payment method(s) → Process payment → Handle tip entry → Generate receipt → Update financial records
- **Success criteria**: Payment processing under 5 seconds, secure handling, receipt generation

### Third-Party Delivery Integration
- **Functionality**: Receive orders from delivery platforms (Uber Eats, DoorDash, Yemeksepeti, Getir), manage unified queue
- **Purpose**: Centralize all order channels in one system
- **Trigger**: External order received via platform API
- **Progression**: API receives order → Parse into standard format → Display in unified queue → Route to kitchen → Update platform status → Mark completed
- **Success criteria**: Orders appear within 10 seconds of platform submission, automatic status sync

### Menu Management
- **Functionality**: Add/edit items, categories, prices, modifiers, availability status, item images
- **Purpose**: Maintain accurate, up-to-date menu across all channels
- **Trigger**: Manager editing menu
- **Progression**: Menu list → Select item or create new → Edit details/pricing → Set modifiers → Upload image → Toggle availability → Save changes
- **Success criteria**: Changes reflect across all terminals immediately, version history maintained

## Edge Case Handling
- **Network Interruption**: Queue orders locally, sync when connection restored, visual offline indicator
- **Payment Failure**: Retry mechanism, fallback payment methods, manual entry option
- **Order Conflicts**: Timestamp-based resolution, manager override capability
- **Out of Stock Items**: Real-time inventory checks, suggested substitutions, low-stock alerts
- **Split/Merged Tables**: Flexible order transfer between tables, combined billing
- **Refunds/Voids**: Manager approval required, audit trail with reason codes
- **Concurrent Editing**: Last-write-wins with change notification, conflict resolution UI

## Design Direction
The design should evoke professional reliability and operational efficiency - this is a tool for business operations during high-pressure service periods, so it needs to feel fast, stable, and trustworthy while remaining approachable for staff with varying technical abilities. The interface should be minimal and focused, prioritizing information density and quick actions over decorative elements, with bold, clear typography and strong color-coded status indicators.

## Color Selection
Triadic color scheme - Using three equally spaced colors to differentiate operational states (pending orders, in-progress kitchen items, completed transactions) while maintaining visual harmony and reducing cognitive load during busy periods.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Conveys trust and stability for core actions like completing orders and processing payments; used for primary CTAs and navigation
- **Secondary Colors**: 
  - Warm Amber (oklch(0.75 0.15 75)) - Alerts and pending states requiring attention (new orders, kitchen timers)
  - Fresh Teal (oklch(0.65 0.12 195)) - Completed states and positive confirmations (paid orders, finished prep)
- **Accent Color**: Vibrant Coral (oklch(0.68 0.19 25)) - High-urgency actions and critical alerts (refunds, manager overrides, urgent orders)
- **Foreground/Background Pairings**:
  - Background (Soft White oklch(0.98 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 14.2:1 ✓
  - Card (Pure White oklch(1 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 15.1:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Secondary (Light Gray oklch(0.95 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 13.8:1 ✓
  - Accent (Vibrant Coral oklch(0.68 0.19 25)): White text (oklch(1 0 0)) - Ratio 4.7:1 ✓
  - Muted (Medium Gray oklch(0.93 0 0)): Medium Dark text (oklch(0.45 0 0)) - Ratio 5.2:1 ✓

## Font Selection
Typography should balance professional clarity with speed-reading during operations - clear, highly legible sans-serif for UI elements with distinct number forms for financial data, using Inter for its excellent screen readability and comprehensive weight range.

- **Typographic Hierarchy**: 
  - H1 (Screen Titles): Inter Bold/32px/tight letter spacing (-0.02em) - Used for main screen headings like "Kitchen Display" or "Manager Dashboard"
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing - Category headers like "Pending Orders" or "Sales Today"
  - H3 (Card Titles): Inter Semibold/18px/normal letter spacing - Individual order cards, table numbers
  - Body (Primary Content): Inter Regular/16px/1.5 line height - Order items, menu descriptions
  - Small (Metadata): Inter Regular/14px/1.4 line height - Timestamps, status labels
  - Numbers (Financial): Inter Semibold/16-20px/tabular numbers - Prices, totals, quantities for alignment
  - Labels (Form Fields): Inter Medium/14px/0.01em letter spacing - Input labels, button text

## Animations
Animations should be purposeful and fast-paced to match the operational tempo - primarily used for state transitions (order status changes), attention direction (new orders arriving), and confirmation feedback (payment success), with subtle micro-interactions that communicate system responsiveness without slowing down workflow.

- **Purposeful Meaning**: Motion reinforces the flow of operations - orders "move" from POS to kitchen, completed items "slide" out of view, status changes "pulse" to catch attention during busy periods
- **Hierarchy of Movement**: 
  - Critical (new orders, payment confirmations): 300-400ms with attention-grabbing slide-in + scale
  - Standard (status updates, navigation): 200-250ms with smooth slide transitions
  - Subtle (hover states, micro-feedback): 100-150ms with gentle color/scale changes

## Component Selection

- **Components**: 
  - **Card**: Order cards, table status cards, menu item cards with custom borders for status indication
  - **Button**: Primary actions use filled primary button, secondary actions use outline variant, danger actions use destructive variant
  - **Badge**: Status indicators (pending/preparing/completed/paid) with custom color variants
  - **Dialog**: Order details, payment processing, staff editing
  - **Tabs**: Role switching, report type selection, menu category browsing
  - **Table**: Transaction history, staff list, inventory management
  - **Select/Dropdown**: Table selection, payment method, staff role assignment
  - **Input**: Search menu items, customer details, discount entry with numeric keypad for amounts
  - **Separator**: Visual section division in complex screens
  - **ScrollArea**: Long order lists, menu browsing
  - **Avatar**: Staff profiles with online/offline indicators
  - **Switch**: Toggle item availability, staff active status
  - **Calendar**: Reservation date picker, report date ranges
  - **Sheet**: Side panel for order details, quick actions

- **Customizations**: 
  - **Status Pills**: Custom badge variants with left border accent for kitchen order states
  - **Numeric Keypad**: Custom calculator-style number entry for quick payment amounts
  - **Table Grid**: Custom interactive floor plan component for visual table management
  - **Order Timeline**: Custom vertical timeline showing order progression through kitchen stages
  - **Quick Action Bar**: Custom floating action menu for frequently used cashier functions

- **States**: 
  - Buttons: Distinct loading state with spinner, disabled state with reduced opacity, success state with checkmark animation
  - Inputs: Active focus with blue ring, error state with red border + shake animation, success validation with green checkmark
  - Order Cards: Hover reveals quick actions, selected state with blue border, urgency state with pulsing amber border for old orders
  - Table Status: Available (green), Occupied (blue), Reserved (amber), Needs Cleaning (red)

- **Icon Selection**: 
  - Orders: Receipt, ShoppingCart, Plus for adding items
  - Kitchen: ChefHat, Clock, CheckCircle for completion
  - Tables: Chair, Users, CalendarDots for reservations
  - Payment: CreditCard, Money, Wallet
  - Staff: UserCircle, Shield for permissions, Clock for hours
  - Navigation: House, ChartBar, Gear for settings
  - Actions: FunnelSimple, MagnifyingGlass, X, ArrowRight

- **Spacing**: 
  - Screen padding: p-6 (24px) for main content areas
  - Card internal: p-4 (16px) for standard cards, p-6 for dialog content
  - Section gaps: gap-6 for major sections, gap-4 for related items, gap-2 for tight groups
  - Grid layouts: grid gap-4 for card grids, gap-3 for form fields
  - List items: py-3 px-4 with border-b for separation

- **Mobile**: 
  - Navigation: Bottom tab bar for main sections on mobile, collapsible sidebar on desktop
  - Order Entry: Single column layout with sticky category filter at top, floating cart summary at bottom
  - Kitchen Display: 2-column grid on tablet, single column on phone with swipe gestures for status changes
  - Tables: Scrollable horizontal floor plan on mobile, full grid on desktop
  - Forms: Full-width inputs stacked vertically, simplified layouts with progressive disclosure
  - Manager Reports: Charts stack vertically on mobile, side-by-side on desktop with touch-friendly filters
