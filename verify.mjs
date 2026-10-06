import { chromium } from "playwright";

const base = "http://localhost:3000";
const url = `${base}/product/11111111-1111-4111-8111-111111111111`;
const results = [];
const check = (name, ok) => results.push(`${ok ? "PASS" : "FAIL"}  ${name}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (err) => check(`no page error (${err.message})`, false));
page.on("console", (msg) => {
  if (msg.type() === "error") check(`console error: ${msg.text()}`, false);
});

await page.goto(url, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1200);

// --- badges + stock ---
check("badge New Arrival", await page.getByText("New Arrival").first().isVisible());
check("badge Featured", await page.getByText("Featured", { exact: true }).first().isVisible());
check("stock In stock", await page.getByText("In stock", { exact: true }).first().isVisible());

// --- sold-out size is not clickable ---
const disabledSize = page.getByRole("button", { name: "M", exact: true });
check("size M disabled", await disabledSize.isDisabled());

// --- validation: add with nothing selected ---
await page.getByRole("button", { name: "Add to cart" }).click();
await page.waitForTimeout(500);
check("toast: Choose a size", await page.getByText("Choose a size").isVisible());
check(
  "inline: select a size",
  await page.getByText("Select a size before adding to bag").isVisible(),
);

// --- pick size, still no colour ---
await page.getByRole("button", { name: "L", exact: true }).click();
await page.waitForTimeout(200);
check("size L pressed", (await page.getByRole("button", { name: "L", exact: true }).getAttribute("aria-pressed")) === "true");
check("inline size error cleared", (await page.getByText("Select a size before adding to bag").count()) === 0);

await page.getByRole("button", { name: "Add to cart" }).click();
await page.waitForTimeout(500);
check("toast: Choose a colour", await page.getByText("Choose a colour").isVisible());
check("inline: select a colour", await page.getByText("Select a colour before adding to bag").isVisible());

// --- complete the form ---
await page.getByRole("button", { name: "Off White" }).click();
await page.getByRole("button", { name: "Increase quantity" }).click();
await page.waitForTimeout(200);
check("quantity = 2", (await page.locator('span[aria-live="polite"]').innerText()) === "2");

await page.getByRole("button", { name: "Add to cart" }).click();
await page.waitForTimeout(500);
const added = page.getByText("Added to cart");
check("toast: Added to cart", await added.isVisible());
const detail = await page.locator("text=Oversized Logo Tee — L · Off White × 2").count();
check("toast shows size + colour + qty", detail > 0);

// --- gallery navigation ---
const before = await page.locator('[aria-current="true"]').getAttribute("aria-label");
await page.getByRole("button", { name: "Next image" }).click();
await page.waitForTimeout(900);
const after = await page.locator('[aria-current="true"]').getAttribute("aria-label");
check("carousel advances", before !== after);
const counterText = await page
  .locator("div.flex.items-center.justify-between > p")
  .first()
  .innerText();
check(`counter reads 0X/04 (got "${counterText}")`, /^0\d\/04$/.test(counterText.replace(/\s+/g, "")));

// --- related products ---
check("related heading", await page.getByText("Complete the look").isVisible());
const cards = await page.locator("article").count();
check(`related cards (${cards})`, cards >= 3);
const soldOutBadge = await page.getByText("Sold out", { exact: true }).count();
check("related sold-out badge present", soldOutBadge >= 1);

await browser.close();
console.log(results.join("\n"));
console.log(results.some((r) => r.startsWith("FAIL")) ? "SOME CHECKS FAILED" : "ALL CHECKS PASSED");
