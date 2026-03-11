#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const STYLES_DIR = path.join(ROOT, "styles");
const FONTS_DIR = path.join(STYLES_DIR, "fonts");
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist");

const MDPDF_OPTS = [
  "--border-left=38",
  "--border-right=38",
  "--border-top=48",
  "--border-bottom=48",
  "--format=Legal",
].join(" ");

// Resolve font paths in CSS — replaces FONTDIR placeholder with absolute file:// path
function prepareCss() {
  const cssPath = path.join(STYLES_DIR, "styles.css");
  const css = fs.readFileSync(cssPath, "utf-8");
  const fontsUri = `file://${FONTS_DIR}`;
  const resolved = css.replace(/FONTDIR/g, fontsUri);

  const tmpCss = path.join(STYLES_DIR, ".styles.tmp.css");
  fs.writeFileSync(tmpCss, resolved);
  return tmpCss;
}

// Find Chrome executable — works on macOS, Linux (CI), and with Puppeteer's cache
function findChrome() {
  // Explicit env var takes priority
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const candidates = [
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // Linux (apt-installed)
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  // Fallback: try `which` for PATH-based installs
  try {
    return execSync("which google-chrome-stable || which google-chrome || which chromium", {
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

function buildPdf(mdFile, tmpCss, chromePath) {
  const name = path.basename(mdFile, ".md");
  const srcPath = path.join(SRC_DIR, mdFile);
  const outPath = path.join(DIST_DIR, `${name}.pdf`);

  const env = chromePath
    ? { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath }
    : process.env;

  console.log(`Building ${name}.pdf...`);
  execSync(`npx mdpdf ${srcPath} --style ${tmpCss} ${MDPDF_OPTS}`, {
    cwd: ROOT,
    stdio: "inherit",
    env,
  });

  // mdpdf outputs next to the source file — move to dist/
  const generated = path.join(SRC_DIR, `${name}.pdf`);
  fs.renameSync(generated, outPath);
  console.log(`  → ${outPath}`);
}

// Main
const targets = process.argv.slice(2);
const mdFiles =
  targets.length > 0
    ? targets.map((t) => (t.endsWith(".md") ? t : `${t}.md`))
    : fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".md"));

if (mdFiles.length === 0) {
  console.error("No .md files found in src/");
  process.exit(1);
}

fs.mkdirSync(DIST_DIR, { recursive: true });

const tmpCss = prepareCss();
const chromePath = findChrome();

if (!chromePath) {
  console.warn("⚠ Chrome not found. mdpdf will try Puppeteer's bundled Chrome.");
}

try {
  for (const mdFile of mdFiles) {
    buildPdf(mdFile, tmpCss, chromePath);
  }
  console.log("\nDone.");
} finally {
  // Clean up temp CSS
  fs.unlinkSync(tmpCss);
}
