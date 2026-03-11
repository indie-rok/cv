# CV

Emmanuel Orozco's CV - Markdown to PDF builder.

## Download

- [dev-rel.pdf](https://github.com/indie-rok/cv/releases/latest/download/dev-rel.pdf)
- [tech.pdf](https://github.com/indie-rok/cv/releases/latest/download/tech.pdf)

## View Online

- [dev-rel.html](https://indie-rok.github.io/cv/dev-rel.html)
- [tech.html](https://indie-rok.github.io/cv/tech.html)

## Setup

```sh
npm install
```

## Build PDFs

```sh
# Build all CVs
npm run build

# Build individually
npm run build:dev-rel
npm run build:tech
```

Generated PDFs are output to `dist/`.

## Project Structure

```
src/        - Markdown CV sources
styles/     - CSS stylesheets + local fonts
html/       - HTML versions
dist/       - Generated PDFs (gitignored)
scripts/    - Build tooling
```

## CI/CD

On push to `main`, GitHub Actions automatically:
1. Builds PDFs from markdown
2. Deploys HTML to GitHub Pages
3. Uploads PDFs to the `latest` release
