#!/usr/bin/env node

const puppeteer = require("puppeteer");
const commander = require("commander");
const crypto = require("crypto");

commander
  .version("1.0.0")
  .option(
    "-s, --site <URL>",
    "Site to run against, default https://passover.lol"
  )
  .option("-L, --slow", "Run headfully in slow mode")
  .parse(process.argv);
const slowDown = 90;
const timeoutMs = 10000 + (commander.opts().slow ? slowDown + 2000 : 0);
const defaultUrl = "https://passover.lol";
const site = commander.opts().site || defaultUrl;
const browserOptions = {
  headless: commander.opts().slow ? false : true,
  args: ["--no-sandbox"],
};
browserOptions.slowMo = slowDown;

const lowercaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
const failTest = async (err, msg, browser) => {
  console.log("test failed: " + msg);
  console.log(err);
  if (browser) await browser.close();
  process.exit(1);
};

const waitOptions = { timeout: timeoutMs /*, visible: true*/ };
const waitForNavigationOptions = { timeout: timeoutMs };
const clickOptions = { delay: 200 };
const typeOptions = { delay: 90 };
const itWait = async ({ page, madliberationid }) => {
  await page
    .waitForSelector(`[madliberationid="${madliberationid}"]`, waitOptions)
    .catch(async (e) => {
      failTest(e, `Could not find ${madliberationid}`);
    });
};
const itWaitForAttribute = async (page, attribute) => {
  await page.waitForSelector(`[${attribute}]`, waitOptions).catch(async (e) => {
    failTest(e, `Could not find attribute ${attribute}`);
  });
};
const itClick = async ({ page, madliberationid }) => {
  await itWait({ page: page, madliberationid: madliberationid });
  await page
    .click(`[madliberationid="${madliberationid}"]`, clickOptions)
    .catch(async (e) => {
      failTest(e, `Could not click ${madliberationid}`);
    });
};
const itType = async ({ page, madliberationid, text }) => {
  await itClick({ page: page, madliberationid: madliberationid });
  await page
    .type(`[madliberationid="${madliberationid}"]`, text, typeOptions)
    .catch(async (e) => {
      failTest(e, `Could not type into ${madliberationid}`);
    });
};
const assertOnUrl = ({ page, expectedUrl }) => {
  if (expectedUrl !== page.url()) {
    failTest(
      "unexpected URL",
      `expected URL to be ${expectedUrl}` +
        ` after navigation, got ${page.url()}`
    );
  }
};
const itNavigate = async ({ page, madliberationid, expectedLandingPage }) => {
  await itWait({ page: page, madliberationid: madliberationid });
  await Promise.all([
    page.click(`[madliberationid="${madliberationid}"]`, clickOptions),
    page.waitForNavigation(waitForNavigationOptions),
  ]).catch(async (e) => {
    failTest(e, `Could not navigate by clicking on ${madliberationid}`);
  });
  if (expectedLandingPage) {
    assertOnUrl({ page, expectedUrl: expectedLandingPage });
  }
};
const itGetText = async ({ page, madliberationid }) => {
  await itWait({ page: page, madliberationid: madliberationid });
  const text = await page
    .$$(`[madliberationid="${madliberationid}"]`)
    .then((a) => {
      if (!Array.isArray(a) || a.length < 1) {
        throw new Error(`Could not get text from ${madliberationid}`);
      }
      return a[0].getProperty("textContent");
    })
    .then((textContent) => {
      return textContent.jsonValue();
    })
    .catch(async (e) => {
      failTest(e, `Failed getting text content of ${madliberationid}`);
    });
  return text;
};
const itGetGroupText = async (page, containerMLId, groupName) => {
  await itWait({ page: page, madliberationid: containerMLId }).catch(
    async (e) => {
      failTest(e, `Failed to find container ${containerMLId}`);
    }
  );
  const container = await page
    .$(`[madliberationid="${containerMLId}"]`)
    .catch(async (e) => {
      failTest(e, `Failed to get container ${containerMLId}`);
    });
  const texts = await container
    .$$eval(`[${groupName}]`, (nodes) => nodes.map((n) => n.innerText))
    .catch(async (e) => {
      failTest(e, `Failed to get group ${groupName}`);
    });
  return texts;
};
const itGetArrayByAttribute = async (page, attribute) => {
  const handles = await page.$$(`[${attribute}]`).catch(async (e) => {
    failTest(e, `Failed getting array of elements with attribute ${attribute}`);
  });
  return handles;
};

(async () => {
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Setup
  // prereq: for generating random user credentials
  // Set up test user
  const randString = (options) => {
    const { numLetters } = options;
    const alphabet = (
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz"
    ).split("");
    let str = "";
    for (let i = 0; i < numLetters; i++) {
      str =
        str +
        alphabet[
          parseInt(crypto.randomBytes(3).toString("hex"), 16) % alphabet.length
        ];
    }
    return str;
  };

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Actual test

  const browsers = []; // so we can close them all when failing a test, someday
  const browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  const page = await browser.newPage();
  await page.goto(site);

  ////////////////////////////////////////////////////////////////////////////////
  // Home Page, go to /create-haggadah
  const createHaggadahLinkText =
    "Plan a seder where people fill out their mad libs beforehand (experimental)";
  await page
    .waitForXPath('//*[text()="' + createHaggadahLinkText + '"]', waitOptions)
    .catch(async (e) => {
      failTest(e, "Plan a seder button not found", browser);
    });
  await page.click('[madliberationid="plan-seder-button"]');

  ////////////////// Plan a Seder /////////////////////////////////////////////
  const pickScriptAccordionTextXPath = '//*[text()="Pick script"]';
  await page
    .waitForXPath(pickScriptAccordionTextXPath, waitOptions)
    .catch(async (e) => {
      failTest(e, "Pick script accordion not found", browser);
    });
  await page.click("xpath/" + pickScriptAccordionTextXPath);
  const script2022RadioButtonXPath = '//input[contains(@value,"2022_Script")]';
  await page.waitForXPath(script2022RadioButtonXPath, waitOptions);
  await page.click("xpath/" + script2022RadioButtonXPath);
  const yourInfoAccordionXPath = '//*[text()="Your info"]';
  await page.waitForXPath(yourInfoAccordionXPath, waitOptions);
  await page.click("xpath/" + yourInfoAccordionXPath);
  const yourNameTextBoxSelector = "#your-name";
  await page.waitForSelector(yourNameTextBoxSelector, waitOptions);
  const leaderName = "L";
  await page.type(yourNameTextBoxSelector, leaderName);
  const yourEmailAddressTextBoxSelector = "#your-email-address";
  const leaderEmailAddress = "el@example.com";
  await page.type(yourEmailAddressTextBoxSelector, leaderEmailAddress);
  const planSederSubmitButtonSelector = "button:not([disabled])";
  await page.waitForSelector(planSederSubmitButtonSelector);
  await page.click(planSederSubmitButtonSelector);

  ///////////////////////// Edit Page /////////////////////////////////////////
  const guestNameTextBoxSelector = "#guest-name-input";
  const guestEmailTextBoxSelector = "#guest-email-input";
  await page.waitForSelector(guestNameTextBoxSelector, waitOptions);
  const participants = [{ gameName: leaderName, email: leaderEmailAddress }];
  const NUMBER_OF_PARTICIPANTS = 22; // Two+ groups of 10
  // trouble can start at 10, because of DynamoDB transactions
  // and seders often have about 20+ people
  for (let p = 1; p < NUMBER_OF_PARTICIPANTS; p++) {
    const participant = {
      gameName: "p" + lowercaseAlphabet[p],
      email: `${lowercaseAlphabet[p]}@x.com`,
    };
    participants.push(participant);
    await page.click(guestNameTextBoxSelector, { clickCount: 3 });
    await page.type(guestNameTextBoxSelector, participant.gameName);
    await page.click(guestEmailTextBoxSelector, { clickCount: 3 });
    await page.type(guestEmailTextBoxSelector, participant.email);
    const addGuestButtonXPath = '//button[text()="Add"][not(@disabled)]';
    await page.waitForSelector("xpath/" + addGuestButtonXPath, waitOptions);
    await page.click("xpath/" + addGuestButtonXPath);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Clean up
  await browser.close();
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
})();
