import { test } from '@playwright/test';
import { completeA11yScanOnPage, completeA11yScanOnPageReportInConsole, completeA11yScanOnSitemap } from './a11y';

test.only('Check for a11y issues on a single page @a11y', async ({ page }) => {
  await completeA11yScanOnPage("https://www.deptagency.com/", page);
});

test('Check for a11y issues on a single page and report in console @a11y', async ({ page }) => {
  await completeA11yScanOnPageReportInConsole("https://www.deptagency.com/", page);
});

test('Traverse sitemap and check for a11y on each page @a11y', async ({ page }) => {
  test.setTimeout(600000);
  await completeA11yScanOnSitemap(page,'https://www.deptagency.com/page-sitemap.xml');
});
