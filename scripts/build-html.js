#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "html");

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{TITLE}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-size: 16px;
      -webkit-text-size-adjust: 100%;
    }

    body {
      font-family: "Noto Sans", system-ui, -apple-system, sans-serif;
      color: #444;
      line-height: 1.6;
      background: #fafafa;
    }

    .cv {
      max-width: 780px;
      margin: 0 auto;
      padding: 3rem 2.5rem;
      background: #fff;
    }

    @media (min-width: 800px) {
      body {
        padding: 2rem 0;
      }
      .cv {
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
    }

    @media (max-width: 600px) {
      .cv {
        padding: 2rem 1.25rem;
      }
    }

    /* ---- Name / Header ---- */
    h1 {
      font-weight: 800;
      font-size: 2.4rem;
      color: #222;
      margin-bottom: 0.15rem;
    }

    /* Subtitle line (strong) right after h1 */
    h1 + p {
      color: #555;
      font-weight: 600;
      margin-bottom: 0;
    }

    /* Contact links line */
    h1 + p + p {
      margin-bottom: 1.5rem;
    }

    h1 + p + p a {
      color: #2ecc71;
    }

    /* ---- Section headers (h2) ---- */
    h2 {
      font-size: 1.15rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #222;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      position: relative;
    }

    h2::after {
      content: "";
      position: absolute;
      bottom: -1.5px;
      left: 0;
      width: 48px;
      height: 3px;
      background: #2ecc71;
    }

    /* ---- Company names (h3) ---- */
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2274a5;
      margin-top: 1.25rem;
      margin-bottom: 0.1rem;
    }

    h3 a {
      color: #2274a5;
      text-decoration: underline;
    }

    /* Role (italic paragraph right after h3) */
    h3 + p {
      margin-top: 0;
      margin-bottom: 0;
    }

    h3 + p em {
      font-style: italic;
      color: #555;
    }

    /* Date line (paragraph after role) */
    h3 + p + p {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    /* ---- Body text ---- */
    p {
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
    }

    strong {
      color: #222;
      font-weight: 600;
    }

    a {
      color: #2ecc71;
      text-decoration: underline;
    }

    a:hover {
      text-decoration: underline;
    }

    /* ---- Lists ---- */
    ul {
      padding-left: 1.25rem;
      margin: 0.4rem 0 0.75rem;
    }

    li {
      margin-bottom: 0.25rem;
      line-height: 1.5;
    }

    li::marker {
      color: #2ecc71;
    }

    /* ---- Utility ---- */
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 1.5rem 0;
    }
  </style>
</head>
<body>
  <article class="cv">
    {{CONTENT}}
  </article>
</body>
</html>`;

function buildHtml(mdFile) {
  const name = path.basename(mdFile, ".md");
  const mdPath = path.join(SRC_DIR, mdFile);
  const md = fs.readFileSync(mdPath, "utf-8");

  const content = marked.parse(md);

  // Extract title from first h1
  const titleMatch = md.match(/^#\s+(.+)/m);
  const title = titleMatch ? `${titleMatch[1]} - CV` : "CV";

  const html = TEMPLATE.replace("{{TITLE}}", title).replace("{{CONTENT}}", content);

  const outPath = path.join(OUT_DIR, `${name}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`  ${name}.html → ${outPath}`);
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

fs.mkdirSync(OUT_DIR, { recursive: true });

console.log("Building HTML...");
for (const mdFile of mdFiles) {
  buildHtml(mdFile);
}
console.log("Done.");
