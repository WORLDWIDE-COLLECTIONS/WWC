import { chromium } from "playwright";

const base = "http://localhost:3000";
const out = "C:/Users/HP/AppData/Local/Temp/opencode";

const browser = await chromium.launch();

async function capture(url, name, opts) {
  const page = await browser.newPage(opts);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.close();
  console.log("saved", name);
}

await capture(
  `${base}/product/11111111-1111-4111-8111-111111111111`,
  "mobile-top",
  { viewport: { width: 390, height: 844 } },
);

await capture(
  `${base}/product/33333333-3333-4333-8333-333333333333`,
  "soldout-desktop",
  { viewport: { width: 1440, height: 1000 } },
);

await browser.close();
console.log("done");
