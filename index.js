const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://www.clickspeedtest.info/apm-test/", {
    waitUntil: "networkidle2",
  });

  page.waitForTimeout(3000);

  const speedSelector = await page.$("#s3");
  await speedSelector.click();

  const resultDiv = await page.$("#result-last");

  const startButtonDiv = await page.$("#startbutton");
  const startButton = await startButtonDiv.$("button");
  await startButton.click();

  const cells = await page.$$(".cell");

  while (!(await resultDiv.boundingBox())) {
    if (cells && cells.length > 0) {
      for (const cell of cells) {
        const className = await (
          await cell.getProperty("className")
        ).jsonValue();
        if (className.includes("bg-primary")) {
          cell.click();
        }
      }
    }
  }

  await page.screenshot({ path: "score-screenshot.png" });

  await browser.close();
})();
