#!/usr/bin/env node

const puppeteer = require("puppeteer");
const commander = require("commander");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

commander
  .version("1.0.0")
  .option(
    "-s, --site <URL>",
    "Site to run against, default https://passover.lol"
  )
  .option("-L, --slow", "Run headfully in slow mode")
  .option("-I, --idp-url <URL>", "The URL expected after clicking 'Log in'")
  .option("--user-pool-id <ID>", "The User Pool Id for the web app")
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
const timeout = 10000 + (commander.opts().slow ? slowDown + 2000 : 0); // ms
const defaultUrl = "https://passover.lol";
const site = commander.opts().site || defaultUrl;
const idpUrl = commander.opts().idpUrl;
const userPoolId = commander.opts().userPoolId;
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

const waitOptions = { timeout /*, visible: true */ };

(async () => {
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // Actual test

  const browsers = []; // so we can close them all when failing a test
  const browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  const page = await browser.newPage();
  await page.goto(site);

  //////////////////////////////////////////////////////////////////////////////
  /////////////// Mad Liberation Home Page /////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Create a user, so we can log in
  // helper for generating random creds
  const randString = (options) => {
    const { numLetters } = options;
    const alphabet = (
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789"
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
  // create user
  const {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
  } = require("@aws-sdk/client-cognito-identity-provider");
  const createUser = async (userName, nickname, tempPassword) => {
    const cognitoIdentityProviderClient = new CognitoIdentityProviderClient();
    const adminCreateUserInput = {
      // AdminCreateUserRequest
      UserPoolId: userPoolId, // required
      Username: userName, // required
      MessageAction: "SUPPRESS",
      TemporaryPassword: tempPassword,
      UserAttributes: [
        // AttributeListType
        {
          // AttributeType
          Name: "nickname", // required
          Value: nickname,
        },
      ],
      ValidationData: [
        {
          Name: "email_verified", // required
          Value: "True",
        },
      ],
    };
    const adminCreateUserCommand = new AdminCreateUserCommand(
      adminCreateUserInput
    );
    const adminCreateUserResponse = await cognitoIdentityProviderClient.send(
      adminCreateUserCommand
    );
    if (!adminCreateUserResponse || !adminCreateUserResponse.User) {
      failTest(
        adminCreateUserResponse,
        "Failed to create a user in AWS SDK v3 setup"
      );
    }
    console.log(`created user with username ${userName}`);
  };
  const leaderNicknameLength = 8;
  const leaderNickname = randString({ numLetters: leaderNicknameLength });
  const leaderEmailAddress = leaderNickname + "@example.com";
  const leaderTempPasswordLength = 10;
  const leaderTempPassword = randString({
    numLetters: leaderTempPasswordLength,
  });
  const leaderPasswordLength = 12;
  const leaderPassword = randString({ numLetters: leaderPasswordLength });
  await createUser(leaderEmailAddress, leaderNickname, leaderTempPassword);

  // Expect the Plan a Seder button to be disabled before login
  const planSederButtonSelector = '[madliberationid="plan-seder-button"]';
  await page.waitForSelector(planSederButtonSelector);
  const disabledStatusOfPlanSederButtonPreLogin = await page.$eval(
    planSederButtonSelector,
    (link) =>
      link.getAttribute("aria-disabled") === "true" ||
      link.hasAttribute("disabled")
  );
  if (!disabledStatusOfPlanSederButtonPreLogin) {
    failTest(
      new Error(
        "Plan Seder should be disabled before login",
        "Plan Seder button (link) not disabled",
        browsers
      )
    );
  }

  // Log in (leader)
  const loginButtonSelector = '[madliberationid="login-button"]';
  await page.waitForSelector(loginButtonSelector);
  await Promise.all([
    page.click(loginButtonSelector),
    page.waitForNavigation(),
  ]);
  if (page.url() !== idpUrl) {
    failTest(
      new Error("wrong IDP URL"),
      `expected IDP URL ${idpUrl}, got ${page.url()}`,
      browsers
    );
  }
  // Enter username
  const usernameSelector = `input#signInFormUsername[type='text']`;
  await page.waitForSelector(usernameSelector);
  await page.type(usernameSelector, leaderEmailAddress);
  // Enter temp password
  const passwordSelector = `input#signInFormPassword[type='password']`;
  await page.type(passwordSelector, leaderTempPassword);
  const submitButtonSelector = `input[name='signInSubmitButton'][type='Submit']`;
  await page.click(submitButtonSelector);
  // Change the password
  const newPasswordSelector = `input#new_password[type='password']`;
  await page.waitForSelector(newPasswordSelector);
  await page.type(newPasswordSelector, leaderPassword);
  const confirmPasswordSelector = `input#confirm_password[type='password']`;
  await page.type(confirmPasswordSelector, leaderPassword);
  const resetPassWordButtonSelector = `button[name="reset_password"][type='submit']`;
  await page.click(resetPassWordButtonSelector);

  // go to /create-haggadah
  const createHaggadahLinkText = "Plan a seder";
  await page
    .waitForXPath('//*[text()="' + createHaggadahLinkText + '"]', waitOptions)
    .catch(async (e) => {
      failTest(e, "Plan a seder button not found", browsers);
    });
  await page.click(planSederButtonSelector);

  //////////////////////////////////////////////////////////////////////////////
  ////////////////// Create Haggadah Home Page /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // The logged-in leader's email and nickname should be displayed
  const leaderNicknameXPath = `//*[contains(., "${leaderNickname}")]`;
  await page.waitForXPath(leaderNicknameXPath);

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
  const participants = [
    { gameName: leaderNickname, email: leaderEmailAddress },
  ];
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
    participants[p].answered = 0;
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

  const BLANKED_OUT_ANSWER_INDEX = 2; // browserUser (browser user) only

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
    if (
      participantIndex === BROWSER_USER_INDEX &&
      assignmentId ===
        participants[participantIndex].assignments[BLANKED_OUT_ANSWER_INDEX].id
    ) {
      return defaults[assignmentId];
    }
    return `${participants[participantIndex].gameName}-${assignmentId}`;
  };

  // submit libs
  const expectedAnswers = {}; // lib id -> expected answer text

  // browser
  for (
    let asi /* assignment index */ = 0;
    asi < browserUser.assignments.length;
    asi++
  ) {
    const BACK_BUTTON_TEST_INDEX = 3;
    const RANDOM_ACCESS_INDEXES = {
      LATE: 4, // when we hit here, go to EARLY, which we already submitted
      EARLY: 1, // then return to LATE
    };
    const yourCurrentAnswerIntroXPath = `//*[text()="Your current answer is:"]`;

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
            `"${browserUser.assignments[asi].prompt}"`,
          browsers
        );
      });
    }

    // Really test random access and resubmission
    if (asi === RANDOM_ACCESS_INDEXES.LATE) {
      const { LATE: LATE, EARLY: EARLY } = RANDOM_ACCESS_INDEXES;

      // go back to EARLY, which we already submitted, by clicking on the chip
      const endChipSelector = `#prompt-chip-${EARLY}`;
      await page.click(endChipSelector).catch((reason) => {
        failTest(
          reason,
          `did not find chip for prompt number ${EARLY}, ` +
            `"${assignments[EARLY].prompt}"`,
          browsers
        );
      });

      // wait for the prompt from index EARLY
      await page
        .waitForFunction(
          'document.getElementById("this-prompt").textContent.includes(`' +
            browserUser.assignments[EARLY].prompt +
            "`)"
        )
        .catch((reason) => {
          failTest(
            reason,
            `tried jumping back to prompt number ${EARLY}, ` +
              `didn't find expected prompt "${assignments[EARLY].prompt}"`
          );
        });

      // It should say "your current answer is <previously submitted answer>"
      const previouslySubmittedAnswer =
        expectedAnswers[browserUser.assignments[EARLY].id];
      await page.waitForXPath(yourCurrentAnswerIntroXPath);
      const currentAnswerText = await page
        .$eval("#current-answer", (el) => el.textContent)
        .catch((reason) => {
          failTest(reason, "Unable to find current answer", browsers);
        });
      if (currentAnswerText !== previouslySubmittedAnswer) {
        failTest(
          new Error("wrong current answer text"),
          `expected "${previouslySubmittedAnswer}," got ` +
            `"${currentAnswerText}."`,
          browsers
        );
      }

      // There should be a blank-out button and a re-submit button
      const blankOutButtonXPath = '//button[text()="Blank out this answer"]';
      await page.waitForXPath(blankOutButtonXPath);
      const updateAnswerButtonXPath = '//button[text()="Update answer"]';
      await page.waitForXPath(updateAnswerButtonXPath);

      // There should be two buttons total, i.e., no Submit button
      const buttons = await page.$$("button");
      if (buttons.length !== 2) {
        failTest(
          "wrong number of buttons",
          `expected 2 buttons, found ${buttons.length}`,
          browsers
        );
      }

      // The re-submit button should be disabled
      const disabledUpdateAnswerButtonXPath =
        '//button[text()="Update answer" and @disabled]';
      await page
        .waitForXPath(disabledUpdateAnswerButtonXPath)
        .catch((reason) => {
          failTest(reason, "Update answer button not disabled", browsers);
        });

      // There should be no "and go to the next prompt" text.
      const submitButtonExplanations = await page.$$(
        "#submit-button-explanation"
      );
      if (submitButtonExplanations.length !== 0) {
        failTest(
          "found submit button explanations",
          `expected no submit button explanations, found ${submitButtonExplanations.length}`,
          browsers
        );
      }

      // Update the answer
      const updatedAnswerText = "updated answer";
      const answerBoxSelector = "#answer";
      await page.type(answerBoxSelector, updatedAnswerText);
      await page.click("xpath/" + updateAnswerButtonXPath);
      expectedAnswers[browserUser.assignments[EARLY].id] = updatedAnswerText;

      // go back to LATE
      const startChipSelector = `#prompt-chip-${LATE}`;
      await page.click(startChipSelector);
    }

    // wait for the card
    await page.waitForFunction(
      'document.getElementById("this-prompt").textContent.includes(`' +
        browserUser.assignments[asi].prompt +
        "`)"
    );

    // Expect the Submit button to be disabled before any text is entered
    const disabledSubmitButtonXPath =
      '//button[@disabled and contains(text(), "Submit")]';
    await page.waitForXPath(disabledSubmitButtonXPath).catch((reason) => {
      failTest(
        reason,
        `did not find disabled Submit button when text box was blank`,
        browsers
      );
    });

    // enter the text
    const answerBoxSelector = `#answer`;
    await page.type(answerBoxSelector, answerText);

    // click submit
    const buttonExplanationXPath =
      asi === browserUser.assignments.length - 1
        ? '//*[text()="Submit this one"]'
        : '//*[contains(text(),"Submit, go to next prompt")]';
    await page.waitForXPath(buttonExplanationXPath);
    const submitButtonXPath = `//button[contains(text(),"Submit")][not(@disabled)]`;
    await page.click("xpath/" + submitButtonXPath);
    browserUser.answered++;

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
      await page.waitForXPath(yourCurrentAnswerIntroXPath);
    }

    // test that the Back button moves you to the previous lib
    if (asi === BACK_BUTTON_TEST_INDEX) {
      /* Depending on whether BACK_BUTTON_TEST_INDEX is the last assignment, we
      may or may not expect the current hash, after the back navigation, to be
      one less than what the hash just was. So we'll just make sure that the
      hash matches the assignment index after a Back. */
      const currentHash = () =>
        parseInt(new URL(page.url()).hash.split("#")[1]);
      const hashBeforeBack = currentHash();
      await page.goBack();
      const hashAfterBack = currentHash();
      const expectedPrompt = browserUser.assignments[hashAfterBack].prompt;
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
      await page.goForward();
      const hashAfterBackAndForward = currentHash();
      if (hashBeforeBack !== hashAfterBackAndForward) {
        failTest(
          new Error("unexpected hash behavior after Back and Forward"),
          `expected hash ${hashBeforeBack}, got ${hashAfterBackAndForward}`,
          browsers
        );
      }
    }

    // test blank-out
    if (asi === BLANKED_OUT_ANSWER_INDEX) {
      const blankoutLibId = browserUser.assignments[asi].id;
      console.log(`testing browser blankout`);

      // click the previous card to go back one
      const chipSelector = `#prompt-chip-${BLANKED_OUT_ANSWER_INDEX}`;
      await page.click(chipSelector);
      console.log(`clicked ${chipSelector}`);

      // blank out the answer
      const blankOutButtonXPath = '//button[text()="Blank out this answer"]';
      await page.waitForXPath(blankOutButtonXPath);
      console.log(`found blankOutButtonXPath ${blankOutButtonXPath}`);
      await page.click("xpath/" + blankOutButtonXPath);
      browserUser.answered--;
      console.log(`clicked blank-out button`);
      expectedAnswers[blankoutLibId] = defaults[blankoutLibId];

      // go to the next assignment, if there is one
      if (BLANKED_OUT_ANSWER_INDEX < browserUser.assignments.length - 1) {
        console.log(
          `BLANKOUT_INDEX ${BLANKED_OUT_ANSWER_INDEX}, there are ` +
            `${browserUser.assignments.length} assignments`
        );
        const nextChipSelector = `#prompt-chip-${BLANKED_OUT_ANSWER_INDEX + 1}`;
        await page.click(nextChipSelector);
        console.log(`clicked nextChipSelector ${nextChipSelector}`);
      }
    }
  } // done testing submission with browser

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
      participants[p].answered++;
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

  const readRosterBrowser = await puppeteer.launch(browserOptions);
  browsers.push(readRosterBrowser);
  const readRosterPage = await readRosterBrowser.newPage();
  await readRosterPage.goto(readRosterLinkHref);
  // check the table headers
  const nameHeaderXPath =
    `//th[text()="Name" and ` +
    `following-sibling::th[text()="Answered"] and ` +
    `following-sibling::th[text()="Assigned"]]`;
  await readRosterPage.waitForXPath(nameHeaderXPath);
  const answeredHeaderXPath =
    `//th[text()="Answered" and ` + `following-sibling::th[text()="Assigned"]]`;
  await readRosterPage.waitForXPath(answeredHeaderXPath);

  // Loop through participants, check their read roster info
  for (let p = 0; p < participants.length; p++) {
    const participantName = participants[p].gameName;
    const guestNameCellSelector = `#guest-name-cell-${participantName}`;
    const guestAnswersSelector = `#guest-answers-${participantName}`;
    const guestAssignmentsSelector = `#guest-assignments-${participantName}`;

    // How many were assigned?
    const expectedNumberAssigned = participants[p].assignments.length;
    const actualNumberAssigned = parseInt(
      await readRosterPage
        .$eval(guestAssignmentsSelector, (el) => el.textContent)
        .catch(async (reason) => {
          await failTest(
            reason,
            `Unable to get number assigned, ${guestAssignmentsSelector}`,
            browsers
          );
        })
    );
    if (expectedNumberAssigned !== actualNumberAssigned) {
      await failTest(
        "wrong number assigned on read roster",
        `expected ${expectedNumberAssigned}, got ` +
          `${actualNumberAssigned}, participant ${p} name ${participants[p].gameName}`,
        browsers
      );
    }

    // How many were answered?
    // # assigned - # blanked out and not resubmitted - # never submitted
    const expectedNumberAnswered = participants[p].answered;
    const actualNumberAnswered = parseInt(
      await readRosterPage
        .$eval(guestAnswersSelector, (el) => el.textContent)
        .catch(async (reason) => {
          await failTest(
            reason,
            `Unable to get number answered, ${guestAnswersSelector}`,
            browsers
          );
        })
    );
    if (expectedNumberAnswered !== actualNumberAnswered) {
      await failTest(
        "wrong number answered on read roster",
        `expected ${expectedNumberAnswered}, got ` +
          `${actualNumberAnswered}, participant ${p} name ${participants[p].gameName}`,
        browsers
      );
    } else {
      console.log(
        `read roster: found ` +
          `${actualNumberAnswered} / ${actualNumberAnswered} for ` +
          `${participants[p].gameName}, as expected`
      );
    }
  }

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

  // Page through the script, look for the right answers in situ

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Clean up
  for (let b = 0; b < browsers.length; b++) {
    if (browsers[b].close) {
      await browsers[b].close();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
})();
