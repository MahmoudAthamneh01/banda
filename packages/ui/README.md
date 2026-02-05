# @bandachao/ui

Shared UI component library and design tokens for the BandaChao ecosystem.

## Installation

```bash
pnpm add @bandachao/ui
```

## Usage

### Components

```tsx
import { Button, Card, Badge, Input } from '@bandachao/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button variant="primary">Submit</Button>
        <Badge variant="success">New</Badge>
      </CardContent>
    </Card>
  );
}
```

### Design Tokens

```tsx
import { colors, spacing, typography } from '@bandachao/ui/tokens';

// Use in JS/TS
const myColor = colors.panda[500]; // '#7C3AED'
const mySpacing = spacing[4]; // '1rem'
```

### CSS Variables

```css
@import '@bandachao/ui/tokens/tokens.css';

.my-element {
  background: var(--color-panda-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl);
}
```

## Components

- **Button** - Primary action button with variants
- **Input** - Form input field
- **Card** - Container with header, content, footer
- **Badge** - Status indicator
- **Avatar** - User profile image
- **Skeleton** - Loading placeholder
- **Spinner** - Loading indicator

## Design Tokens

- **Colors** - ink, slate, panda, silk, sky, success, warn, danger, ruby, jade
- **Spacing** - 0-64 scale
- **Typography** - font families, sizes, weights
- **Radii** - border radius values
- **Shadows** - soft shadows and glow effects
