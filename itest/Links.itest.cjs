#!/usr/bin/env node

const puppeteer = require("puppeteer");
const commander = require("commander");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

commander
  .version("1.0.0")
  .option(
    "-s, --site <URL>",
    "Site to run against, default https://passover.lol"
  )
  .option("-L, --slow", "Run headfully in slow mode")
  .option(
    "-p --participants <PARTICIPANTS>",
    "Number of participants, including the leader, default 22"
  )
  .parse(process.argv);
const slowDown = 90;
const timeoutMs = 10000 + (commander.opts().slow ? slowDown + 2000 : 0);
const defaultUrl = "https://passover.lol";
const site = commander.opts().site || defaultUrl;
const DEFAULT_NUMBER_OF_PARTICIPANTS = 22; // Two+ groups of 10
// trouble can start at 10, because of DynamoDB transactions
// and seders often have about 20+ people
const numberOfParticipants =
  commander.opts().participants || DEFAULT_NUMBER_OF_PARTICIPANTS;
if (numberOfParticipants < 2) {
  console.error("Need at least 2 participants");
  process.exit(2);
}
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
  const leaderEmailAddress = "el@y.co";
  await page.type(yourEmailAddressTextBoxSelector, leaderEmailAddress);
  const planSederSubmitButtonSelector = "button:not([disabled])";
  await page.waitForSelector(planSederSubmitButtonSelector);
  await page.click(planSederSubmitButtonSelector);

  ///////////////////////// Edit Page /////////////////////////////////////////
  const guestNameTextBoxSelector = "#guest-name-input";
  const guestEmailTextBoxSelector = "#guest-email-input";
  await page.waitForSelector(guestNameTextBoxSelector, waitOptions);
  const editHref = page.url();
  const editUrl = new URL(editHref);
  const sederCode = editUrl.searchParams.get("sederCode");
  const editUrl2PathUrl = (e) => {
    const u = new URL(e.href);
    u.pathname = "/v2/path";
    return u.href;
  };
  // TODO: Make sure the link that the leader is prompted to save matches what's
  // currently in the address bar
  const participants = [{ gameName: leaderName, email: leaderEmailAddress }];
  for (let p = 1; p < numberOfParticipants; p++) {
    const participant = {
      gameName: "p" + lowercaseAlphabet[p],
      email: `${lowercaseAlphabet[p]}@x.co`,
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
  // verify everyone we added is in the list
  for (let p = 1; p < participants.length; p++) {
    const participant = participants[p];
    const gameNameTdXPath = `//td[text()="${participant.gameName}"]`;
    await page.waitForXPath(gameNameTdXPath);
    const emailTdXPath = `//td[text()="${participant.email}"]`;
    await page.waitForXPath(emailTdXPath);
  }
  // TODO: test removing a participant
  const thatsEveryoneButtonXPath = `//button[text()="That's everyone"][not(@disabled)]`;
  await page.waitForXPath(thatsEveryoneButtonXPath, waitOptions);
  await page.click("xpath/" + thatsEveryoneButtonXPath);
  const textWithParticipantCountXPath = `//*[text()[contains(.,"${participants.length}")]]`;
  await page.waitForXPath(textWithParticipantCountXPath, waitOptions);
  const yesThatsEveryoneButtonXPath = `//button[text()="Yes, that's everyone"][not(@disabled)]`;
  await page.click("xpath/" + yesThatsEveryoneButtonXPath);

  //////////////////////// Links Page /////////////////////////////////////////

  const yourLinksPageAnchorXPath = `//a[text()="your links page"]`;
  await page.waitForXPath(yourLinksPageAnchorXPath);
  const yourLinksPageHref = await page.$eval(
    "xpath/" + yourLinksPageAnchorXPath,
    (el) => el.href
  );
  await page.goto(yourLinksPageHref);
  const plinkXPath = (gameName) => `//a[text()="${gameName}'s link"]`;
  for (let p = 0; p < participants.length; p++) {
    const participant = participants[p];
    await page.waitForXPath(plinkXPath(participant.gameName));
    const plinkHref = await page.$eval(
      "xpath/" + plinkXPath(participant.gameName),
      (el) => el.href
    );
    participants[p].plinkHref = plinkHref;
  }

  ///////////// Blanks ////////////////////////////////////////////////////////
  const lastGuest = participants[participants.length - 1];
  // start with the last guest and work backwards
  // we are only going to submit in the browser once, so let's do it not as the
  // leader
  await page.goto(lastGuest.plinkHref);
  const promptIntroXPath = '//*[text()="Enter a word or phrase to replace..."]';
  await page.waitForXPath(promptIntroXPath, waitOptions);
  // We're on the Blanks page for the last guest
  // let's grab all assignments via backend-v2, and plan out our answers
  const plinkHref2AssignmentsUri = (hr) => {
    const u = new URL(hr);
    u.search += `&roomcode=${sederCode}`;
    u.pathname = "/v2/assignments";
    return u.href;
  };
  const plinkHref2SubmitLibUri = (hr) => {
    const u = new URL(hr);
    u.search = ``;
    u.pathname = "/v2/submit-lib";
    return u.href;
  };
  // get the read roster link
  // get the read link
  // get the script from s3, so that we can check for the right defaults
  const pathResponse = await fetch(editUrl2PathUrl(editUrl));
  const pathData = await pathResponse.json();
  const path = pathData.path;
  const scriptBucket = path.split("/")[0];
  const scriptKey = path.split("/")[1] + ".json";
  const s3Client = new S3Client({});
  const s3GetCommand = new GetObjectCommand({
    Bucket: scriptBucket,
    Key: scriptKey,
  });
  let script;
  try {
    const getScriptResponse = await s3Client.send(s3GetCommand);
    const scriptString = await getScriptResponse.Body.transformToString();
    script = JSON.parse(scriptString);
    console.log("script page count:", script.pages.length);
  } catch (error) {
    console.error("Failed to fetch script");
    console.error(error);
    process.exit(3);
  }

  const gameNameAndAssignmentId2Answer /* not assignment index */ = (
    gameName,
    assignmentId
  ) => `${gameName}-${assignmentId}`;
  for (let p = participants.length - 1; p >= 0; p--) {
    const assignmentsResponse = await fetch(
      plinkHref2AssignmentsUri(participants[p].plinkHref)
    );
    const assignments = await assignmentsResponse.json();
    participants[p].assignments = assignments;
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Clean up
  await browser.close();
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
})();
