export const dynamic = 'force-static';

export async function GET() {
  const content = `# Convert Videos Free

> Free browser-based video converter and cropper. Convert MOV, WebM, MKV to MP4 instantly. 100% privacy - files never leave your device.

## About

Convert Videos Free is a web application that converts video files to MP4 format directly in your browser using the WebCodecs API. Unlike cloud-based converters, all processing happens locally on your device, ensuring complete privacy.

The service also offers video cropping at cropvideosfree.com for preparing videos for social media platforms.

## Main Features

- Convert MOV, WebM, MKV to MP4 (H.264 + AAC)
- Browser-based processing using WebCodecs API
- No file uploads to external servers
- No registration or account required
- Adjustable quality presets (Low, Medium, High)
- Works on Chrome, Edge, Safari 16.4+

## Crop Features (cropvideosfree.com)

- Crop videos to any aspect ratio (16:9, 9:16, 1:1, 4:5)
- Trim video start and end times
- Perfect for TikTok, Instagram Reels, YouTube Shorts
- Same privacy guarantees - no uploads

## Supported Conversions

| Input Format | Output Format |
|--------------|---------------|
| MOV          | MP4           |
| WebM         | MP4           |
| MKV          | MP4           |

## Social Media Video Specs

### TikTok / Instagram Reels / YouTube Shorts
- Aspect Ratio: 9:16 (vertical)
- Resolution: 1080x1920

### YouTube (standard)
- Aspect Ratio: 16:9 (horizontal)
- Resolution: 1920x1080

### Instagram Feed
- Aspect Ratio: 1:1 or 4:5
- Resolution: 1080x1080 or 1080x1350

### Twitter/X
- Aspect Ratio: 16:9 or 1:1
- Resolution: 1920x1080 or 1080x1080

## Technical Details

The converter uses the WebCodecs API for hardware-accelerated video encoding. Video is decoded frame-by-frame, re-encoded to H.264, and muxed into an MP4 container with AAC audio.

Quality presets:
- Low: 2 Mbps (good for web sharing, email)
- Medium: 5 Mbps (general use, social media)
- High: 10 Mbps (archiving, quality-critical)

## URLs

- Main converter: https://convertvideosfree.com
- Video cropper: https://cropvideosfree.com
- Blog: https://convertvideosfree.com/blog
- Crop blog: https://cropvideosfree.com/crop/blog

## Blog Articles

### Video Conversion
- [How to Convert MOV to MP4](https://convertvideosfree.com/blog/how-to-convert-mov-to-mp4)
- [Video Formats Explained: MP4, MOV, WebM, MKV](https://convertvideosfree.com/blog/best-video-formats-explained)
- [WebCodecs: Browser-Based Video Processing](https://convertvideosfree.com/blog/webcodecs-browser-video-processing)
- [Best Video Settings for YouTube, TikTok, Instagram](https://convertvideosfree.com/blog/video-settings-for-social-media)

### Video Cropping
- [How to Crop Videos for Social Media](https://cropvideosfree.com/crop/blog/crop-videos-for-social-media)
- [Understanding Video Aspect Ratios](https://cropvideosfree.com/crop/blog/understanding-aspect-ratios)
- [Why Crop Videos in Your Browser](https://cropvideosfree.com/crop/blog/why-crop-in-browser)

## Contact

Created by Joe Crozier
Website: https://joecrozier.ca

## License

The web application is free to use. No attribution required.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
