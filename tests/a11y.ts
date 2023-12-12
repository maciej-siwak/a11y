import AxeBuilder from '@axe-core/playwright';
import { injectAxe, checkA11y } from 'axe-playwright';
import { createHtmlReport } from 'axe-html-reporter';
import type { Page } from '@playwright/test';
import axios from 'axios';
import { load } from 'cheerio';

let urls = [];

export async function completeA11yScanOnPage(pageURL: string, page: Page): Promise<void> {
  try {
    await page.goto(pageURL);

    const fileName = pageURL.replace(/^https:\/\//, '').replace(/\//g, '_');
    console.log(fileName);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    createHtmlReport({
      results: accessibilityScanResults,
      options: { reportFileName: `${fileName}.html` },
    });

    if (accessibilityScanResults.violations.length > 0) {
      console.log(`Accessibility Issues found on page: ${pageURL}`);
    }
  } catch (error) {
    console.error('General Accessibility Issues Found!', error);
  }
}

export async function completeA11yScanOnPageReportInConsole(
  pageURL: string,
  page: Page,
): Promise<void> {
  try {
    await page.goto(pageURL);
    await injectAxe(page);

    const options = {
      runOnly: {
        type: 'tag',
        values: [
          'wcag2a',
          'wcag2aa',
          'wcag2aaa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ],
      },
      detailedReport: true,
      detailedReportOptions: { html: true },
    };

    await checkA11y(page, options);
  } catch (error) {
    console.error('Accessibility violations found:', error);
  }
}

//SITEMAP

async function traverseSitemap(url :string) 
  {
    const sitemapUrl = url;
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;
    const $ = load(sitemapXml, { xmlMode: true });
    const locElements = $('loc');

    if (locElements.length === 0) 
    {
      console.error('No <loc> elements found in the sitemap.');
      return;
    }

    for (let index = 0; index < locElements.length; index++) 
    {
      const element = locElements[index];
      const url = $(element).text();
      urls.push(url);
      console.log(url);
    }

    console.log('Total URLs:', urls.length);
  }

  export async function completeA11yScanOnSitemap(page: Page,url: string): Promise<void> {

    await traverseSitemap(url);

    for (const pageURL of urls) {
      console.log(`Checking Accessibility on ${pageURL}`);
      // eslint-disable-next-line no-await-in-loop -- Allowing await inside loop for asynchronous processing
      await completeA11yScanOnPage(pageURL, page);
    }
  }