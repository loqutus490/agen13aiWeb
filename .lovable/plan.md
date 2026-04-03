

## Add Testimonials / Social Proof Section to Homepage

### What This Does
Adds a new section to the homepage featuring client testimonials — quotes from law firm partners/attorneys about their experience with agent13 ai. This builds trust and credibility with prospective clients visiting the site.

### Placement
The testimonials section will go **between the existing "Results" stats section and the Lead Magnet section**, creating a natural flow: stats → real voices → download guide → final CTA.

### Design
- A carousel/slider showing 3-4 testimonial cards, each with:
  - A quote from a legal professional
  - Name, title, and firm type (e.g. "Managing Partner, Mid-Size Litigation Firm")
  - A star rating or quote icon for visual emphasis
- Auto-rotating with manual navigation dots
- Uses the existing `Carousel` component already in the project
- Matches the current dark theme with `holographic-border` and `scan-line-effect` styling

### Content Note
Since you're pre-launch, the testimonials will use **realistic but clearly placeholder quotes** attributed to anonymized roles (e.g. "Managing Partner, 50-Attorney Firm"). You can swap these for real testimonials once you have them.

### Technical Changes
- **Edit `src/pages/Home.tsx`** — Add a new testimonials section using the existing `Carousel`, `Card`, and `Badge` components. No new dependencies needed.

### Page Flow After Change
```text
Hero → Problem/Solution → Features → Stats → Testimonials (NEW) → Lead Magnet → CTA → Footer
```

