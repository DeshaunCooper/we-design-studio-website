# We Design Studio — Main Website

Official website for **We Design Studio**, a creative branding, web design, and visual content studio helping small businesses look more professional, profitable, and ready for growth.

---

## Project Info

| Field | Detail |
|---|---|
| **Studio** | We Design Studio |
| **Main file** | `index.html` |
| **Contact email** | Hello@wedesignsstudio.com |
| **Location** | Orlando, Florida |
| **Deployment** | GitHub Pages / Vercel / Netlify |

---

## Deployment

This is a single-file static site. Deploy directly:

**GitHub Pages**
Push `index.html` to a GitHub repo, enable Pages under Settings → Pages → Deploy from branch (`main`, root `/`).

**Vercel**
Drag the project folder into [vercel.com](https://vercel.com) or connect the GitHub repo. No build step needed.

**Netlify**
Drag the project folder into [netlify.com](https://netlify.com) or connect GitHub. No build step needed.

---

## Contact Form Integration — ACTION REQUIRED

The inquiry form uses **Web3Forms** (free, no backend needed).

**To activate the form:**

1. Go to [https://web3forms.com](https://web3forms.com) and generate a free access key for `Hello@wedesignsstudio.com`
2. Open `index.html` and find this line (search for `YOUR_ACCESS_KEY_HERE`):
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE"/>
   ```
3. Replace `YOUR_ACCESS_KEY_HERE` with your Web3Forms key
4. Save and redeploy

All form submissions will go directly to `Hello@wedesignsstudio.com`.

Until the key is set, the form front-end is fully built and styled — it just won't deliver emails.

---

## Services Covered

1. Landing Pages
2. Full Websites
3. Brand Identity
4. Promotional Content (business cards, flyers, social media graphics)
5. Creative Direction
6. Enterprise Creative Builds (scope-based)

---

## Design System

- Font: Inter (Google Fonts)
- Scroll: Lenis smooth scroll (CDN, weighted + premium feel)
- Color: White background, `#111` ink, gradient accent `#e040fb → #7c3aed → #06b6d4 → #84cc16`
- Radius: 12–20px rounded cards
- Shadows: Soft, layered
- Responsive: Mobile-first breakpoints at 1024px and 640px

---

## Files

```
index.html        ← main website (single file, self-contained)
README.md         ← this file
```

Assets (logo, card images) are embedded as base64 inline in the HTML. No external asset folder required.
