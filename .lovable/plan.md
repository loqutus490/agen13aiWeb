
# Change Favicon to Logo

## Summary
Update the site's favicon to use the existing brand logo (`/logo.png`) instead of the current placeholder.

## Changes

### 1. Update index.html
**File:** `index.html`

Replace the current base64 placeholder favicon with a reference to the logo file:

```html
<!-- Current (line 16) -->
<link rel="icon" href="data:image/png;base64,iVBORw0KGgo..." type="image/png" />

<!-- New -->
<link rel="icon" href="/logo.png" type="image/png" />
```

That's it! The logo file already exists at `public/logo.png` and will be served at the root path `/logo.png`.

---

## Technical Notes
- The existing `public/favicon.ico` file will remain but won't be used
- PNG favicons are well-supported across all modern browsers
- No additional files need to be created or copied
