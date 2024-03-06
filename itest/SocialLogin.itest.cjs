#!/usr/bin/env node

const puppeteer = require("puppeteer");
const commander = require("commander");
const crypto = require("crypto");

commander
  .version("3.0.0")
  .option(
    "-s, --site <URL>",
    "Site to run against, default https://passover.lol"
  )
  .option("-L, --slow", "Run headfully in slow mode")
  .option("-I, --idp-url <URL>", "The URL expected after clicking 'Log in'")
  .option("--user-pool-id <ID>", "The User Pool Id for the web app")
  .option(
    "--setup-only",
    "Create a User Pool user and exit, do not launch a browser"
  )
  .parse(process.argv);
const slowDown = 200;
const timeoutMs = 45000 + (commander.opts().slow ? slowDown + 2000 : 0);
const defaultUrl = "https://passover.lol";
const site = commander.opts().site || defaultUrl;
const idpUrl = commander.opts().idpUrl;
const userPoolId = commander.opts().userPoolId;
const setupOnly = commander.opts().setupOnly;
const browserOptions = {
  headless: commander.opts().slow ? false : true,
  args: ["--no-sandbox"],
};
browserOptions.slowMo = slowDown;

const failTest = async (err, msg, browser) => {
  console.log("test failed: " + msg);
  console.log(err);
  if (browser) await browser.close();
  process.exit(1);
};

const waitOptions = { timeout: timeoutMs , visible: true };
const waitForNavigationOptions = { timeout: timeoutMs };
const clickOptions = { delay: 200, visible: true };
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

const submitAllLibs = async (page, prefix) => {
  const answers = [];
  const progressText = await itGetText({
    page: page,
    madliberationid: "lib-progress",
  });
  const progress = progressText.split("/").map((n) => parseInt(n.trim()));
  if (progress.length < 2) {
    failTest("/play page", "did not find X / Y showing lib progress");
  }
  const numLibs = progress[1];
  for (let currentLib = progress[0]; currentLib <= numLibs; currentLib++) {
    // Enter a lib, save it to answers
    const ans = `${prefix}${currentLib}`;
    await itType({
      page: page,
      madliberationid: `answer-${currentLib - 1}`,
      text: ans,
    });
    answers.push(ans);
    // If we're on the last lib, submit and return
    if (currentLib === numLibs) {
      await itClick({ page: page, madliberationid: "submit-answers" });
      await itNavigate({
        page: page,
        madliberationid: "yes-submit-libs-button",
      });
      return answers;
    }
    // Click the Next button
    await itClick({ page: page, madliberationid: "next-prompt" });
  }
  failTest("/play page", "never found a Submit Answers button");
};

const submitNoLibs = async (page) => {
  const progressText = await itGetText({
    page: page,
    madliberationid: "lib-progress",
  });
  const progress = progressText.split("/").map((n) => parseInt(n.trim()));
  if (progress.length < 2) {
    failTest("/play page", "did not find X / Y showing lib progress");
  }
  const numLibs = progress[1];
  for (let currentLib = progress[0]; currentLib <= numLibs; currentLib++) {
    // If we're on the last lib, submit and return
    if (currentLib === numLibs) {
      await itClick({ page: page, madliberationid: "submit-answers" });
      await itNavigate({
        page: page,
        madliberationid: "yes-submit-libs-button",
      });
      return;
    }
    // Click the Next button
    await itClick({ page: page, madliberationid: "next-prompt" });
  }
  failTest("/play page", "never found a Submit Answers button");
};

(async () => {
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Actual test

  const browsers = []; // so we can close them all when failing a test, someday
  const browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  const page = await browser.newPage();
  await page.goto(site);

  ////////////////////////////////////////////////////////////////////////////////
  // Home Page
  await page
    .waitForXPath('//*[text()="Join a seder"]', waitOptions)
    .catch(async (e) => {
      failTest(e, "Join a seder button not found", browser);
    });

  // Log in with Google
  await itNavigate({ page: page, madliberationid: "login-button" });
  assertOnUrl({ page: page, expectedUrl: idpUrl });
  const googleSignUpButtonXPath = '//button//*[text()="Continue with Google"]';
  await page.waitForXPath(googleSignUpButtonXPath, waitOptions);
  await page.click("xpath/" + googleSignUpButtonXPath, clickOptions);
  
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Clean up
  await browser.close();
})();
