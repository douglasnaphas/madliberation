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
  .option(
    "-t --term <TERM>",
    "Term to look for in the script path, default 2023_Script, another popular value is Practice_Script"
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
if (numberOfParticipants < 3) {
  console.error(
    "Need at least 3 participants: 1 to submit all libs, 1 to submit some, 1 to submit none"
  );
  process.exit(2);
}
const DEFAULT_SCRIPT_TERM = "2023_Script";
const scriptTerm = commander.opts().term || DEFAULT_SCRIPT_TERM;
const browserOptions = {
  headless: commander.opts().slow ? false : true,
  args: ["--no-sandbox"],
};
browserOptions.slowMo = slowDown;

const lowercaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
const failTest = async (err, msg, browsers) => {
  console.log("test failed: " + msg);
  console.log(err);
  if (browsers && browsers.length) {
    for (let b = 0; b < browsers.length; b++) {
      if (browsers[b].close) {
        await browsers[b].close();
      }
    }
  }
  process.exit(1);
};

const waitOptions = { timeout: timeoutMs /*, visible: true*/ };

(async () => {
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // Actual test

  const browsers = []; // so we can close them all when failing a test, someday
  const browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  const page = await browser.newPage();
  await page.goto(site);

  //////////////////////////////////////////////////////////////////////////////
  /////////////// Mad Liberation Home Page /////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // go to /create-haggadah
  const createHaggadahLinkText =
    "Plan a seder where people fill out their mad libs beforehand (experimental)";
  await page
    .waitForXPath('//*[text()="' + createHaggadahLinkText + '"]', waitOptions)
    .catch(async (e) => {
      failTest(e, "Plan a seder button not found", browsers);
    });
  await page.click('[madliberationid="plan-seder-button"]');

  //////////////////////////////////////////////////////////////////////////////
  ////////////////// Create Haggadah Home Page /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const pickScriptAccordionTextXPath = '//*[text()="Pick script"]';
  await page
    .waitForXPath(pickScriptAccordionTextXPath, waitOptions)
    .catch(async (e) => {
      failTest(e, "Pick script accordion not found", browsers);
    });
  await page.click("xpath/" + pickScriptAccordionTextXPath);
  console.log("scriptTerm:", scriptTerm);
  const desiredScriptRadioButtonXPath = `//input[contains(@value,"${scriptTerm}")]`;
  await page.waitForXPath(desiredScriptRadioButtonXPath, waitOptions);
  await page.click("xpath/" + desiredScriptRadioButtonXPath);
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

  //////////////////////////////////////////////////////////////////////////////
  ///////////////////////// Edit Page //////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Links Page ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////////////
  ////////////////////// Blanks Page ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // we are only going to submit in the browser once, so let's do it not as the
  // leader
  const BROWSER_USER_INDEX = participants.length - 1;
  const browserUser = participants[participants.length - 1];

  // start with the last guest and work backwards
  await page.goto(browserUser.plinkHref);
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
  } catch (error) {
    console.error("Failed to fetch script");
    console.error(error);
    process.exit(3);
  }

  // grab the defaults
  // these are from the script as saved in S3; they are not exposed to users,
  const defaults = [undefined];
  script.pages.forEach((page) => {
    page.lines.forEach((line) => {
      line.segments.forEach((segment) => {
        if (segment.type === "lib") {
          defaults.push(segment.default);
        }
      });
    });
  });

  // grab everyone's assisgnments
  for (let p = participants.length - 1; p >= 0; p--) {
    const assignmentsResponse = await fetch(
      plinkHref2AssignmentsUri(participants[p].plinkHref)
    );
    const assignments = await assignmentsResponse.json();
    participants[p].assignments = assignments;
  }

  // Figure out who will submit none, browserUser exempt.
  // Everyone is submitting, though only browserUser is submitting using the
  // frontend.
  const nonSubmitterIndex = Math.floor(
    Math.random() * (participants.length - 1)
  );
  // e.g., if there are 3 participants, we want to pick between 0 and 1
  // figure out who will submit all but one, browserUser exempt
  let partialSubmitterIndex;
  while (!Number.isInteger(partialSubmitterIndex)) {
    const tentativePartialSubmitterIndex = Math.floor(
      Math.random() * (participants.length - 1)
    );
    if (tentativePartialSubmitterIndex !== nonSubmitterIndex) {
      partialSubmitterIndex = tentativePartialSubmitterIndex;
    }
  }
  console.log("nonSubmitterIndex", nonSubmitterIndex);
  console.log("partialSubmitterIndex", partialSubmitterIndex);
  // figure out which answer the partial submitter won't submit
  const OMITTED_ANSWER_INDEX = 0; // partial submitter only

  // Considers non-submitter index and partial submitter index.
  // Returns the final answer. When we test the resubmit and blank-out flows
  // in the browser for browserUser, we will submit something other than the final
  // answer first (in the case of the resubmit flow), or blank out the final
  // answer after submitting it (for the blank-out flow).
  const answerToType = ({ participantIndex, assignmentId }) => {
    if (participantIndex === nonSubmitterIndex) {
      return "";
    }
    if (
      participantIndex === partialSubmitterIndex &&
      participants[participantIndex].assignments[OMITTED_ANSWER_INDEX].id ===
        assignmentId
    ) {
      return "";
    }
    return `${participants[participantIndex].gameName}-${assignmentId}`;
  };

  const BLANKED_OUT_ANSWER_INDEX = 1; // browserUser (browser user) only

  // Considers non-submitter index, partial submitter index,
  // BLANKED_OUT_ANSWER_INDEX, and defaults.
  const expectedAnswer = ({ participantIndex, assignmentId }) => {
    if (participantIndex === nonSubmitterIndex) {
      return defaults[assignmentId];
    }
    if (
      participantIndex === partialSubmitterIndex &&
      participants[participantIndex].assignments[OMITTED_ANSWER_INDEX].id ===
        assignmentId
    ) {
      return defaults[assignmentId];
    }

    return `${participants[participantIndex].gameName}-${assignmentId}`;
  };

  // submit libs
  const expectedAnswers = {};

  // browser
  for (
    let asi /* assignment index */ = 0;
    asi < browserUser.assignments.length;
    asi++
  ) {
    const RESUBMITTED_ANSWER_INDEX = 2;
    const BACK_BUTTON_TEST_INDEX = 3;
    const RANDOM_ACCESS_INDEXES = {
      START: 4, // when we hit here, go to END
      END: 1, // then return to START
    };

    const answerText = answerToType({
      participantIndex: participants.length - 1,
      assignmentId: browserUser.assignments[asi].id,
    });
    expectedAnswers[browserUser.assignments[asi].id] = answerText;

    // To test both the random-access flow and the auto-advance flow, click the
    // chip sometimes.
    const CHIP_INTERVAL = 4;
    if (asi % CHIP_INTERVAL === 0) {
      const chipSelector = `#prompt-chip-${asi}`;
      await page.click(chipSelector).catch((reason) => {
        failTest(
          reason,
          `did not find chip for prompt number ${asi},` +
            `"${assignments[asi].prompt}"`,
          browsers
        );
      });
    }

    // Really test random access
    if (asi === RANDOM_ACCESS_INDEXES.START) {
      // go back to END by clicking on the chip
      const endChipSelector = `#prompt-chip-${END}`;
      await page.click(endChipSelector).catch((reason) => {
        failTest(
          reason,
          `did not find chip for prompt number ${END}, ` +
            `"${assignments[END].prompt}"`,
          browsers
        );
      });

      // wait for the prompt from index END
      await page
        .waitForFunction(
          'document.getElementById("this-prompt").textContent.includes(`' +
            browserUser.assignments[END].prompt +
            "`)"
        )
        .catch((reason) => {
          failTest(
            reason,
            `tried jumping back to prompt number ${END}, ` +
              `didn't find expected prompt "${assignments[END].prompt}"`
          );
        });

      // go back to START
      const startChipSelector = `#prompt-chip-${START}`;
      await page.click(startChipSelector);
    }

    // wait for the card
    await page.waitForFunction(
      'document.getElementById("this-prompt").textContent.includes(`' +
        browserUser.assignments[asi].prompt +
        "`)"
    );

    // Expect the Submit button to be disabled before any text is entered

    // enter the text
    const answerBoxSelector = `#answer`;
    await page.type(answerBoxSelector, answerText);

    // click submit
    const buttonExplanationXPath =
      asi === browserUser.assignments.length - 1
        ? '//div[text()="Submit this one."]'
        : '//div[text()="Submit this one and advance to the next prompt."]';
    await page.waitForXPath(buttonExplanationXPath);
    const submitButtonXPath =
      `//button[text()="Submit` +
      (asi === browserUser.assignments.length - 1 ? `` : ` ➡️`) +
      `"][not(@disabled)]`;
    await page.click("xpath/" + submitButtonXPath);

    // check auto-advancing, unless we just submitted the last one
    if (asi < browserUser.assignments.length - 1) {
      // expect the prompt to advance
      await page
        .waitForFunction(
          'document.getElementById("this-prompt").textContent.includes(`' +
            browserUser.assignments[asi + 1].prompt +
            "`)"
        )
        .catch((reason) => {
          failTest(
            reason,
            `Failed to find prompt ${browserUser.assignments[asi + 1].prompt}`,
            browsers
          );
        });
    } else {
      // wait for the current answer
      const yourCurrentAnswerIntroXPath = `//*[text()="Your current answer is:"]`;
      await page.waitForXPath(yourCurrentAnswerIntroXPath);
    }

    // test that the Back button moves you to the previous lib
    if (asi === BACK_BUTTON_TEST_INDEX) {
      /* Depending on whether BACK_BUTTON_TEST_INDEX is the last assignment, we
      may or may not expect the current hash, after the back navigation, to be
      one less than what the hash just was. So we'll just make sure that the
      hash matches the assignment index after a Back. */
      await page.goBack();
      const actualHash = parseInt(new URL(page.url()).hash.split("#")[1]);
      const expectedPrompt = browserUser.assignments[actualHash].prompt;
      await page
        .waitForFunction(
          'document.getElementById("this-prompt").textContent.includes(`' +
            expectedPrompt +
            "`)"
        )
        .catch((reason) =>
          failTest(
            reason,
            `Prompt not equal to "${expectedPrompt}" after Back navigation`,
            browsers
          )
        );
    }
  }

  // submit the rest of the libs with the backend directly
  const plinkHref2SubmitLibUri = (hr) => {
    const u = new URL(hr);
    u.search = ``;
    u.pathname = "/v2/submit-lib";
    return u.href;
  };
  const plinkHref2SubmitLibFetchInit = ({ hr, answerText, answerId }) => {
    const u = new URL(hr);
    const fetchInit = {
      method: "POST",
      body: JSON.stringify({
        sederCode,
        pw: u.searchParams.get("pw"),
        ph: u.searchParams.get("ph"),
        answerText,
        answerId,
      }),
      headers: { "Content-Type": "application/json" },
    };
    return fetchInit;
  };
  for (let p = participants.length - 2; p >= 0; p--) {
    const submitLibUri = plinkHref2SubmitLibUri(participants[p].plinkHref);
    if (p === nonSubmitterIndex) {
      // write out that defaults are expected here
      continue;
    }
    for (let asi = 0; asi < participants[p].assignments.length; asi++) {
      if (p === partialSubmitterIndex && asi === 0) {
        console.log("this is the partial submitter's non-answer");
        console.log("p", p);
        console.log("asi", asi);
        console.log("this person's assignments:");
        console.log(participants[p].assignments);
        expectedAnswers[participants[p].assignments[asi].id] =
          defaults[participants[p].assignments[asi].id];
        continue;
      }
      const answerText = answerToType({
        participantIndex: p,
        assignmentId: participants[p].assignments[asi].id,
      });
      const answerId = participants[p].assignments[asi].id;
      expectedAnswers[answerId] = answerText;
      const submitLibFetchInit = plinkHref2SubmitLibFetchInit({
        hr: participants[p].plinkHref,
        answerText,
        answerId,
      });
      const submitLibResponse = await fetch(submitLibUri, submitLibFetchInit);
      if (submitLibResponse.status !== 200) {
        console.error("failed to submit lib", p, asi);
        process.exit(4);
      }
    }
  }

  // check the script
  // get the read link, log it
  const readLinkSelector = `#read-link`;
  await page.waitForSelector(readLinkSelector, waitOptions);
  const readLinkHref = await page.$eval(readLinkSelector, (el) => el.href);
  console.log("readLinkHref:", readLinkHref);
  // get the read roster link, log it
  const readRosterLinkSelector = `#read-roster-link`;
  await page.waitForSelector(readRosterLinkSelector, waitOptions);
  const readRosterLinkHref = await page.$eval(
    readRosterLinkSelector,
    (el) => el.href
  );
  console.log("readRosterLinkHref:", readRosterLinkHref);

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Read Roster /////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// Read Page //////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await page.goto(readLinkHref);
  const readThisPageAloudXPath = `//*[text()="Read aloud. Have a new person read each page, going around the Seder. Click a gray box to see the prompt."]`;
  await page.waitForXPath(readThisPageAloudXPath);
  const nextPageXPath = `//button[text()="Next page"]`;
  await page.waitForXPath(nextPageXPath);
  const populatedScriptHref = (() => {
    const readLinkUrl = new URL(readLinkHref);
    readLinkUrl.pathname = "/v2/script";
    readLinkUrl.hash = "";
    return readLinkUrl.href;
  })();
  const populatedScriptResponse = await fetch(populatedScriptHref);
  const populatedScript = await populatedScriptResponse.json();

  // loop through the libs in the populatedScript, making sure the provided answer
  // matches the expected answer
  const receivedAnswers = {};
  populatedScript.pages.forEach((page) => {
    page.lines.forEach((line) => {
      line.segments.forEach((segment) => {
        if (segment.type === "lib") {
          receivedAnswers[segment.id] = segment.answer;
        }
      });
    });
  });
  console.log("defaults:");
  console.log(defaults);
  console.log("receivedAnswers:");
  console.log(receivedAnswers);
  console.log("expectedAnswers:");
  console.log(expectedAnswers);
  Object.keys(expectedAnswers).forEach((expectedAnswerIndex) => {
    const ea = expectedAnswers[expectedAnswerIndex];
    const ra = receivedAnswers[expectedAnswerIndex];
    if (ra !== ea) {
      console.error("expected", ea);
      console.error("got", ra);
      process.exit(5);
    }
  });

  // loop through the participants, making sure each provided answer appears
  // in the expected place in the script

  // check the read roster

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Clean up
  await browser.close();
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
})();
