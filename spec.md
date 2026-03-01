# Specification

## Summary
**Goal:** Add an Advertisements section to the Suraj Navodaya App, allowing admins to post ads and users to view them across the app.

**Planned changes:**
- Add `Ad` data model to the backend with fields: id, title, description, imageUrl, linkUrl, isActive, and createdAt; expose `addAd`, `getAllAds`, and `toggleAdActive` functions in the main actor
- Add React Query hooks: `useGetAds`, `useAddAd`, and `useToggleAd` in `useQueries.ts`
- Create a new `Advertisements` page displaying active ads as styled banner cards with title, description, and optional external link, plus an admin dialog to add new ads; follows the maroon-and-gold theme
- Add "Advertisements" navigation entry to the Header (desktop and mobile) and wire it up in `App.tsx`
- Add an active ads preview section on the Home dashboard page with a "View All" button navigating to the Advertisements page

**User-visible outcome:** Users can browse advertisements on a dedicated page and in a preview section on the home dashboard; admins can add new ads and toggle their active status via a dialog form.
