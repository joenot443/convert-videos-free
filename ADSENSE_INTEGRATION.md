# Google AdSense Integration Guide

## What's Been Implemented

### 1. AdSense Script Added
- Added the AdSense script to `app/layout.tsx` using Next.js Script component
- Your publisher ID (ca-pub-4230742669769881) is included
- Script loads with `afterInteractive` strategy for optimal performance

### 2. Reusable AdSense Component
- Created `components/GoogleAdSense.tsx` component
- Supports different ad formats (auto, fluid, etc.)
- Fully responsive and configurable
- Handles AdSense initialization properly in React

### 3. Ad Placements
Three strategic ad placements have been added to `components/converter/ConverterContainer.tsx`:

1. **Top Ad** - After the header, before the file drop zone
   - Format: auto (responsive)
   - Good visibility without disrupting initial user flow

2. **Middle Ad** - Between settings panel and file queue
   - Format: fluid (in-article style)
   - Natural placement between sections

3. **Bottom Ad** - After the output/completed files list
   - Format: auto (responsive)
   - Non-intrusive, shown after main content

### 4. CSS Styles
Added responsive styles in `app/globals.css` to ensure ads display properly on all devices.

## ⚠️ IMPORTANT: Next Steps

### You Need to Create Ad Units in AdSense

1. **Log into your AdSense account** at https://www.google.com/adsense

2. **Create three ad units**:
   - Go to Ads → By ad unit → Display ads
   - Create 3 display ad units with these recommended settings:
     - **Ad Unit 1**: "Convert Videos Free Top" (Responsive display ad)
     - **Ad Unit 2**: "Convert Videos Free Middle" (In-article ad)
     - **Ad Unit 3**: "Convert Videos Free Bottom" (Responsive display ad)

3. **Get your ad slot IDs**:
   - Each ad unit will have a unique `data-ad-slot` ID (10-digit number)
   - Copy these IDs

4. **Replace the placeholders** in `components/converter/ConverterContainer.tsx`:
   ```tsx
   // Replace these placeholder values with your actual ad slot IDs:
   dataAdSlot="XXXXXXXXXX"  // Line 126 - Replace with your top ad slot ID
   dataAdSlot="YYYYYYYYYY"  // Line 143 - Replace with your middle ad slot ID
   dataAdSlot="ZZZZZZZZZZ"  // Line 160 - Replace with your bottom ad slot ID
   ```

### Testing Your Ads

1. **Local Development**:
   - Ads won't show real content in development
   - You'll see blank spaces where ads will appear
   - This is normal behavior

2. **Production**:
   - Deploy your site to production
   - Ads typically take 10-30 minutes to start showing after first deployment
   - Initially, you might see blank spaces - this is normal
   - AdSense needs to crawl and approve your site

3. **Troubleshooting**:
   - Check browser console for any AdSense errors
   - Ensure your domain is verified in AdSense
   - Make sure your site complies with AdSense policies
   - Check that your AdSense account is approved and active

## Ad Formats Explained

- **`auto`**: Automatically adjusts to available space
- **`fluid`**: Adapts to container width, good for in-article placement
- **`dataFullWidthResponsive`**: Makes ads responsive on mobile devices

## Best Practices

1. **Don't click your own ads** - This violates AdSense policies
2. **Monitor performance** in AdSense dashboard
3. **Consider user experience** - Current placements are balanced for UX and revenue
4. **A/B testing** - Try different ad formats and placements over time

## Customization Options

You can adjust ad behavior by modifying the `GoogleAdSense` component props:

```tsx
<GoogleAdSense
  dataAdSlot="your-slot-id"
  dataAdFormat="auto|fluid|rectangle|etc"
  dataFullWidthResponsive={true|false}
  style={{ minHeight: '100px' }}  // Custom styles
  className="your-custom-class"    // Custom CSS classes
/>
```

## Compliance Notes

Make sure your site has:
- Privacy Policy mentioning ad cookies
- Cookie consent banner (if required in your region)
- Compliance with AdSense content policies

## Support

For AdSense issues: https://support.google.com/adsense
For implementation questions: Review the code in `components/GoogleAdSense.tsx`