const puppeteer = require('puppeteer');
// const userEvent = require('@testing-library/user-event');
// import userEvent from '@testing-library/user-event'

const imagePath = `${__dirname}/screenshots`
let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`http://localhost:3001/`);
});

afterEach(async () => {
  browser.close();
});

describe('Counter', () => {
  it("starts at '0'", async () => {
    await page.screenshot({ path: `${imagePath}/test-counter-01-starting-state.png` });
    expect(await getTextById('total')).toBe('0');
  });

  it('increments', async () => {
    await page.click('#add');
    await page.screenshot({ path: `${imagePath}/test-counter-02-increment-counter.png` });
    expect(await getTextById('total')).toBe('1');
  });

  it('decrements', async () => {
    await page.click('#subtract');
    await page.screenshot({ path: `${imagePath}/test-counter-03-decrement-counter.png` });
    expect(await getTextById('total')).toBe('-1');
  });

  it('takes multiple inputs', async () => {
    await page.click('#add');
    await page.click('#subtract');
    await page.screenshot({
      path: `${imagePath}/test-counter-04-increment-and-decrement-counter.png`,
    });
    expect(await getTextById('total')).toBe('0');
  });
});

describe('"Update Background" button', () => {
  it('changes background color', async () => {
    const backgroundStart = await page.$eval(
      'body',
      (e) => getComputedStyle(e).backgroundColor
    );
    await page.screenshot({ path: `${imagePath}/test-UBB-01-starting-state.png` });

    await page.click('#switch');

    const backgroundUpdated = await page.$eval(
      'body',
      (e) => getComputedStyle(e).backgroundColor
    );
    await page.screenshot({ path: `${imagePath}/test-UBB-02-updated-state.png` });

    expect(backgroundStart).not.toBe(backgroundUpdated);
  });
});

const getTextById = async (idString) => {
  const handle = await page.$(`[id='${idString}']`);
  const text = await (await handle.getProperty('textContent')).jsonValue();
  return text;
};
