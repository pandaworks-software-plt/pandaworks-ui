import { chromium } from "playwright"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173/pandaworks-ui"
const OUT_DIR = path.resolve("artifacts/playwright-ui-audit")

const serve =
  process.argv.includes("--serve") || process.env.PLAYWRIGHT_UI_AUDIT_SERVE === "1"

let vite = null

async function waitForServer(url, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok || res.status === 304) return
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(`Server not reachable within ${timeoutMs}ms: ${url}`)
}

function stopServer() {
  if (!vite) return
  vite.kill("SIGTERM")
  vite = null
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function snap(page, file) {
  await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true })
}

async function run() {
  if (serve) {
    console.log("Starting Vite demo (apps/demo) on port 5173…")
    vite = spawn(
      "pnpm",
      ["--filter", "@pandaworks-ui/demo", "exec", "vite", "--host", "127.0.0.1", "--port", "5173"],
      { cwd: ROOT, stdio: "inherit" }
    )
    vite.on("error", (err) => {
      console.error(err)
    })
    await waitForServer(`${BASE_URL}/`)
    console.log("Demo server ready.")
  }

  await ensureDir(OUT_DIR)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1024 } })
  const page = await context.newPage()

  const findings = {
    consoleErrors: [],
    pageErrors: [],
    checks: [],
    sheetLayout: null,
  }

  page.on("console", (msg) => {
    if (msg.type() === "error") findings.consoleErrors.push(msg.text())
  })
  page.on("pageerror", (err) => findings.pageErrors.push(String(err)))

  // 1) Showcase default (button)
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
  await snap(page, "01-showcase-button-light.png")
  findings.checks.push({ check: "showcase loads", pass: await page.getByText("Button").first().isVisible() })

  // 2) Card demo depth
  await page.goto(`${BASE_URL}/#/${"card"}`, { waitUntil: "networkidle" })
  await snap(page, "02-showcase-card-light.png")
  findings.checks.push({ check: "card demo visible", pass: await page.getByText("Employee Overview").first().isVisible() })

  // 3) Table demo
  await page.goto(`${BASE_URL}/#/${"table"}`, { waitUntil: "networkidle" })
  await snap(page, "03-showcase-table-light.png")
  findings.checks.push({ check: "table demo visible", pass: await page.getByRole("cell", { name: "EMP-001" }).first().isVisible() })

  // 4) Modal demo + open
  await page.goto(`${BASE_URL}/#/${"modal"}`, { waitUntil: "networkidle" })
  const modalTrigger = page.getByRole("button", { name: /open modal|open/i }).first()
  if (await modalTrigger.isVisible().catch(() => false)) {
    await modalTrigger.click()
  } else {
    // fallback for unknown trigger label in demo
    await page.getByRole("button").first().click()
  }
  await page.waitForTimeout(250)
  await snap(page, "04-showcase-modal-open-light.png")
  findings.checks.push({ check: "modal opens", pass: await page.locator('[role="dialog"]').first().isVisible() })
  await page.keyboard.press("Escape")

  // 5) Popover demo + open
  await page.goto(`${BASE_URL}/#/${"popover"}`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Open Popover" }).first().click()
  await page.waitForTimeout(200)
  await snap(page, "05-showcase-popover-open-light.png")
  findings.checks.push({ check: "popover opens", pass: await page.locator('[data-slot="popover-content"]').first().isVisible() })
  await page.keyboard.press("Escape")

  // 6) Dropdown menu demo + open
  await page.goto(`${BASE_URL}/#/${"dropdown-menu"}`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Open Menu" }).first().click()
  await page.waitForTimeout(200)
  await snap(page, "06-showcase-dropdown-open-light.png")
  findings.checks.push({ check: "dropdown opens", pass: await page.locator('[role="menu"]').first().isVisible() })
  await page.keyboard.press("Escape")

  // 7) Sheet — open, floating inset + radius, dismiss on Escape
  await page.goto(`${BASE_URL}/#/sheet`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Open right" }).click()
  const sheetDialog = page.getByRole("dialog", { name: /Sheet from right/i })
  await sheetDialog.waitFor({ state: "visible", timeout: 8000 })
  await page.waitForTimeout(100)
  await snap(page, "11-showcase-sheet-open-light.png")
  findings.checks.push({
    check: "sheet opens (dialog visible)",
    pass: await sheetDialog.isVisible(),
  })

  const layout = await sheetDialog.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const m = 6
    const insetFromViewportEdges =
      r.top >= m && r.right <= window.innerWidth - m && r.bottom <= window.innerHeight - m
    const style = window.getComputedStyle(el)
    const radius = parseFloat(style.borderTopLeftRadius) || 0
    return {
      insetFromViewportEdges,
      borderTopLeftRadius: style.borderTopLeftRadius,
      radiusPx: radius,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }
  })
  findings.sheetLayout = layout
  findings.checks.push({
    check: "sheet panel inset from viewport (floating)",
    pass: layout.insetFromViewportEdges,
  })
  findings.checks.push({
    check: "sheet panel has rounded corners (>= 12px)",
    pass: layout.radiusPx >= 12,
  })

  await page.keyboard.press("Escape")
  await sheetDialog.waitFor({ state: "hidden", timeout: 8000 })
  findings.checks.push({
    check: "sheet closes on Escape",
    pass: !(await sheetDialog.isVisible().catch(() => false)),
  })

  // 8) Dark mode on showcase
  await page.goto(`${BASE_URL}/#/${"card"}`, { waitUntil: "networkidle" })
  const toggles = page.getByRole("button")
  const count = await toggles.count()
  if (count > 0) {
    await toggles.nth(count - 1).click()
    await page.waitForTimeout(200)
  }
  await snap(page, "07-showcase-card-dark.png")
  findings.checks.push({ check: "dark mode class applied", pass: await page.evaluate(() => document.documentElement.classList.contains("dark")) })

  // 9) SaaS dashboard
  await page.goto(`${BASE_URL}/saas-showcase`, { waitUntil: "networkidle" })
  await snap(page, "08-saas-dashboard-light.png")
  findings.checks.push({ check: "saas page loads", pass: await page.getByText("Pandawork").first().isVisible() })

  // 10) SaaS user menu depth
  await page.getByRole("button", { name: "Account" }).click()
  await page.waitForTimeout(200)
  await snap(page, "09-saas-account-menu-open-light.png")
  findings.checks.push({ check: "account menu opens", pass: await page.locator('[role="menu"]').first().isVisible() })

  // 11) SaaS dark mode
  const themeButtons = page.getByRole("button")
  const themeCount = await themeButtons.count()
  if (themeCount > 0) {
    await themeButtons.nth(themeCount - 2).click().catch(async () => {
      await themeButtons.nth(themeCount - 1).click()
    })
    await page.waitForTimeout(200)
  }
  await snap(page, "10-saas-dashboard-dark.png")
  findings.checks.push({ check: "saas dark mode applied", pass: await page.evaluate(() => document.documentElement.classList.contains("dark")) })

  await fs.writeFile(
    path.join(OUT_DIR, "audit-results.json"),
    JSON.stringify(findings, null, 2),
    "utf8"
  )

  await browser.close()

  const failed = findings.checks.filter((c) => !c.pass)
  if (failed.length > 0 || findings.pageErrors.length > 0) {
    process.exitCode = 1
  }
  console.log(`Saved audit artifacts to: ${OUT_DIR}`)
  console.log(`Checks: ${findings.checks.length}, failed: ${failed.length}`)
  console.log(`Console errors: ${findings.consoleErrors.length}, page errors: ${findings.pageErrors.length}`)
}

process.on("SIGINT", () => {
  stopServer()
  process.exit(130)
})

run()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => {
    stopServer()
  })
