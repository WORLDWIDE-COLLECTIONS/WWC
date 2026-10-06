import { chromium } from "playwright";

const base = "http://localhost:3000";
const p1 = `${base}/product/11111111-1111-4111-8111-111111111111`;
const soldOutUrl = `${base}/product/33333333-3333-4333-8333-333333333333`;
const results = [];
const check = (name, ok, extra = "") =>
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);

const browser = await chromium.launch();

async function open(url, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);
  return page;
}

// ---------- mobile ----------
{
  const page = await open(p1, { width: 390, height: 844 });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  check("mobile: no horizontal overflow", overflow <= 0, `overflow ${overflow}px`);

  const gallery = await page
    .locator('[aria-roledescription="carousel"]')
    .locator("xpath=..")
    .boundingBox();
  const h1 = await page.locator("h1").boundingBox();
  check(
    "mobile: carousel sits above product info",
    gallery && h1 && gallery.y + gallery.height <= h1.y + 2,
    `gallery bottom ${gallery?.y && gallery.y + gallery.height} vs h1 ${h1?.y}`,
  );
  check(
    "mobile: carousel is full-bleed within padding",
    !!gallery && gallery.width > 340 && gallery.width < 370,
    `width ${gallery?.width}`,
  );
  check(
    "mobile: info starts at page padding",
    !!h1 && h1.x >= 15 && h1.x <= 25,
    `x ${h1?.x}`,
  );

  const h1Size = await page.locator("h1").evaluate(
    (el) => parseFloat(getComputedStyle(el).fontSize),
  );
  check("mobile: product name stays readable (>= 28px)", h1Size >= 28, `${h1Size}px`);

  const arrowNext = page.getByRole("button", { name: "Next image" });
  check("mobile: arrows hidden (swipe + dots instead)", !(await arrowNext.isVisible()));

  const dots = await page.locator('[aria-label^="Go to image"]').count();
  check(`mobile: swipe dots rendered (${dots})`, dots > 0);

  const thumbs = await page.locator('[aria-label^="View image"]').count();
  check(`mobile: thumbnails rendered (${thumbs})`, thumbs >= 2);

  const cta = page.getByRole("button", { name: "Add to cart" });
  await cta.scrollIntoViewIfNeeded();
  check("mobile: add to cart reachable", await cta.isVisible());

  const price = await page.locator(".price").first().innerText();
  check("mobile: price in naira", price.includes("28,500"), price.replace(/\s/g, "_"));

  await page.close();
}

// ---------- desktop ----------
{
  const page = await open(p1, { width: 1440, height: 1000 });

  const gallery = await page
    .locator('[aria-roledescription="carousel"]')
    .locator("xpath=..")
    .boundingBox();
  const h1 = await page.locator("h1").boundingBox();
  check(
    "desktop: gallery on the left of info",
    !!gallery && !!h1 && gallery.x < h1.x,
    `gallery x ${gallery?.x}, info x ${h1?.x}`,
  );
  check(
    "desktop: gallery is the wider column",
    !!gallery && !!h1 && gallery.width > h1.width,
    `${gallery?.width} vs ${h1?.width}`,
  );
  check(
    "desktop: gallery is large",
    !!gallery && gallery.width > 600,
    `width ${gallery?.width}`,
  );
  check("desktop: arrows visible", await page.getByRole("button", { name: "Next image" }).isVisible());

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  check("desktop: no horizontal overflow", overflow <= 0, `overflow ${overflow}px`);

  // Related products sit below the fold of the detail block.
  const related = await page.getByText("Complete the look").boundingBox();
  check(
    "desktop: related section below product info",
    !!related && !!h1 && related.y > h1.y,
    `related y ${related?.y}`,
  );

  const firstCard = await page.locator("article").first().innerText();
  check("desktop: featured piece first in related", /Denim Jacket/.test(firstCard), firstCard.split("\n")[1]);

  await page.close();
}

// ---------- sold out ----------
{
  const page = await open(soldOutUrl, { width: 1440, height: 1000 });

  check("sold out: badge shown", await page.getByText("Sold Out", { exact: true }).first().isVisible());
  check("sold out: status line", await page.getByText("Sold out", { exact: true }).first().isVisible());
  check("sold out: add to cart disabled", await page.getByRole("button", { name: "Sold out" }).isDisabled());

  const sizeButtons = page.locator('[aria-label="Select a size"] button');
  const sizeCount = await sizeButtons.count();
  let allDisabled = sizeCount > 0;
  for (let i = 0; i < sizeCount; i++) {
    if (!(await sizeButtons.nth(i).isDisabled())) allDisabled = false;
  }
  check(`sold out: all ${sizeCount} sizes disabled`, allDisabled);

  await page.close();
}

await browser.close();
console.log(results.join("\n"));
console.log(results.some((r) => r.startsWith("FAIL")) ? "SOME CHECKS FAILED" : "ALL CHECKS PASSED");
