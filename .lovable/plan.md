

# Plan: Tron: Ares "Bad Guys" Color Scheme (Black + Crimson Red)

## Reference Analysis
Based on your Tron: Ares (2025) poster, the color palette features:
- **Deep crimson/blood red** glowing elements (slightly darker than pure red)
- **Pure black** backgrounds with atmospheric dark gray tones
- **Orange/amber** accent for secondary highlights (the horizontal beam)
- **High contrast** with minimal color variation for that menacing look

## Color Palette Transformation

| Element | Current (Cyan) | New (Crimson Red) |
|---------|----------------|-------------------|
| Primary | Electric Cyan | Crimson Red `hsl(0 85% 50%)` |
| Primary Glow | Bright Cyan | Bright Red `hsl(0 90% 58%)` |
| Primary Dark | Deep Cyan | Dark Crimson `hsl(0 80% 40%)` |
| Foreground | Cyan-tinted White | Neutral White `hsl(0 5% 95%)` |
| Accent | Cyan | Dark Red `hsl(0 70% 15%)` |
| Border/Ring | Cyan-tinted | Red-tinted |
| CTA Accent | Orange (keep) | Orange (keep) |

---

## Files to Modify

### 1. `src/index.css` - Core Color Variables

Update all CSS custom properties from cyan to crimson red:

**Light mode (`:root`):**
```text
--primary: 0 85% 50%           (Crimson Red)
--primary-glow: 0 90% 58%      (Bright Red Glow)
--primary-dark: 0 80% 40%      (Deep Red)
--foreground: 0 5% 95%         (Neutral White)
--card-foreground: 0 5% 95%
--popover-foreground: 0 5% 95%
--secondary-foreground: 0 10% 88%
--muted-foreground: 0 10% 55%
--accent: 0 70% 15%            (Dark Red)
--accent-foreground: 0 85% 65%
--border: 0 50% 15%            (Red-tinted)
--ring: 0 85% 50%              (Red focus ring)
```

**Dark mode (`.dark`):**
Similar adjustments with slightly adjusted values for darker theme.

**Gradient updates:**
```text
--gradient-primary: linear-gradient(135deg, hsl(0 85% 50%), hsl(0 90% 62%))
--gradient-hero: linear-gradient(180deg, hsl(220 25% 2%), hsl(0 50% 6%))
--gradient-text: linear-gradient(135deg, hsl(0 85% 50%), hsl(0 90% 70%))
--shadow-elegant: 0 8px 32px -8px hsl(0 85% 50% / 0.5)
--shadow-glow: 0 0 40px hsl(0 90% 58% / 0.6)
--shadow-tech: 0 4px 24px -4px hsl(0 85% 50% / 0.4)
```

**Animated gradient background:**
```text
.animated-gradient-bg:
  - hsl(220 25% 2%)      (Deep black - keep)
  - hsl(0 50% 6%)        (Red tint - new)
  - hsl(220 25% 3%)      (Deep black - keep)
  - hsl(0 40% 8%)        (Red tint - new)
```

**Sidebar variables:**
```text
--sidebar-primary: 0 85% 50%
--sidebar-border: 0 50% 12%
--sidebar-ring: 0 85% 50%
```

---

## What Changes Automatically

Since the design system uses CSS variables, these elements will update automatically:
- All badges with `text-primary` or `bg-primary/10`
- All icon colors using `text-primary`
- Card hover effects and glows
- Grid background animations
- Scan-line and holographic border effects
- Navigation underline animations
- Chat widget accents
- Form focus rings

## What Stays the Same

- **Orange CTA buttons** - kept for visual hierarchy and contrast
- **Background darkness** - already optimal pure black
- **Component layouts** - no structural changes needed
- **Typography sizes and spacing**

---

## Visual Impact

After implementation:
- Primary buttons, badges, and icons will glow **crimson red**
- Hero sections will have subtle **red atmospheric tints**
- Card hover effects will emit **red glow**
- Grid/circuit backgrounds will animate in **red**
- The menacing "bad guy" Tron aesthetic from your reference image

## Implementation

This is a single-file change (`src/index.css`) with no component modifications needed. The CSS variable system propagates the new colors across:
- All 15+ pages
- Navigation and Footer
- Chat widget
- All cards, badges, and buttons
- Hover animations and effects

