# Chat Saver - Design System

## Design Tokens (from DESIGN.md)

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| indigo | `#4F46E5` | Primary action buttons, links, active states |
| violet | `#7C3AED` | Secondary accent color |
| background | `#F8F9FF` | Page backgrounds |
| surface | `#FFFFFF` | Card/surface backgrounds |
| primary-text | `#0B1C30` | Body text, headings |
| secondary-text | `#464555` | Secondary text, metadata |
| success | `#10B981` | Success states, code highlights |
| warning | `#F59E0B` | Warning states, attention markers |

### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter
- **Code**: JetBrains Mono

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| gutter | `1rem` | Horizontal gutter between grid columns |
| gutter-mobile | `0.75rem` | Mobile gutter |
| margin | `2rem` | Default margins |
| margin-mobile | `1rem` | Mobile margins |

### Rounded Corners
| Token | Value | Usage |
|-------|-------|-------|
| sm | `0.25rem` | Small rounded corners |
| DEFAULT | `0.5rem` | Default rounded corners |
| md | `0.75rem` | Medium rounded corners |
| lg | `1rem` | Large rounded corners |
| xl | `1.5rem` | Extra large rounded corners |
| full | `9999px` | Fully rounded (pills, modals) |

### Shadows
- Default: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Elevated: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)`

## Color Usage Examples
- **Primary button**: `bg-indigo-600 text-white hover:bg-indigo-500`
- **Secondary button**: `bg-gray-100 hover:bg-gray-50 text-gray-900`
- **Success state**: `text-indigo-500` or `bg-indigo-50`
- **Warning state**: `text-yellow-500` or `bg-yellow-50`