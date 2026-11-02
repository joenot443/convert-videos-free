import { test, expect, request as playwrightRequest } from '@playwright/test';

// HTTP-level checks. Point E2E_BASE_URL at a production build or the live site.
const PAGES = [
  '/', '/es', '/pt', '/fr', '/de', '/ja', '/crop', '/crop/blog', '/blog', '/about', '/privacy', '/terms',
  '/blog/how-to-convert-mov-to-mp4',
  '/blog/best-video-formats-explained',
  '/blog/webcodecs-browser-video-processing',
  '/blog/video-settings-for-social-media',
  '/crop/blog/crop-videos-for-social-media',
  '/crop/blog/understanding-aspect-ratios',
  '/crop/blog/why-crop-in-browser',
];

const canonicalOf = (html: string) =>
  html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1] ??
  html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/)?.[1];

test.describe('routes', () => {
  for (const p of PAGES) {
    test(`${p} returns 200 HTML`, async ({ request }) => {
      const res = await request.get(p);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/html');
    });
  }

  for (const [p, type] of [
    ['/robots.txt', 'text/plain'],
    ['/sitemap.xml', 'xml'],
    ['/llms.txt', 'text/plain'],
    ['/ads.txt', 'text/plain'],
    ['/manifest.webmanifest', 'manifest'],
    ['/es/opengraph-image', 'image/'],
    ['/mediabunny.js', 'javascript'],
    ['/workers/conversion.worker.js', 'javascript'],
    ['/workers/crop-conversion.worker.js', 'javascript'],
  ] as const) {
    test(`${p} is served as ${type}`, async ({ request }) => {
      const res = await request.get(p);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain(type);
    });
  }

  for (const p of ['/nope', '/foo.php', '/wp-login.php', '/.env', '/aboutxyz', '/blogger', '/cropped', '/es/nope']) {
    test(`${p} is a real 404, not a soft 200`, async ({ request }) => {
      expect((await request.get(p)).status()).toBe(404);
    });
  }
});

test.describe('nothing test-only ships to production', () => {
  test.skip(!process.env.E2E_PROD, 'production builds only');

  for (const p of ['/1.mp4', '/2.mov', '/test-real-streaming.html', '/test', '/test-streaming', '/api/test-streaming']) {
    test(`${p} is gone`, async ({ request }) => {
      expect((await request.get(p)).status()).toBe(404);
    });
  }

  for (const p of ['/api/test/status', '/api/test/inject-files']) {
    test(`${p} is closed`, async ({ request }) => {
      expect([403, 404]).toContain((await request.get(p)).status());
    });
  }

  test('homepage does not expose the test harness', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => '__testMode' in window)).toBe(false);
  });
});

test.describe('SEO', () => {
  const expected: Record<string, string> = {
    '/': 'https://convertvideosfree.com',
    '/es': 'https://convertvideosfree.com/es',
    '/blog': 'https://convertvideosfree.com/blog',
    '/about': 'https://convertvideosfree.com/about',
    '/blog/how-to-convert-mov-to-mp4': 'https://convertvideosfree.com/blog/how-to-convert-mov-to-mp4',
    '/blog/best-video-formats-explained': 'https://convertvideosfree.com/blog/best-video-formats-explained',
    '/blog/webcodecs-browser-video-processing': 'https://convertvideosfree.com/blog/webcodecs-browser-video-processing',
    '/blog/video-settings-for-social-media': 'https://convertvideosfree.com/blog/video-settings-for-social-media',
    '/crop': 'https://cropvideosfree.com/crop',
    '/crop/blog': 'https://cropvideosfree.com/crop/blog',
    '/crop/blog/why-crop-in-browser': 'https://cropvideosfree.com/crop/blog/why-crop-in-browser',
    '/crop/blog/understanding-aspect-ratios': 'https://cropvideosfree.com/crop/blog/understanding-aspect-ratios',
    '/crop/blog/crop-videos-for-social-media': 'https://cropvideosfree.com/crop/blog/crop-videos-for-social-media',
  };
  for (const [p, canonical] of Object.entries(expected)) {
    test(`${p} canonicalises to itself`, async ({ request }) => {
      const html = await (await request.get(p)).text();
      expect(canonicalOf(html)).toBe(canonical);
    });
  }

  for (const [p, lang] of [['/', 'en'], ['/es', 'es'], ['/ja', 'ja'], ['/de', 'de']] as const) {
    test(`${p} declares lang=${lang}`, async ({ request }) => {
      const html = await (await request.get(p)).text();
      expect(html).toMatch(new RegExp(`<html[^>]* lang="${lang}"`));
    });
  }

  test('server HTML holds the real page, not a loading spinner', async ({ request }) => {
    const en = await (await request.get('/')).text();
    expect(en).toContain('Convert videos to MP4 format directly in your browser');
    expect(en).toContain('data-testid="drop-zone"');
    const es = await (await request.get('/es')).text();
    expect(es).toContain('Convierte videos');
  });

  test('/en redirects to the root instead of duplicating it', async ({ request }) => {
    const res = await request.get('/en', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe('/');
  });

  test('the convert sitemap lists only its own host', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).not.toContain('cropvideosfree.com');
  });

  for (const [p, host] of [['/', 'convertvideosfree.com'], ['/es', 'convertvideosfree.com'], ['/blog', 'convertvideosfree.com'], ['/crop', 'cropvideosfree.com']] as const) {
    test(`${p} share image points at the public site`, async ({ request }) => {
      const html = await (await request.get(p)).text();
      const image = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
      expect(image).toBeTruthy();
      expect(image).toContain(`https://${host}/`);
      const res = await request.get(new URL(image!).pathname);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/');
    });
  }

  test('homepage JSON-LD carries no fabricated ratings', async ({ request }) => {
    for (const p of ['/', '/crop']) {
      expect(await (await request.get(p)).text()).not.toContain('aggregateRating');
    }
  });

  test('every sitemap URL resolves', async ({ request, baseURL }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(10);
    for (const url of urls) {
      const target = new URL(url);
      // Locally we reach both domains through one server.
      const pathOnly = (target.pathname === '/' && target.hostname.startsWith('crop')) ? '/crop' : target.pathname;
      const res = await request.get(process.env.E2E_LIVE ? url : `${baseURL}${pathOnly}`, { maxRedirects: 0 });
      expect(res.status(), url).toBe(200);
    }
  });

  test('crop domain advertises its own sitemap host', async ({ baseURL }) => {
    test.skip(!!process.env.E2E_LIVE, 'Host header cannot be overridden through Cloudflare');
    const ctx = await playwrightRequest.newContext({ extraHTTPHeaders: { host: 'cropvideosfree.com' } });
    const txt = await (await ctx.get(`${baseURL}/robots.txt`)).text();
    expect(txt).toContain('cropvideosfree.com');
    await ctx.dispose();
  });
});

test.describe('page health', () => {
  for (const p of ['/', '/es', '/ja', '/crop', '/blog', '/privacy']) {
    test(`${p} loads with no console errors`, async ({ page }) => {
      const errors: string[] = [];
      await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(m.text());
      });
      await page.goto(p);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });
  }

  test('footer links on the homepage all work', async ({ page, request }) => {
    await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
    await page.goto('/');
    await expect(page.getByTestId('drop-zone')).toBeVisible();
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of new Set(hrefs)) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  test('localized footer links do not 404', async ({ page, request }) => {
    await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
    await page.goto('/es');
    await expect(page.getByTestId('drop-zone')).toBeVisible();
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!));
    for (const href of new Set(hrefs)) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  test('localized UI is actually translated in the queue', async ({ page }) => {
    await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
    await page.goto('/es');
    await page.getByTestId('file-input').setInputFiles({
      name: 'x.mp4', mimeType: 'video/mp4', buffer: Buffer.from('not really a video'),
    });
    await expect(page.locator('[data-testid^="status-"]')).toHaveText('Pendiente');
  });

  test('mobile layout has no horizontal scroll', async ({ page }) => {
    await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
    await page.setViewportSize({ width: 375, height: 800 });
    for (const p of ['/', '/crop']) {
      await page.goto(p);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, p).toBeLessThanOrEqual(0);
    }
  });
});
