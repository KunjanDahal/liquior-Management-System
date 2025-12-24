# Component Library & Design System

## 🎨 Design Tokens

### Colors

```css
/* Primary Colors */
--color-primary: #4F46E5        /* Indigo 600 */
--color-primary-dark: #4338CA   /* Indigo 700 */
--color-primary-light: #6366F1  /* Indigo 500 */

/* Secondary */
--color-secondary: #06B6D4      /* Cyan 500 */

/* Status Colors */
--color-success: #10B981        /* Green 500 */
--color-warning: #F59E0B        /* Amber 500 */
--color-danger: #EF4444         /* Red 500 */
--color-info: #3B82F6           /* Blue 500 */

/* Neutral Scale */
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-200: #E5E7EB
--color-gray-300: #D1D5DB
--color-gray-400: #9CA3AF
--color-gray-500: #6B7280
--color-gray-600: #4B5563
--color-gray-700: #374151
--color-gray-800: #1F2937
--color-gray-900: #111827
```

### Typography

```css
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Base Size: 16px
Line Height: 1.5
```

## 🧩 Component Classes

### Buttons

#### Basic Button
```html
<button class="btn">Default Button</button>
```

#### Variants
```html
<!-- Primary -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Success -->
<button class="btn btn-success">Confirm</button>

<!-- Danger -->
<button class="btn btn-danger">Delete</button>

<!-- Warning -->
<button class="btn btn-warning">Warning</button>

<!-- Ghost -->
<button class="btn btn-ghost">Subtle Action</button>
```

#### Sizes
```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
```

#### With Icons
```html
<button class="btn btn-primary">
  <Icon className="w-4 h-4" />
  Click Me
</button>
```

### Cards

#### Basic Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

#### Compact Card
```html
<div class="card card-compact">
  Smaller padding
</div>
```

#### Card with Header & Footer
```html
<div class="card">
  <div class="card-header">
    <h3>Header</h3>
  </div>
  <div>Content</div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

#### Stat Card
```html
<div class="stat-card">
  <div class="p-3 bg-indigo-50 rounded-xl mb-3 inline-block">
    <Icon className="w-6 h-6 text-indigo-600" />
  </div>
  <p class="text-sm font-medium text-gray-600">Label</p>
  <p class="stat-value my-2">$1,234</p>
  <p class="text-sm text-green-600">+12.5%</p>
</div>
```

### Badges

```html
<!-- Primary -->
<span class="badge badge-primary">New</span>

<!-- Success -->
<span class="badge badge-success">Active</span>

<!-- Warning -->
<span class="badge badge-warning">Pending</span>

<!-- Danger -->
<span class="badge badge-danger">Critical</span>

<!-- Info -->
<span class="badge badge-info">Info</span>

<!-- Gray -->
<span class="badge badge-gray">Default</span>
```

### Alerts

```html
<!-- Success Alert -->
<div class="alert alert-success">
  <Icon className="w-5 h-5" />
  <div>
    <h4 class="font-semibold">Success!</h4>
    <p>Operation completed successfully.</p>
  </div>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning">
  <Icon className="w-5 h-5" />
  <p>Warning message here</p>
</div>

<!-- Danger Alert -->
<div class="alert alert-danger">
  <Icon className="w-5 h-5" />
  <p>Error message here</p>
</div>

<!-- Info Alert -->
<div class="alert alert-info">
  <Icon className="w-5 h-5" />
  <p>Information message here</p>
</div>
```

### Form Inputs

#### Text Input
```html
<input type="text" class="input" placeholder="Enter text" />
```

#### Input with Error
```html
<input type="text" class="input input-error" placeholder="Invalid input" />
```

#### Input Group
```html
<div class="input-group">
  <span class="input-group-text">$</span>
  <input type="number" class="input" />
</div>
```

#### With Label
```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Label
  </label>
  <input type="text" class="input" />
</div>
```

### Tables

```html
<table class="table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
  </tbody>
</table>
```

### Gradients

```html
<!-- Primary Gradient -->
<div class="gradient-primary p-6 rounded-lg text-white">
  Indigo to Purple
</div>

<!-- Success Gradient -->
<div class="gradient-success p-6 rounded-lg text-white">
  Green to Emerald
</div>

<!-- Danger Gradient -->
<div class="gradient-danger p-6 rounded-lg text-white">
  Red to Pink
</div>

<!-- Warning Gradient -->
<div class="gradient-warning p-6 rounded-lg text-white">
  Amber to Orange
</div>
```

### Navigation Links

```html
<!-- Default -->
<a href="#" class="nav-link">
  <Icon className="w-5 h-5" />
  <span>Link Text</span>
</a>

<!-- Active -->
<a href="#" class="nav-link nav-link-active">
  <Icon className="w-5 h-5" />
  <span>Active Link</span>
</a>
```

### Loading Spinner

```html
<div class="spinner"></div>
```

### Modal

```html
<div class="modal-backdrop">
  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Modal Title</h2>
    <p>Modal content goes here</p>
    <div class="flex gap-3 mt-6">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

## 📐 Layout Utilities

### Container Spacing
```html
<div class="p-8 space-y-8">
  <!-- Page content -->
</div>
```

### Grid Layouts
```html
<!-- 2 Column -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="card">Column 1</div>
  <div class="card">Column 2</div>
</div>

<!-- 3 Column -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="card">Column 1</div>
  <div class="card">Column 2</div>
  <div class="card">Column 3</div>
</div>

<!-- 4 Column -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div class="card">Column 1</div>
  <div class="card">Column 2</div>
  <div class="card">Column 3</div>
  <div class="card">Column 4</div>
</div>
```

### Flex Layouts
```html
<!-- Horizontal with gap -->
<div class="flex items-center gap-4">
  <button class="btn">Button 1</button>
  <button class="btn">Button 2</button>
</div>

<!-- Space between -->
<div class="flex items-center justify-between">
  <h1>Title</h1>
  <button class="btn">Action</button>
</div>
```

## 🎯 Usage Examples

### Page Header
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Title</h1>
    <p className="text-gray-600">Page description goes here</p>
  </div>
  
  <div className="flex gap-3">
    <button className="btn btn-secondary">
      <FilterIcon className="w-4 h-4" />
      Filter
    </button>
    <button className="btn btn-primary">
      <PlusIcon className="w-4 h-4" />
      Add New
    </button>
  </div>
</div>
```

### Stat Cards Row
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <div key={stat.label} className="stat-card">
      <div className="p-3 bg-indigo-50 rounded-xl mb-3 inline-block">
        <stat.icon className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
      <p className="stat-value my-2">{stat.value}</p>
      <p className="text-sm text-green-600">{stat.change}</p>
    </div>
  ))}
</div>
```

### Search Bar
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>
```

### Data Table
```tsx
<div className="card">
  <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="font-semibold">{item.name}</td>
            <td>
              <span className="badge badge-success">Active</span>
            </td>
            <td className="font-bold text-green-600">${item.amount}</td>
            <td>
              <button className="btn btn-sm btn-secondary">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

### Filter Tabs
```tsx
<div className="card card-compact">
  <div className="flex gap-2">
    {filters.map((filter) => (
      <button
        key={filter.id}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${active === filter.id
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {filter.label}
      </button>
    ))}
  </div>
</div>
```

## 🎨 Color Usage Guidelines

### When to Use Each Color

**Primary (Indigo)**
- Main CTAs (Call to Action)
- Active states
- Links
- Primary navigation

**Success (Green)**
- Confirmation messages
- Positive metrics
- Success states
- Available status

**Warning (Amber)**
- Low stock alerts
- Caution messages
- Pending states
- Important notices

**Danger (Red)**
- Delete actions
- Error messages
- Critical alerts
- Out of stock

**Info (Blue)**
- Informational messages
- Helper text
- Neutral status
- Secondary information

**Gray**
- Text content
- Borders
- Backgrounds
- Disabled states

## 🚀 Best Practices

### Do's ✅
- Use consistent spacing (4px, 8px, 12px, 16px, 24px, 32px)
- Keep button sizes consistent within the same context
- Use hover states for interactive elements
- Provide visual feedback for actions
- Use icons alongside text for better clarity
- Maintain color contrast for accessibility
- Use loading states for async operations

### Don'ts ❌
- Don't mix different button styles in the same context
- Don't use too many colors in one section
- Don't forget disabled states
- Don't make clickable areas too small (min 44x44px)
- Don't use red for anything other than errors/danger
- Don't overuse animations
- Don't forget responsive design

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: < 640px

/* Tablet */
md: >= 768px

/* Desktop */
lg: >= 1024px

/* Large Desktop */
xl: >= 1280px
```

## 🎭 Animation Guidelines

### Transitions
```css
transition-all duration-200    /* Fast - buttons, small elements */
transition-all duration-300    /* Medium - cards, modals */
transition-all duration-500    /* Slow - page transitions */
```

### Hover Effects
```html
<!-- Scale -->
<button class="hover:scale-105 transition-transform">Scale Up</button>

<!-- Shadow -->
<div class="hover:shadow-lg transition-shadow">Lift Effect</div>

<!-- Color -->
<button class="hover:bg-indigo-700 transition-colors">Color Change</button>
```

## 📚 Resources

- **Icons**: Lucide React (https://lucide.dev)
- **Styling**: Tailwind CSS (https://tailwindcss.com)
- **Colors**: Tailwind Color Palette
- **Typography**: Inter Font (https://fonts.google.com/specimen/Inter)

---

This component library provides a consistent, modern design system for the entire RMH POS System. All components are tested, accessible, and ready for production use.

