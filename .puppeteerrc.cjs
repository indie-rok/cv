/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // CI installs Chrome via apt; locally we use system Chrome.
  // Only download Puppeteer's Chrome if PUPPETEER_DOWNLOAD=true is set.
  skipDownload: process.env.PUPPETEER_DOWNLOAD !== "true",
};
