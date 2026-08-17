import fs from 'node:fs/promises';

const base = 'http://127.0.0.1:9222';
const targets = [
  ['mobile-store-home', 'https://house-of-spices-linl.vercel.app/'],
  ['mobile-store-products', 'https://house-of-spices-linl.vercel.app/products'],
  ['mobile-store-detail', 'https://house-of-spices-linl.vercel.app/products/global-spices-product-1'],
  ['mobile-store-track', 'https://house-of-spices-linl.vercel.app/track'],
  ['mobile-checkout-filled', 'https://house-of-spices-linl.vercel.app/checkout'],
  ['mobile-admin-home-filled', 'https://house-of-spices-linl.vercel.app/admin'],
  ['mobile-admin-orders-filled', 'https://house-of-spices-linl.vercel.app/admin/orders'],
  ['mobile-admin-payment-filled', 'https://house-of-spices-linl.vercel.app/admin/payment-settings'],
  ['mobile-admin-inbox-filled', 'https://house-of-spices-linl.vercel.app/admin/inbox'],
  ['mobile-admin-reviews-filled', 'https://house-of-spices-linl.vercel.app/admin/reviews'],
  ['mobile-admin-analytics-filled', 'https://house-of-spices-linl.vercel.app/admin/analytics'],
];
const outDir = '/home/ubuntu/house_of_spices_audit/marketing-kit/deck/mobile-site/assets/current';
await fs.mkdir(outDir, { recursive: true });
const pages = await (await fetch(`${base}/json/list`)).json();
const page = pages.find(p => p.type === 'page' && p.webSocketDebuggerUrl);
if (!page) throw new Error('No Chromium page target found');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error))); else resolve(msg.result);
  }
});
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, {resolve, reject}); ws.send(JSON.stringify({id, method, params}));
});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 2, mobile: true, screenWidth: 390, screenHeight: 844});
await send('Emulation.setTouchEmulationEnabled', {enabled: true, maxTouchPoints: 5});
await send('Page.enable');
for (const [name, url] of targets) {
  await send('Page.navigate', {url});
  await sleep(1800);
  await send('Runtime.evaluate', {expression: 'window.scrollTo(0,0)'});
  await sleep(300);
  const metrics = await send('Page.getLayoutMetrics');
  const content = metrics.contentSize || {width:390, height:844};
  const clip = {x: 0, y: 0, width: 390, height: Math.min(Math.max(content.height, 844), 12000), scale: 1};
  const shot = await send('Page.captureScreenshot', {format: 'png', fromSurface: true, captureBeyondViewport: true, clip});
  await fs.writeFile(`${outDir}/${name}.png`, Buffer.from(shot.data, 'base64'));
  console.log(`${name}: ${Math.round(content.width)}x${Math.round(content.height)}`);
}
await send('Emulation.clearDeviceMetricsOverride');
ws.close();
