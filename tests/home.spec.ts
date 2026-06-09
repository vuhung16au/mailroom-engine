import { test, expect } from "@playwright/test";

test("renders required simulator UI", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "mailroom-engine: Simulated LMC" })).toBeVisible();
  await expect(page.locator("#files")).toBeVisible();
  await expect(page.locator("#files")).toHaveValue("Count down timer");

  await expect(page.getByRole("button", { name: "Load Program", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Load Program in RAM" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run Program" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Random Access Memory" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "FDE Cycle & Log File" })).toBeVisible();
  await expect(page.getByText("Log File: On")).toBeVisible();
});
