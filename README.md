# CV

Emmanuel Orozco's CV - Markdown to PDF builder.

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
styles/     - CSS stylesheets
html/       - Legacy HTML versions
dist/       - Generated PDFs (gitignored)
```
