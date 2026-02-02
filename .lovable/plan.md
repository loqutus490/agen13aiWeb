

# Add Featured Image Thumbnails to Blog Listing

A quick update to display featured images on the blog listing page.

## What You'll Get
- Blog post cards will show a thumbnail image at the top when available
- Posts without images will display cleanly without any placeholder
- Consistent visual appearance across all blog cards

## Changes

### File: `src/pages/Blog.tsx`

**1. Update the BlogPost interface** (line 11-19)
- Add `image_url?: string | null` to the interface

**2. Update the Supabase query** (line 38)
- Add `image_url` to the select statement

**3. Add image display in the card** (around line 133-134)
- Add a thumbnail image with aspect ratio of 16:9
- Show only when `image_url` exists
- Apply rounded corners and proper sizing

---

## Technical Details

The image will be displayed using a simple conditional:
```tsx
{post.image_url && (
  <div className="aspect-video overflow-hidden">
    <img 
      src={post.image_url} 
      alt={post.title}
      className="w-full h-full object-cover"
    />
  </div>
)}
```

This is a ~10-line change total - the fastest fix available.

