import React, { Component } from 'react';
import MenuAppBar from './MenuAppBar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class PrivacyPolicy extends Component {
  render() {
    return (
      <div>
        <MenuAppBar />
        <div madliberationid="privacy-policy-page">
          <br />

          <div>
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n  [data-custom-class='body'], [data-custom-class='body'] * {\n          background: transparent !important;\n        }\n[data-custom-class='title'], [data-custom-class='title'] * {\n          font-family: Arial !important;\nfont-size: 26px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='subtitle'], [data-custom-class='subtitle'] * {\n          font-family: Arial !important;\ncolor: #595959 !important;\nfont-size: 14px !important;\n        }\n[data-custom-class='heading_1'], [data-custom-class='heading_1'] * {\n          font-family: Arial !important;\nfont-size: 19px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='heading_2'], [data-custom-class='heading_2'] * {\n          font-family: Arial !important;\nfont-size: 17px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='body_text'], [data-custom-class='body_text'] * {\n          color: #595959 !important;\nfont-size: 14px !important;\nfont-family: Arial !important;\n        }\n[data-custom-class='link'], [data-custom-class='link'] * {\n          color: #3030F1 !important;\nfont-size: 14px !important;\nfont-family: Arial !important;\nword-break: break-word !important;\n        }\n"
              }}
            />
            <div data-custom-class="body">
              <p style={{ fontSize: '15px' }}>
                <strong>
                  <span style={{ fontSize: '26px' }}>
                    <span data-custom-class="title">
                      <bdt className="block-component" />
                      <strong>
                        <span style={{ fontSize: '26px' }}>
                          <span data-custom-class="title">PRIVACY POLICY</span>
                        </span>
                      </strong>{' '}
                      <bdt className="statement-end-if-in-editor" />
                    </span>
                  </span>
                </strong>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(127, 127, 127)' }}>
                  <strong>
                    <span data-custom-class="subtitle">
                      Last updated{' '}
                      <bdt className="question">February 24, 2020</bdt>
                    </span>
                  </strong>
                </span>
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                <br />
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">
                    Thank you for choosing to be part of our community at{' '}
                    <bdt className="question">Very Awesome Passover</bdt>
                    <bdt className="block-component" /> (“
                    <bdt className="block-component" />
                    <strong>Company</strong>
                    <bdt className="statement-end-if-in-editor" />
                    ”, “<strong>we</strong>”, “<strong>us</strong>”, or “
                    <strong>our</strong>”). We are committed to protecting your
                    personal information and your right to privacy. If you have
                    any questions or concerns about our{' '}
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="block-component" />
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">policy</span>
                        </span>
                        <bdt className="statement-end-if-in-editor" />
                      </span>
                    </span>
                    , or our practices with regards to your personal
                    information, please contact us at{' '}
                    <bdt className="question">admin@passover.lol</bdt>.
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">
                    When you visit our <bdt className="block-component" />
                    website <bdt className="question">https://passover.lol</bdt>
                    ,<bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" /> and use our services,
                    you trust us with your personal information. We take your
                    privacy very seriously. In this{' '}
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="block-component" />
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            privacy policy
                          </span>
                        </span>
                        <bdt className="statement-end-if-in-editor" />
                      </span>
                    </span>
                    , we seek to explain to you in the clearest way possible
                    what information we collect, how we use it and what rights
                    you have in relation to it. We hope you take some time to
                    read through it carefully, as it is important. If there are
                    any terms in this{' '}
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="block-component" />
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            privacy policy
                          </span>
                        </span>
                        <bdt className="statement-end-if-in-editor" />
                      </span>{' '}
                    </span>
                    that you do not agree with, please discontinue use of our{' '}
                    <bdt className="block-component" />
                    Sites
                    <bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" />{' '}
                    <bdt className="block-component" /> and our services.
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">
                    This{' '}
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="block-component" />
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            privacy policy
                          </span>
                        </span>
                        <bdt className="statement-end-if-in-editor" />
                      </span>{' '}
                    </span>
                    applies to all information collected through our{' '}
                    <bdt className="block-component" />
                    <bdt className="forloop-component" />
                    <bdt className="question">website</bdt>
                    <bdt className="forloop-component" /> (such as{' '}
                    <bdt className="question">https://passover.lol</bdt>),{' '}
                    <bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" /> and/or any related
                    services, sales, marketing or events (we refer to them
                    collectively in this{' '}
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="block-component" />
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            privacy policy
                          </span>
                        </span>
                        <bdt className="statement-end-if-in-editor" />
                      </span>{' '}
                    </span>
                    as the "<strong>Services</strong>").
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <span data-custom-class="body_text">
                      Please read this{' '}
                      <span style={{ color: 'rgb(89, 89, 89)' }}>
                        <span data-custom-class="body_text">
                          <bdt className="block-component" />
                          <span style={{ color: 'rgb(89, 89, 89)' }}>
                            <span data-custom-class="body_text">
                              privacy policy
                            </span>
                          </span>
                          <bdt className="statement-end-if-in-editor" />
                        </span>{' '}
                      </span>
                      carefully as it will help you make informed decisions
                      about sharing your personal information with us.
                    </span>
                  </strong>
                </span>
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <br />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(0, 0, 0)' }}>
                  <strong>
                    <span style={{ fontSize: '19px' }}>
                      <span data-custom-class="heading_1">
                        TABLE OF CONTENTS
                      </span>
                    </span>
                  </strong>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#infocollect">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    1. WHAT INFORMATION DO WE COLLECT?
                  </span>
                </a>{' '}
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <bdt className="block-component" />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#infouse">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    2. HOW DO WE USE YOUR INFORMATION?
                  </span>
                </a>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="statement-end-if-in-editor" />
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <a data-custom-class="link" href="#infoshare">
                    3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
                  </a>
                  <bdt className="block-component">
                    <span data-custom-class="body_text" />
                  </bdt>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <a data-custom-class="link" href="#whoshare">
                    4. WHO WILL YOUR INFORMATION BE SHARED WITH?
                  </a>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="statement-end-if-in-editor" />
                  </span>
                </span>
                <span style={{ fontSize: '15px', color: 'rgb(89, 89, 89)' }}>
                  <bdt className="block-component" />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#cookies">
                  <span style={{ fontSize: '15px', color: 'rgb(89, 89, 89)' }}>
                    5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </span>
                </a>
                <span style={{ fontSize: '15px', color: 'rgb(89, 89, 89)' }}>
                  <bdt className="statement-end-if-in-editor" />
                </span>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="block-component" />
                    <bdt className="block-component" />
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#sociallogins">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span style={{ color: 'rgb(89, 89, 89)' }}>
                        6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                      </span>
                    </span>
                  </span>
                </a>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <bdt className="statement-end-if-in-editor" />
                    </span>
                  </span>
                  <bdt className="block-component" />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#intltransfers">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    7. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
                  </span>
                </a>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <bdt className="statement-end-if-in-editor" />
                  <bdt className="block-component" />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#inforetain">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    8. HOW LONG DO WE KEEP YOUR INFORMATION?
                  </span>
                </a>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="block-component" />
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#infosafe">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    9. HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </span>
                </a>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <bdt className="statement-end-if-in-editor" />
                    </span>
                  </span>
                  <bdt className="block-component" />
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#infominors">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    10. DO WE COLLECT INFORMATION FROM MINORS?
                  </span>
                </a>
                <bdt className="statement-end-if-in-editor" />
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#privacyrights">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    11. WHAT ARE YOUR PRIVACY RIGHTS?
                    <bdt className="block-component" />
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#databreach">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    12. DATA BREACH
                  </span>
                </a>
                <a data-custom-class="link" href="#privacyrights">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="statement-end-if-in-editor" />
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#DNT">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    13. CONTROLS FOR DO-NOT-TRACK FEATURES
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#caresidents">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    14. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#policyupdates">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    15. DO WE MAKE UPDATES TO THIS POLICY?
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px' }}>
                <a data-custom-class="link" href="#contact">
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    16. HOW CAN YOU CONTACT US ABOUT THIS POLICY?
                  </span>
                </a>
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <br />
                </span>
              </p>
              <p id="infocollect" style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(0, 0, 0)' }}>
                  <strong>
                    <span style={{ fontSize: '19px' }}>
                      <span data-custom-class="heading_1">
                        1. WHAT INFORMATION DO WE COLLECT?
                      </span>
                    </span>
                  </strong>
                  <span style={{ fontSize: '19px' }}>
                    <span data-custom-class="heading_1">
                      <span style={{ color: 'rgb(89, 89, 89)' }}>
                        <bdt className="block-component" />
                      </span>
                    </span>
                  </span>
                </span>
              </p>
              <div style={{ lineHeight: '1.1' }}>
                <br />
              </div>
              <div>
                <span style={{ color: 'rgb(0, 0, 0)' }}>
                  <strong>
                    <span data-custom-class="heading_2">
                      Personal information you disclose to us
                    </span>
                  </strong>
                </span>
              </div>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <em>
                      <span data-custom-class="body_text">In Short:</span>
                    </em>
                  </strong>
                  <span data-custom-class="body_text">
                    <em>
                      We collect personal information that you provide to us
                      such as name, address, contact information, passwords and
                      security data,
                      <bdt className="block-component" /> payment information,
                      and social media login data
                      <bdt className="else-block" />
                    </em>
                  </span>
                  .
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span
                    data-custom-class="body_text"
                    style={{ fontSize: '15px' }}
                  >
                    We collect personal information that you voluntarily provide
                    to us when <bdt className="block-component" />
                    registering at the <bdt className="block-component" />
                    Services
                    <bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" />
                    <bdt className="block-component" />
                    <bdt className="statement-end-if-in-editor" /> expressing an
                    interest in obtaining information about us or our products
                    and services, when participating in activities on the{' '}
                    <bdt className="block-component" />
                    Services
                    <bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" />
                    <bdt className="block-component" />{' '}
                    <bdt className="block-component" />
                    (such as posting messages in our online forums or entering
                    competitions, contests or giveaways)
                    <bdt className="statement-end-if-in-editor" /> or otherwise
                    contacting us
                  </span>
                  <span data-custom-class="body_text">.</span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">
                    The personal information that we collect depends on the
                    context of your interactions with us and the{' '}
                    <bdt className="block-component" />
                    Services
                    <bdt className="statement-end-if-in-editor" />
                    <bdt className="block-component" />
                    <bdt className="block-component" />, the choices you make
                    and the products and features you use. The personal
                    information we collect can include the following:
                  </span>
                  <span data-custom-class="body_text">
                    <bdt className="block-component" />
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <span data-custom-class="body_text">
                      Publicly Available Personal Information.
                    </span>
                  </strong>
                  <span data-custom-class="body_text">
                    {' '}
                    We collect <bdt className="forloop-component" />
                    <bdt className="question">
                      first name, maiden name, last name, and nickname
                    </bdt>
                    ; <bdt className="forloop-component" />
                    <bdt className="question">email addresses</bdt>;{' '}
                    <bdt className="forloop-component" />
                    and other similar data.
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        <bdt className="statement-end-if-in-editor" />
                      </span>
                    </span>{' '}
                  </span>
                  <span data-custom-class="body_text">
                    <bdt className="block-component" />
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <span data-custom-class="body_text">Credentials.</span>
                  </strong>
                  <span data-custom-class="body_text">
                    {' '}
                    We may collect passwords, password hints, and similar
                    security information used for authentication and account
                    access.
                    <bdt className="block-component" />
                  </span>
                </span>
                <bdt className="block-component">
                  <span data-custom-class="body_text" />
                </bdt>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <span data-custom-class="body_text">
                      Social Media Login Data.
                    </span>
                  </strong>
                  <span data-custom-class="body_text">
                    {' '}
                    We may provide you with the option to register using social
                    media account details, like your Facebook, Twitter or other
                    social media account. If you choose to register in this way,
                    we will collect the Information described in the section
                    called "
                  </span>
                </span>
                <span data-custom-class="body_text">
                  <a data-custom-class="link" href="#sociallogins">
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      HOW DO WE HANDLE YOUR SOCIAL LOGINS
                    </span>
                  </a>
                </span>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">" below.</span>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <bdt className="statement-end-if-in-editor">
                      <span data-custom-class="body_text" />
                    </bdt>
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span data-custom-class="body_text">
                    All personal information that you provide to us must be
                    true, complete and accurate, and you must notify us of any
                    changes to such personal information.
                    <span style={{ fontSize: '15px' }}>
                      <span style={{ color: 'rgb(89, 89, 89)' }}>
                        <span data-custom-class="body_text">
                          <bdt className="statement-end-if-in-editor" />
                        </span>
                      </span>
                    </span>
                  </span>
                  <span data-custom-class="body_text">
                    <bdt className="block-component" />
                  </span>
                  <span data-custom-class="body_text">
                    <bdt className="statement-end-if-in-editor">
                      <bdt className="block-component" />
                    </bdt>
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}>
                  <span data-custom-class="body_text">
                    <span
                      style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}
                    >
                      <span data-custom-class="body_text">
                        <bdt className="statement-end-if-in-editor">
                          <bdt className="block-component" />
                        </bdt>
                      </span>
                    </span>
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                <br />
              </p>
              <p id="infouse" style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(0, 0, 0)' }}>
                  <strong>
                    <span style={{ fontSize: '19px' }}>
                      <span data-custom-class="heading_1">
                        2. HOW DO WE USE YOUR INFORMATION?
                      </span>
                    </span>
                  </strong>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <em>
                      <span style={{ fontSize: '15px' }}>
                        <span data-custom-class="body_text">In Short:</span>
                      </span>{' '}
                    </em>{' '}
                  </strong>
                  <span style={{ fontSize: '15px' }}>
                    <em>
                      <span data-custom-class="body_text">
                        We process your information for purposes based on
                        legitimate business interests, the fulfillment of our
                        contract with you, compliance with our legal
                        obligations, and/or your consent.
                      </span>
                    </em>
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ fontSize: '15px' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span data-custom-class="body_text">
                      We use personal information collected via our{' '}
                      <bdt className="block-component" />
                      Services
                      <bdt className="statement-end-if-in-editor" />
                      <bdt className="block-component" />
                      <bdt className="block-component" /> for a variety of
                      business purposes described below. We process your
                      personal information for these purposes in reliance on our
                      legitimate business interests, in order to enter into or
                      perform a contract with you, with your consent, and/or for
                      compliance with our legal obligations. We indicate the
                      specific processing grounds we rely on next to each
                      purpose listed below.
                    </span>
                    <span data-custom-class="body_text">
                      <bdt className="block-component" />
                    </span>
                  </span>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ fontSize: '15px' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span data-custom-class="body_text">
                      We use the information we collect or receive:
                      <bdt className="block-component" />
                    </span>
                  </span>
                </span>
              </p>
              <ul>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <strong>
                        <span data-custom-class="body_text">
                          To facilitate account creation and logon process.
                        </span>
                      </strong>
                      <span data-custom-class="body_text">
                        {' '}
                        If you choose to link your account with us to a third
                        party account (such as your Google or Facebook account),
                        we use the information you allowed us to collect from
                        those third parties to facilitate account creation and
                        logon process for the performance of the contract.{' '}
                        <bdt className="block-component" />
                        See the section below headed "
                      </span>
                    </span>
                  </span>
                  <span data-custom-class="body_text">
                    <a data-custom-class="link" href="#sociallogins">
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          HOW DO WE HANDLE YOUR SOCIAL LOGINS
                        </span>
                      </span>
                    </a>
                  </span>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span data-custom-class="body_text">
                        " for further information.
                        <span style={{ fontSize: '15px' }}>
                          <span style={{ color: 'rgb(89, 89, 89)' }}>
                            <span data-custom-class="body_text">
                              <bdt className="statement-end-if-in-editor" />
                            </span>
                          </span>
                        </span>
                      </span>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            <bdt className="statement-end-if-in-editor" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                            <bdt className="block-component" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <br />
                  <br />
                </li>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <strong>
                        <span data-custom-class="body_text">
                          To enable user-to-user communications.
                        </span>
                      </strong>
                      <span data-custom-class="body_text">
                        {' '}
                        We may use your information in order to enable
                        user-to-user communications with each user's consent.
                      </span>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <span style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                                      <span style={{ fontSize: '15px' }}>
                                        <span
                                          style={{ color: 'rgb(89, 89, 89)' }}
                                        >
                                          <span style={{ fontSize: '15px' }}>
                                            <span
                                              style={{
                                                color: 'rgb(89, 89, 89)'
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span data-custom-class="body_text">
                                                                <bdt className="statement-end-if-in-editor" />
                                                                <bdt className="block-component" />
                                                                <bdt className="block-component" />
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <br />
                  <br />
                </li>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <span style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                                      <span style={{ fontSize: '15px' }}>
                                        <span
                                          style={{ color: 'rgb(89, 89, 89)' }}
                                        >
                                          <span style={{ fontSize: '15px' }}>
                                            <span
                                              style={{
                                                color: 'rgb(89, 89, 89)'
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    '15px'
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      'rgb(89, 89, 89)'
                                                                  }}
                                                                >
                                                                  <span
                                                                    style={{
                                                                      fontSize:
                                                                        '15px'
                                                                    }}
                                                                  >
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          'rgb(89, 89, 89)'
                                                                      }}
                                                                    >
                                                                      <span data-custom-class="body_text">
                                                                        <strong>
                                                                          To
                                                                          manage
                                                                          user
                                                                          accounts
                                                                        </strong>
                                                                        . We may
                                                                        use your
                                                                        information
                                                                        for the
                                                                        purposes
                                                                        of
                                                                        managing
                                                                        our
                                                                        account
                                                                        and
                                                                        keeping
                                                                        it in
                                                                        working
                                                                        order.
                                                                        <span
                                                                          style={{
                                                                            fontSize:
                                                                              '15px'
                                                                          }}
                                                                        >
                                                                          <span
                                                                            style={{
                                                                              color:
                                                                                'rgb(89, 89, 89)'
                                                                            }}
                                                                          >
                                                                            <span
                                                                              style={{
                                                                                fontSize:
                                                                                  '15px'
                                                                              }}
                                                                            >
                                                                              <span
                                                                                style={{
                                                                                  color:
                                                                                    'rgb(89, 89, 89)'
                                                                                }}
                                                                              >
                                                                                <span
                                                                                  style={{
                                                                                    fontSize:
                                                                                      '15px'
                                                                                  }}
                                                                                >
                                                                                  <span
                                                                                    style={{
                                                                                      color:
                                                                                        'rgb(89, 89, 89)'
                                                                                    }}
                                                                                  >
                                                                                    <span
                                                                                      style={{
                                                                                        fontSize:
                                                                                          '15px'
                                                                                      }}
                                                                                    >
                                                                                      <span
                                                                                        style={{
                                                                                          color:
                                                                                            'rgb(89, 89, 89)'
                                                                                        }}
                                                                                      >
                                                                                        <span
                                                                                          style={{
                                                                                            fontSize:
                                                                                              '15px'
                                                                                          }}
                                                                                        >
                                                                                          <span
                                                                                            style={{
                                                                                              color:
                                                                                                'rgb(89, 89, 89)'
                                                                                            }}
                                                                                          >
                                                                                            <span
                                                                                              style={{
                                                                                                fontSize:
                                                                                                  '15px'
                                                                                              }}
                                                                                            >
                                                                                              <span
                                                                                                style={{
                                                                                                  color:
                                                                                                    'rgb(89, 89, 89)'
                                                                                                }}
                                                                                              >
                                                                                                <span
                                                                                                  style={{
                                                                                                    fontSize:
                                                                                                      '15px'
                                                                                                  }}
                                                                                                >
                                                                                                  <span
                                                                                                    style={{
                                                                                                      color:
                                                                                                        'rgb(89, 89, 89)'
                                                                                                    }}
                                                                                                  >
                                                                                                    <span
                                                                                                      style={{
                                                                                                        fontSize:
                                                                                                          '15px'
                                                                                                      }}
                                                                                                    >
                                                                                                      <span
                                                                                                        style={{
                                                                                                          color:
                                                                                                            'rgb(89, 89, 89)'
                                                                                                        }}
                                                                                                      >
                                                                                                        <span
                                                                                                          style={{
                                                                                                            fontSize:
                                                                                                              '15px'
                                                                                                          }}
                                                                                                        >
                                                                                                          <span
                                                                                                            style={{
                                                                                                              color:
                                                                                                                'rgb(89, 89, 89)'
                                                                                                            }}
                                                                                                          >
                                                                                                            <span
                                                                                                              style={{
                                                                                                                fontSize:
                                                                                                                  '15px'
                                                                                                              }}
                                                                                                            >
                                                                                                              <span
                                                                                                                style={{
                                                                                                                  color:
                                                                                                                    'rgb(89, 89, 89)'
                                                                                                                }}
                                                                                                              >
                                                                                                                <span
                                                                                                                  style={{
                                                                                                                    fontSize:
                                                                                                                      '15px'
                                                                                                                  }}
                                                                                                                >
                                                                                                                  <span
                                                                                                                    style={{
                                                                                                                      color:
                                                                                                                        'rgb(89, 89, 89)'
                                                                                                                    }}
                                                                                                                  >
                                                                                                                    <span
                                                                                                                      style={{
                                                                                                                        fontSize:
                                                                                                                          '15px'
                                                                                                                      }}
                                                                                                                    >
                                                                                                                      <span
                                                                                                                        style={{
                                                                                                                          color:
                                                                                                                            'rgb(89, 89, 89)'
                                                                                                                        }}
                                                                                                                      >
                                                                                                                        <span
                                                                                                                          style={{
                                                                                                                            fontSize:
                                                                                                                              '15px'
                                                                                                                          }}
                                                                                                                        >
                                                                                                                          <span
                                                                                                                            style={{
                                                                                                                              color:
                                                                                                                                'rgb(89, 89, 89)'
                                                                                                                            }}
                                                                                                                          >
                                                                                                                            <span data-custom-class="body_text">
                                                                                                                              <bdt className="statement-end-if-in-editor" />
                                                                                                                              <bdt className="block-component" />
                                                                                                                            </span>
                                                                                                                          </span>
                                                                                                                        </span>
                                                                                                                      </span>
                                                                                                                    </span>
                                                                                                                  </span>
                                                                                                                </span>
                                                                                                              </span>
                                                                                                            </span>
                                                                                                          </span>
                                                                                                        </span>
                                                                                                      </span>
                                                                                                    </span>
                                                                                                  </span>
                                                                                                </span>
                                                                                              </span>
                                                                                            </span>
                                                                                          </span>
                                                                                        </span>
                                                                                      </span>
                                                                                    </span>
                                                                                  </span>
                                                                                </span>
                                                                              </span>
                                                                            </span>
                                                                          </span>
                                                                        </span>
                                                                      </span>
                                                                    </span>
                                                                  </span>
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <bdt className="block-component" />
                  <br />
                  <br />
                </li>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <span style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                                      <span style={{ fontSize: '15px' }}>
                                        <span
                                          style={{ color: 'rgb(89, 89, 89)' }}
                                        >
                                          <span style={{ fontSize: '15px' }}>
                                            <span
                                              style={{
                                                color: 'rgb(89, 89, 89)'
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    '15px'
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      'rgb(89, 89, 89)'
                                                                  }}
                                                                >
                                                                  <span
                                                                    style={{
                                                                      fontSize:
                                                                        '15px'
                                                                    }}
                                                                  >
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          'rgb(89, 89, 89)'
                                                                      }}
                                                                    >
                                                                      <span data-custom-class="body_text">
                                                                        <strong>
                                                                          To
                                                                          respond
                                                                          to
                                                                          user
                                                                          inquiries/offer
                                                                          support
                                                                          to
                                                                          users.
                                                                        </strong>{' '}
                                                                        We may
                                                                        use your
                                                                        information
                                                                        to
                                                                        respond
                                                                        to your
                                                                        inquiries
                                                                        and
                                                                        solve
                                                                        any
                                                                        potential
                                                                        issues
                                                                        you
                                                                        might
                                                                        have
                                                                        with the
                                                                        use of
                                                                        our
                                                                        Services.
                                                                        <bdt className="statement-end-if-in-editor" />
                                                                      </span>
                                                                    </span>
                                                                  </span>
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <span style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                                      <span style={{ fontSize: '15px' }}>
                                        <span
                                          style={{ color: 'rgb(89, 89, 89)' }}
                                        >
                                          <span style={{ fontSize: '15px' }}>
                                            <span
                                              style={{
                                                color: 'rgb(89, 89, 89)'
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    '15px'
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      'rgb(89, 89, 89)'
                                                                  }}
                                                                >
                                                                  <span
                                                                    style={{
                                                                      fontSize:
                                                                        '15px'
                                                                    }}
                                                                  >
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          'rgb(89, 89, 89)'
                                                                      }}
                                                                    >
                                                                      <span data-custom-class="body_text">
                                                                        <bdt className="block-component" />
                                                                      </span>
                                                                    </span>
                                                                  </span>
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <span style={{ fontSize: '15px' }}>
                                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                                      <span data-custom-class="body_text">
                                        <span
                                          style={{
                                            color: 'rgb(89, 89, 89)',
                                            fontSize: '15px'
                                          }}
                                        >
                                          <span style={{ fontSize: '15px' }}>
                                            <span
                                              style={{
                                                color: 'rgb(89, 89, 89)'
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    '15px'
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      'rgb(89, 89, 89)'
                                                                  }}
                                                                >
                                                                  <span
                                                                    style={{
                                                                      fontSize:
                                                                        '15px'
                                                                    }}
                                                                  >
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          'rgb(89, 89, 89)'
                                                                      }}
                                                                    >
                                                                      <span
                                                                        style={{
                                                                          fontSize:
                                                                            '15px'
                                                                        }}
                                                                      >
                                                                        <span
                                                                          style={{
                                                                            color:
                                                                              'rgb(89, 89, 89)'
                                                                          }}
                                                                        >
                                                                          <span
                                                                            style={{
                                                                              fontSize:
                                                                                '15px'
                                                                            }}
                                                                          >
                                                                            <span
                                                                              style={{
                                                                                color:
                                                                                  'rgb(89, 89, 89)'
                                                                              }}
                                                                            >
                                                                              <span
                                                                                style={{
                                                                                  fontSize:
                                                                                    '15px'
                                                                                }}
                                                                              >
                                                                                <span
                                                                                  style={{
                                                                                    color:
                                                                                      'rgb(89, 89, 89)'
                                                                                  }}
                                                                                >
                                                                                  <span
                                                                                    style={{
                                                                                      fontSize:
                                                                                        '15px'
                                                                                    }}
                                                                                  >
                                                                                    <span
                                                                                      style={{
                                                                                        color:
                                                                                          'rgb(89, 89, 89)'
                                                                                      }}
                                                                                    >
                                                                                      <span
                                                                                        style={{
                                                                                          fontSize:
                                                                                            '15px'
                                                                                        }}
                                                                                      >
                                                                                        <span
                                                                                          style={{
                                                                                            color:
                                                                                              'rgb(89, 89, 89)'
                                                                                          }}
                                                                                        >
                                                                                          <span
                                                                                            style={{
                                                                                              fontSize:
                                                                                                '15px'
                                                                                            }}
                                                                                          >
                                                                                            <span
                                                                                              style={{
                                                                                                color:
                                                                                                  'rgb(89, 89, 89)'
                                                                                              }}
                                                                                            >
                                                                                              <span
                                                                                                style={{
                                                                                                  color:
                                                                                                    'rgb(89, 89, 89)',
                                                                                                  fontSize:
                                                                                                    '15px'
                                                                                                }}
                                                                                              >
                                                                                                <span data-custom-class="body_text">
                                                                                                  <bdt className="statement-end-if-in-editor" />
                                                                                                </span>
                                                                                              </span>
                                                                                            </span>
                                                                                          </span>
                                                                                        </span>
                                                                                      </span>
                                                                                    </span>
                                                                                  </span>
                                                                                </span>
                                                                              </span>
                                                                            </span>
                                                                          </span>
                                                                        </span>
                                                                      </span>
                                                                    </span>
                                                                  </span>
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                <br />
              </p>
              <p id="infoshare" style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(0, 0, 0)' }}>
                  <strong>
                    <span style={{ fontSize: '19px' }}>
                      <span data-custom-class="heading_1">
                        3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
                      </span>
                    </span>
                  </strong>
                </span>
              </p>
              <p style={{ fontSize: '15px' }}>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <em>
                      <span style={{ fontSize: '15px' }}>
                        <span data-custom-class="body_text">In Short:</span>
                      </span>{' '}
                    </em>{' '}
                  </strong>
                  <span style={{ fontSize: '15px' }}>
                    <em>
                      <span data-custom-class="body_text">
                        We only share information with your consent, to comply
                        with laws, to provide you with services, to protect your
                        rights, or to fulfill business obligations.
                      </span>
                    </em>
                  </span>
                </span>
              </p>
              <div>
                <span style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}>
                  <span data-custom-class="body_text">
                    We may process or share data based on the following legal
                    basis:
                  </span>
                </span>
              </div>
              <ul>
                <li>
                  <span data-custom-class="body_text">
                    <span
                      style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}
                    >
                      <strong>Consent:</strong> We may process your data if you
                      have given us specific consent to use your personal
                      information in a specific purpose.
                    </span>
                    <br />
                    <br />
                  </span>
                </li>
                <li>
                  <span data-custom-class="body_text">
                    <span
                      style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}
                    >
                      <strong>Legitimate Interests:</strong> We may process your
                      data when it is reasonably necessary to achieve our
                      legitimate business interests.
                    </span>
                    <br />
                    <br />
                  </span>
                </li>
                <li>
                  <span data-custom-class="body_text">
                    <span
                      style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}
                    >
                      <strong>Performance of a Contract: </strong>Where we have
                      entered into a contract with you, we may process your
                      personal information to fulfill the terms of our contract.
                    </span>
                    <br />
                    <br />
                  </span>
                </li>
                <li>
                  <span data-custom-class="body_text">
                    <span
                      style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}
                    >
                      <strong>Legal Obligations:</strong> We may disclose your
                      information where we are legally required to do so in
                      order to comply with applicable law, governmental
                      requests, a judicial proceeding, court order, or legal
                      process, such as in response to a court order or a
                      subpoena (including in response to public authorities to
                      meet national security or law enforcement requirements).
                    </span>
                    <br />
                    <br />
                  </span>
                </li>
                <li>
                  <span style={{ color: 'rgb(89, 89, 89)', fontSize: '15px' }}>
                    <span data-custom-class="body_text">
                      <strong>Vital Interests:</strong> We may disclose your
                      information where we believe it is necessary to
                      investigate, prevent, or take action regarding potential
                      violations of our policies, suspected fraud, situations
                      involving potential threats to the safety of any person
                      and illegal activities, or as evidence in litigation in
                      which we are involved.
                    </span>
                  </span>
                </li>
              </ul>
              <p style={{ fontSize: '15px' }}>
                <span style={{ fontSize: '15px' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span data-custom-class="body_text">
                      More specifically, we may need to process your data or
                      share your personal information in the following
                      situations:
                    </span>
                    <span data-custom-class="body_text">
                      <bdt className="block-component" />
                    </span>
                  </span>
                </span>
              </p>
              <ul>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <strong>
                        <span data-custom-class="body_text">
                          Vendors, Consultants and Other Third-Party Service
                          Providers.
                        </span>
                      </strong>
                      <span data-custom-class="body_text">
                        {' '}
                        We may share your data with third party vendors, service
                        providers, contractors or agents who perform services
                        for us or on our behalf and require access to such
                        information to do that work. Examples include: payment
                        processing, data analysis, email delivery, hosting
                        services, customer service and marketing efforts. We may
                        allow selected third parties to use tracking technology
                        on the <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" />, which will enable
                        them to collect data about how you interact with the{' '}
                        <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" /> over time. This
                        information may be used to, among other things, analyze
                        and track data, determine the popularity of certain
                        content and better understand online activity. Unless
                        described in this Policy, we do not share, sell, rent or
                        trade any of your information with third parties for
                        their promotional purposes.{' '}
                        <bdt className="block-component" />
                        We have contracts in place with our data processors.
                        This means that they cannot do anything with your
                        personal information unless we have instructed them to
                        do it. They will not share your personal information
                        with any organisation apart from us. They will hold it
                        securely and retain it for the period we instruct.
                        <span style={{ fontSize: '15px' }}>
                          <span style={{ color: 'rgb(89, 89, 89)' }}>
                            <span data-custom-class="body_text">
                              <bdt className="statement-end-if-in-editor" />
                            </span>
                          </span>
                        </span>
                      </span>
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ color: 'rgb(89, 89, 89)' }}>
                          <span data-custom-class="body_text">
                            <bdt className="statement-end-if-in-editor" />
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                  <br />
                  <br />
                </li>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <strong>
                        <span data-custom-class="body_text">
                          Business Transfers.
                        </span>
                      </strong>
                      <span data-custom-class="body_text">
                        {' '}
                        We may share or transfer your information in connection
                        with, or during negotiations of, any merger, sale of
                        company assets, financing, or acquisition of all or a
                        portion of our business to another company.
                        <bdt className="block-component" />
                        <bdt className="block-component" />
                      </span>
                    </span>
                  </span>
                  <bdt className="block-component" />
                  <span data-custom-class="body_text">
                    <bdt className="block-component" />
                  </span>
                  <br />
                  <br />
                </li>
                <li>
                  <span style={{ fontSize: '15px' }}>
                    <span style={{ color: 'rgb(89, 89, 89)' }}>
                      <strong>
                        <span data-custom-class="body_text">Other Users.</span>
                      </strong>
                      <span data-custom-class="body_text">
                        {' '}
                        When you share personal information{' '}
                        <bdt className="block-component" />
                        (for example, by posting comments, contributions or
                        other content to the <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" />){' '}
                        <bdt className="statement-end-if-in-editor" />
                        or otherwise interact with public areas of the{' '}
                        <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" />, such personal
                        information may be viewed by all users and may be
                        publicly distributed outside the{' '}
                        <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" /> in perpetuity.{' '}
                        <bdt className="block-component" />
                        If you interact with other users of our{' '}
                        <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" /> and register through
                        a social network (such as Facebook), your contacts on
                        the social network will see your name, profile photo,
                        and descriptions of your activity.{' '}
                        <bdt className="statement-end-if-in-editor" />
                        Similarly, other users will be able to view descriptions
                        of your activity, communicate with you within our{' '}
                        <bdt className="block-component" />
                        Services
                        <bdt className="statement-end-if-in-editor" />
                        <bdt className="block-component" />
                        <bdt className="block-component" />, and view your
                        profile.
                      </span>
                      <span style={{ fontSize: '15px' }}>
                        <span data-custom-class="body_text">
                          <bdt className="statement-end-if-in-editor" />
                          <bdt className="block-component" />
                        </span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>
              <div>
                <bdt className="block-component">
                  <span data-custom-class="body_text" />
                </bdt>
                <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                  <br />
                </p>
                <p id="whoshare" style={{ fontSize: '15px' }}>
                  <span style={{ color: 'rgb(0, 0, 0)' }}>
                    <strong>
                      <span style={{ fontSize: '19px' }}>
                        <span data-custom-class="heading_1">
                          4. WHO WILL YOUR INFORMATION BE SHARED WITH?
                        </span>
                      </span>
                    </strong>
                  </span>
                </p>
              </div>
              <div>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <strong>
                    <em>
                      <span style={{ fontSize: '15px' }}>
                        <span data-custom-class="body_text">In Short:</span>
                      </span>{' '}
                    </em>{' '}
                  </strong>
                  <span style={{ fontSize: '15px' }}>
                    <em>
                      <span data-custom-class="body_text">
                        We only share information with the following third
                        parties.
                      </span>
                    </em>
                  </span>
                </span>
              </div>
              <div>
                <span style={{ color: 'rgb(89, 89, 89)' }}>
                  <span style={{ fontSize: '15px' }}> </span>{' '}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '15px' }}>
                  <span style={{ color: 'rgb(89, 89, 89)' }}>
                    <span data-custom-class="body_text">
                      We only share and disclose your information with the
                      following third parties. We have categorized each party so
                      that you may be easily understand the purpose of our data
                      collection and processing practices. If we have processed
                      your data based on your consent and you wish to revoke
                      your consent, please contact us.
                    </span>
                  </span>
                </span>
              </div>
              <div>
                <bdt className="block-component">
                  <span data-custom-class="body_text" />
                </bdt>
                <div>
                  <bdt className="block-component">
                    <span data-custom-class="body_text" />
                  </bdt>
                  <div>
                    <bdt className="block-component">
                      <span data-custom-class="body_text" />
                    </bdt>
                    <div>
                      <bdt className="block-component">
                        <span data-custom-class="body_text" />
                      </bdt>
                    </div>
                    <ul>
                      <li>
                        <span style={{ fontSize: '15px' }}>
                          <span style={{ color: 'rgb(89, 89, 89)' }}>
                            <span data-custom-class="body_text">
                              <strong>Cloud Computing Services</strong>
                            </span>
                          </span>
                        </span>
                        <br />
                        <span style={{ fontSize: '15px' }}>
                          <span style={{ color: 'rgb(89, 89, 89)' }}>
                            <bdt className="forloop-component">
                              <span data-custom-class="body_text" />
                            </bdt>
                            <span data-custom-class="body_text">
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <bdt className="block-component" />
                                  <bdt className="question">
                                    Amazon Web Services (AWS)
                                  </bdt>
                                  <bdt className="block-component" />
                                </span>
                              </span>
                            </span>
                          </span>
                          <bdt className="forloop-component" />
                        </span>
                        <span data-custom-class="body_text">
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <bdt className="block-component" />
                            </span>
                          </span>{' '}
                          and{' '}
                          <bdt className="question">Google Cloud Platform</bdt>
                          <span style={{ fontSize: '15px' }}>
                            <span style={{ color: 'rgb(89, 89, 89)' }}>
                              <span style={{ fontSize: '15px' }}>
                                <span style={{ color: 'rgb(89, 89, 89)' }}>
                                  <bdt className="statement-end-if-in-editor" />
                                </span>
                              </span>
                            </span>
                          </span>
                          <bdt className="forloop-component" />
                          <bdt className="statement-end-if-in-editor" />
                        </span>
                      </li>
                    </ul>
                    <div>
                      <bdt className="block-component">
                        <span data-custom-class="body_text" />
                      </bdt>
                      <div>
                        <bdt className="block-component">
                          <span data-custom-class="body_text" />
                        </bdt>
                        <div>
                          <bdt className="block-component">
                            <span data-custom-class="body_text" />
                          </bdt>
                          <div>
                            <bdt className="block-component">
                              <span data-custom-class="body_text" />
                            </bdt>
                            <div>
                              <bdt className="block-component">
                                <span data-custom-class="body_text" />
                              </bdt>
                              <div>
                                <bdt className="block-component">
                                  <span data-custom-class="body_text" />
                                </bdt>
                                <div>
                                  <bdt className="block-component">
                                    <span data-custom-class="body_text" />
                                  </bdt>
                                  <div>
                                    <bdt className="block-component">
                                      <span data-custom-class="body_text" />
                                    </bdt>
                                    <div>
                                      <bdt className="block-component">
                                        <span data-custom-class="body_text" />
                                      </bdt>
                                      <div>
                                        <bdt className="block-component">
                                          <span data-custom-class="body_text" />
                                        </bdt>
                                        <div>
                                          <bdt className="block-component">
                                            <span data-custom-class="body_text" />
                                          </bdt>
                                          <div>
                                            <bdt className="block-component">
                                              <span data-custom-class="body_text" />
                                            </bdt>
                                            <div>
                                              <bdt className="block-component">
                                                <span data-custom-class="body_text" />
                                              </bdt>
                                              <div>
                                                <span data-custom-class="body_text" />
                                                <span data-custom-class="body_text" />
                                                <span data-custom-class="body_text" />
                                                <span data-custom-class="body_text" />
                                                <span data-custom-class="body_text" />
                                                <span data-custom-class="body_text">
                                                  <bdt className="statement-end-if-in-editor" />
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <bdt className="block-component">
                                                            <span data-custom-class="heading_1" />
                                                          </bdt>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <p style={{ fontSize: '15px' }}>
                                                <br />
                                              </p>
                                              <div>
                                                <span
                                                  id="cookies"
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        5. DO WE USE COOKIES AND
                                                        OTHER TRACKING
                                                        TECHNOLOGIES?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </div>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        We may use cookies and
                                                        other tracking
                                                        technologies to collect
                                                        and store your
                                                        information.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    We may use cookies and
                                                    similar tracking
                                                    technologies (like web
                                                    beacons and pixels) to
                                                    access or store information.
                                                    Specific information about
                                                    how we use such technologies
                                                    and how you can refuse
                                                    certain cookies is set out
                                                    in our Cookie Policy
                                                    <bdt className="block-component" />
                                                    .
                                                  </span>
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)',
                                                      fontSize: '15px'
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            fontSize: '15px'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span data-custom-class="body_text">
                                                              <bdt className="statement-end-if-in-editor" />
                                                            </span>
                                                          </span>
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span data-custom-class="body_text">
                                                              <bdt className="block-component" />
                                                              <bdt className="block-component" />
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="sociallogins"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        6. HOW DO WE HANDLE YOUR
                                                        SOCIAL LOGINS?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        If you choose to
                                                        register or log in to
                                                        our services using a
                                                        social media account, we
                                                        may have access to
                                                        certain information
                                                        about you.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      Our{' '}
                                                      <bdt className="block-component" />
                                                      Services
                                                      <bdt className="statement-end-if-in-editor" />
                                                      <bdt className="block-component" />
                                                      <bdt className="block-component" />{' '}
                                                      offer you the ability to
                                                      register and login using
                                                      your third party social
                                                      media account details
                                                      (like your Facebook or
                                                      Twitter logins). Where you
                                                      choose to do this, we will
                                                      receive certain profile
                                                      information about you from
                                                      your social media
                                                      provider. The profile
                                                      Information we receive may
                                                      vary depending on the
                                                      social media provider
                                                      concerned, but will often
                                                      include your name, e-mail
                                                      address, friends list,
                                                      profile picture as well as
                                                      other information you
                                                      choose to make public.{' '}
                                                      <bdt className="block-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    We will use the information
                                                    we receive only for the
                                                    purposes that are described
                                                    in this{' '}
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        <bdt className="block-component" />
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span data-custom-class="body_text">
                                                            privacy policy
                                                          </span>
                                                        </span>
                                                        <bdt className="statement-end-if-in-editor" />
                                                      </span>{' '}
                                                    </span>
                                                    or that are otherwise made
                                                    clear to you on the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    . Please note that we do not
                                                    control, and are not
                                                    responsible for, other uses
                                                    of your personal information
                                                    by your third party social
                                                    media provider. We recommend
                                                    that you review their
                                                    privacy policy to understand
                                                    how they collect, use and
                                                    share your personal
                                                    information, and how you can
                                                    set your privacy preferences
                                                    on their sites and apps.
                                                  </span>
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)',
                                                      fontSize: '15px'
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        color:
                                                          'rgb(89, 89, 89)',
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)',
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            fontSize: '15px'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                fontSize: '15px'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  color:
                                                                    'rgb(89, 89, 89)'
                                                                }}
                                                              >
                                                                <span data-custom-class="body_text">
                                                                  <bdt className="statement-end-if-in-editor" />
                                                                </span>
                                                                <bdt className="block-component">
                                                                  <span data-custom-class="body_text" />
                                                                </bdt>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="intltransfers"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        7. IS YOUR INFORMATION
                                                        TRANSFERRED
                                                        INTERNATIONALLY?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        We may transfer, store,
                                                        and process your
                                                        information in countries
                                                        other than your own.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      Our servers are located in
                                                      <bdt className="forloop-component" />
                                                      <bdt className="block-component" />{' '}
                                                      <bdt className="question">
                                                        United States
                                                      </bdt>
                                                      <bdt className="block-component" />
                                                      <bdt className="forloop-component" />
                                                      . If you are accessing our{' '}
                                                      <bdt className="block-component" />
                                                      Services
                                                      <bdt className="statement-end-if-in-editor" />
                                                      <bdt className="block-component" />
                                                      <bdt className="block-component" />{' '}
                                                      from outside
                                                      <bdt className="forloop-component" />
                                                      <bdt className="block-component" />{' '}
                                                      <bdt className="question">
                                                        United States
                                                      </bdt>
                                                      <bdt className="block-component" />
                                                      <bdt className="forloop-component" />
                                                      , please be aware that
                                                      your information may be
                                                      transferred to, stored,
                                                      and processed by us in our
                                                      facilities and by those
                                                      third parties with whom we
                                                      may share your personal
                                                      information (see "
                                                    </span>
                                                  </span>
                                                </span>
                                                <span data-custom-class="body_text">
                                                  <a
                                                    data-custom-class="link"
                                                    href="#infoshare"
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        WILL YOUR INFORMATION BE
                                                        SHARED WITH ANYONE?
                                                      </span>
                                                    </span>
                                                  </a>
                                                </span>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      " above), in
                                                      <bdt className="forloop-component" />{' '}
                                                      <bdt className="question">
                                                        United States
                                                      </bdt>
                                                      ,
                                                      <bdt className="forloop-component" />{' '}
                                                      and other countries.
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      If you are a resident in
                                                      the European Economic
                                                      Area, then these countries
                                                      may not have data
                                                      protection or other laws
                                                      as comprehensive as those
                                                      in your country. We will
                                                      however take all necessary
                                                      measures to protect your
                                                      personal information in
                                                      accordance with this{' '}
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <bdt className="block-component" />
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span data-custom-class="body_text">
                                                              privacy policy
                                                            </span>
                                                          </span>
                                                          <bdt className="statement-end-if-in-editor" />
                                                        </span>{' '}
                                                      </span>
                                                      and applicable law.
                                                      <bdt className="block-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                                <bdt className="block-component" />
                                                <bdt className="block-component" />{' '}
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)',
                                                      fontSize: '15px'
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        color:
                                                          'rgb(89, 89, 89)',
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)',
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            fontSize: '15px'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                fontSize: '15px'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  color:
                                                                    'rgb(89, 89, 89)'
                                                                }}
                                                              >
                                                                <span data-custom-class="body_text">
                                                                  <bdt className="statement-end-if-in-editor" />
                                                                  <bdt className="block-component" />
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="inforetain"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        8. HOW LONG DO WE KEEP
                                                        YOUR INFORMATION?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        We keep your information
                                                        for as long as necessary
                                                        to fulfill the purposes
                                                        outlined in this{' '}
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span data-custom-class="body_text">
                                                            <bdt className="block-component" />
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span data-custom-class="body_text">
                                                                privacy policy
                                                              </span>
                                                            </span>
                                                            <bdt className="statement-end-if-in-editor" />
                                                          </span>{' '}
                                                        </span>
                                                        unless otherwise
                                                        required by law.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      We will only keep your
                                                      personal information for
                                                      as long as it is necessary
                                                      for the purposes set out
                                                      in this{' '}
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <bdt className="block-component" />
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span data-custom-class="body_text">
                                                              privacy policy
                                                            </span>
                                                          </span>
                                                          <bdt className="statement-end-if-in-editor" />
                                                        </span>
                                                      </span>
                                                      , unless a longer
                                                      retention period is
                                                      required or permitted by
                                                      law (such as tax,
                                                      accounting or other legal
                                                      requirements). No purpose
                                                      in this policy will
                                                      require us keeping your
                                                      personal information for
                                                      longer than{' '}
                                                      <bdt className="block-component" />
                                                      <bdt className="question">
                                                        the period of time in
                                                        which users have an
                                                        account with us
                                                      </bdt>
                                                      <bdt className="else-block" />
                                                      .
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    When we have no ongoing
                                                    legitimate business need to
                                                    process your personal
                                                    information, we will either
                                                    delete or anonymize it, or,
                                                    if this is not possible (for
                                                    example, because your
                                                    personal information has
                                                    been stored in backup
                                                    archives), then we will
                                                    securely store your personal
                                                    information and isolate it
                                                    from any further processing
                                                    until deletion is possible.
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <bdt className="block-component" />
                                                </span>
                                              </p>
                                              <div
                                                style={{ lineHeight: '1.5' }}
                                              >
                                                <br />
                                              </div>
                                              <p
                                                id="infosafe"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        9. HOW DO WE KEEP YOUR
                                                        INFORMATION SAFE?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        We aim to protect your
                                                        personal information
                                                        through a system of
                                                        organizational and
                                                        technical security
                                                        measures.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    We have implemented
                                                    appropriate technical and
                                                    organizational security
                                                    measures designed to protect
                                                    the security of any personal
                                                    information we process.
                                                    However, please also
                                                    remember that we cannot
                                                    guarantee that the internet
                                                    itself is 100% secure.
                                                    Although we will do our best
                                                    to protect your personal
                                                    information, transmission of
                                                    personal information to and
                                                    from our{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />{' '}
                                                    is at your own risk. You
                                                    should only access the
                                                    services within a secure
                                                    environment.
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <bdt className="statement-end-if-in-editor" />
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    <bdt className="block-component" />
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="infominors"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        10. DO WE COLLECT
                                                        INFORMATION FROM MINORS?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        We do not knowingly
                                                        collect data from or
                                                        market to children under
                                                        18 years of age.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    We do not knowingly solicit
                                                    data from or market to
                                                    children under 18 years of
                                                    age. By using the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    , you represent that you are
                                                    at least 18 or that you are
                                                    the parent or guardian of
                                                    such a minor and consent to
                                                    such minor dependent’s use
                                                    of the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    . If we learn that personal
                                                    information from users less
                                                    than 18 years of age has
                                                    been collected, we will
                                                    deactivate the account and
                                                    take reasonable measures to
                                                    promptly delete such data
                                                    from our records. If you
                                                    become aware of any data we
                                                    have collected from children
                                                    under age 18, please contact
                                                    us at{' '}
                                                    <bdt className="block-component" />
                                                    <bdt className="question">
                                                      douglasnaphas@gmail.com
                                                    </bdt>
                                                    <bdt className="statement-end-if-in-editor" />
                                                    .
                                                  </span>
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)',
                                                      fontSize: '15px'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <bdt className="statement-end-if-in-editor" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="privacyrights"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        11. WHAT ARE YOUR
                                                        PRIVACY RIGHTS?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <em>
                                                        <bdt className="block-component" />
                                                        In some regions, such as
                                                        the European Economic
                                                        Area, you have rights
                                                        that allow you greater
                                                        access to and control
                                                        over your personal
                                                        information.{' '}
                                                        <bdt className="statement-end-if-in-editor" />
                                                        You may review, change,
                                                        or terminate your
                                                        account at any time.
                                                      </em>
                                                    </span>
                                                    <bdt className="block-component">
                                                      <span data-custom-class="body_text" />
                                                    </bdt>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      In some regions (like the
                                                      European Economic Area),
                                                      you have certain rights
                                                      under applicable data
                                                      protection laws. These may
                                                      include the right (i) to
                                                      request access and obtain
                                                      a copy of your personal
                                                      information, (ii) to
                                                      request rectification or
                                                      erasure; (iii) to restrict
                                                      the processing of your
                                                      personal information; and
                                                      (iv) if applicable, to
                                                      data portability. In
                                                      certain circumstances, you
                                                      may also have the right to
                                                      object to the processing
                                                      of your personal
                                                      information. To make such
                                                      a request, please use the
                                                    </span>
                                                  </span>{' '}
                                                </span>
                                                <span data-custom-class="body_text">
                                                  <a
                                                    data-custom-class="link"
                                                    href="#contact"
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(48, 48, 241)'
                                                        }}
                                                      >
                                                        contact details
                                                      </span>
                                                    </span>
                                                  </a>
                                                </span>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      {' '}
                                                      provided below. We will
                                                      consider and act upon any
                                                      request in accordance with
                                                      applicable data protection
                                                      laws.
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      If we are relying on your
                                                      consent to process your
                                                      personal information, you
                                                      have the right to withdraw
                                                      your consent at any time.
                                                      Please note however that
                                                      this will not affect the
                                                      lawfulness of the
                                                      processing before its
                                                      withdrawal.
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            fontSize: '15px'
                                                          }}
                                                        >
                                                          <bdt className="statement-end-if-in-editor" />
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      If you are resident in the
                                                      European Economic Area and
                                                      you believe we are
                                                      unlawfully processing your
                                                      personal information, you
                                                      also have the right to
                                                      complain to your local
                                                      data protection
                                                      supervisory authority. You
                                                      can find their contact
                                                      details here:
                                                    </span>
                                                  </span>{' '}
                                                </span>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{
                                                      color: 'rgb(48, 48, 241)'
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <a
                                                        data-custom-class="link"
                                                        href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
                                                      </a>
                                                      .
                                                    </span>
                                                  </span>
                                                </span>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <bdt className="block-component">
                                                      <span data-custom-class="body_text" />
                                                    </bdt>
                                                    <bdt className="block-component" />
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      If you have questions or
                                                      comments about your
                                                      privacy rights, you may
                                                      email us at{' '}
                                                      <bdt className="question">
                                                        admin@passover.lol
                                                      </bdt>
                                                      .
                                                    </span>
                                                    <bdt className="statement-end-if-in-editor" />
                                                  </span>
                                                </span>
                                              </p>
                                              <div
                                                style={{ lineHeight: '1.1' }}
                                              >
                                                <br />
                                              </div>
                                              <div>
                                                <span
                                                  style={{ fontSize: '16px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(0, 0, 0)'
                                                    }}
                                                  >
                                                    <strong>
                                                      <span data-custom-class="heading_2">
                                                        Account Information
                                                      </span>
                                                    </strong>
                                                  </span>
                                                </span>
                                              </div>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      If you would at any time
                                                      like to review or change
                                                      the information in your
                                                      account or terminate your
                                                      account, you can:
                                                      <bdt className="forloop-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                {' '}
                                                ■{' '}
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <bdt className="question">
                                                        Contact us using the
                                                        contact information
                                                        provided.
                                                      </bdt>{' '}
                                                      <bdt className="forloop-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      Upon your request to
                                                      terminate your account, we
                                                      will deactivate or delete
                                                      your account and
                                                      information from our
                                                      active databases. However,
                                                      some information may be
                                                      retained in our files to
                                                      prevent fraud,
                                                      troubleshoot problems,
                                                      assist with any
                                                      investigations, enforce
                                                      our Terms of Use and/or
                                                      comply with legal
                                                      requirements.
                                                    </span>
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <bdt className="statement-end-if-in-editor" />
                                                              <bdt className="block-component" />
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <strong>
                                                      <u>
                                                        <span data-custom-class="body_text">
                                                          Cookies and similar
                                                          technologies:
                                                        </span>
                                                      </u>{' '}
                                                    </strong>
                                                    <span data-custom-class="body_text">
                                                      Most Web browsers are set
                                                      to accept cookies by
                                                      default. If you prefer,
                                                      you can usually choose to
                                                      set your browser to remove
                                                      cookies and to reject
                                                      cookies. If you choose to
                                                      remove cookies or reject
                                                      cookies, this could affect
                                                      certain features or
                                                      services of our{' '}
                                                      <bdt className="block-component" />
                                                      Services
                                                      <bdt className="statement-end-if-in-editor" />
                                                      <bdt className="block-component" />
                                                      <bdt className="block-component" />
                                                      . To opt-out of
                                                      interest-based advertising
                                                      by advertisers on our{' '}
                                                      <bdt className="block-component" />
                                                      Services
                                                      <bdt className="statement-end-if-in-editor" />
                                                      <bdt className="block-component" />
                                                    </span>
                                                    <span data-custom-class="body_text">
                                                      <bdt className="block-component" />{' '}
                                                      visit
                                                    </span>
                                                  </span>{' '}
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(48, 48, 241)'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    <a
                                                      data-custom-class="link"
                                                      href="http://www.aboutads.info/choices/"
                                                      rel="noopener noreferrer"
                                                      target="_blank"
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        http://www.aboutads.info/choices/
                                                      </span>
                                                    </a>
                                                  </span>
                                                </span>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      .{' '}
                                                      <bdt className="block-component" />
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <span
                                                                style={{
                                                                  fontSize:
                                                                    '15px'
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    color:
                                                                      'rgb(89, 89, 89)'
                                                                  }}
                                                                >
                                                                  <bdt className="statement-end-if-in-editor" />
                                                                </span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                    <span data-custom-class="body_text">
                                                      <bdt className="block-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <strong>
                                                      <u>
                                                        <span data-custom-class="body_text">
                                                          Opting out of email
                                                          marketing:
                                                        </span>
                                                      </u>{' '}
                                                    </strong>
                                                    <span data-custom-class="body_text">
                                                      You can unsubscribe from
                                                      our marketing email list
                                                      at any time by clicking on
                                                      the unsubscribe link in
                                                      the emails that we send or
                                                      by contacting us using the
                                                      details provided below.
                                                      You will then be removed
                                                      from the marketing email
                                                      list – however, we will
                                                      still need to send you
                                                      service-related emails
                                                      that are necessary for the
                                                      administration and use of
                                                      your account. To otherwise
                                                      opt-out, you may:
                                                      <bdt className="forloop-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                {' '}
                                                ■{' '}
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  {' '}
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <bdt className="question">
                                                        Contact us using the
                                                        contact information
                                                        provided.
                                                      </bdt>{' '}
                                                      <bdt className="forloop-component" />
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <span
                                                            style={{
                                                              fontSize: '15px'
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                fontSize: '15px'
                                                              }}
                                                            >
                                                              <bdt className="statement-end-if-in-editor">
                                                                <bdt className="block-component" />
                                                              </bdt>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <br />
                                              </p>
                                              <p
                                                id="databreach"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <strong>
                                                  <span
                                                    data-custom-class="heading_1"
                                                    style={{ fontSize: '19px' }}
                                                  >
                                                    12. DATA BREACH
                                                  </span>
                                                </strong>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  data-custom-class="body_text"
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  A privacy breach occurs when
                                                  there is unauthorized access
                                                  to or collection, use,
                                                  disclosure or disposal of
                                                  personal information. You will
                                                  be notified about data
                                                  breaches when{' '}
                                                  <bdt className="question">
                                                    Very Awesome Passover
                                                  </bdt>{' '}
                                                  believes you are likely to be
                                                  at risk or serious harm. For
                                                  example, a data breach may be
                                                  likely to result in serious
                                                  financial harm or harm to your
                                                  mental or physical well-being.
                                                  In the event that{' '}
                                                  <bdt className="question">
                                                    Very Awesome Passover
                                                  </bdt>{' '}
                                                  becomes aware of a security
                                                  breach which has resulted or
                                                  may result in unauthorized
                                                  access, use or disclosure of
                                                  personal information{' '}
                                                  <bdt className="question">
                                                    Very Awesome Passover
                                                  </bdt>{' '}
                                                  will promptly investigate the
                                                  matter and notify the
                                                  applicable Supervisory
                                                  Authority not later than 72
                                                  hours after having become
                                                  aware of it, unless the
                                                  personal data breach is
                                                  unlikely to result in a risk
                                                  to the rights and freedoms of
                                                  natural persons.
                                                </span>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <bdt className="statement-end-if-in-editor">
                                                            <bdt className="statement-end-if-in-editor" />
                                                          </bdt>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <br />
                                              </p>
                                              <p
                                                id="DNT"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        13. CONTROLS FOR
                                                        DO-NOT-TRACK FEATURES
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      Most web browsers and some
                                                      mobile operating systems
                                                      and mobile applications
                                                      include a Do-Not-Track
                                                      (“DNT”) feature or setting
                                                      you can activate to signal
                                                      your privacy preference
                                                      not to have data about
                                                      your online browsing
                                                      activities monitored and
                                                      collected. No uniform
                                                      technology standard for
                                                      recognizing and
                                                      implementing DNT signals
                                                      has been finalized. As
                                                      such, we do not currently
                                                      respond to DNT browser
                                                      signals or any other
                                                      mechanism that
                                                      automatically communicates
                                                      your choice not to be
                                                      tracked online. If a
                                                      standard for online
                                                      tracking is adopted that
                                                      we must follow in the
                                                      future, we will inform you
                                                      about that practice in a
                                                      revised version of this{' '}
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          <bdt className="block-component" />
                                                          <span
                                                            style={{
                                                              color:
                                                                'rgb(89, 89, 89)'
                                                            }}
                                                          >
                                                            <span data-custom-class="body_text">
                                                              privacy policy
                                                            </span>
                                                          </span>
                                                          <bdt className="statement-end-if-in-editor" />
                                                        </span>
                                                      </span>
                                                      .
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <br />
                                              </p>
                                              <p
                                                id="caresidents"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        14. DO CALIFORNIA
                                                        RESIDENTS HAVE SPECIFIC
                                                        PRIVACY RIGHTS?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        Yes, if you are a
                                                        resident of California,
                                                        you are granted specific
                                                        rights regarding access
                                                        to your personal
                                                        information.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{ fontSize: '15px' }}
                                                >
                                                  <span
                                                    style={{
                                                      color: 'rgb(89, 89, 89)'
                                                    }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      California Civil Code
                                                      Section 1798.83, also
                                                      known as the “Shine The
                                                      Light” law, permits our
                                                      users who are California
                                                      residents to request and
                                                      obtain from us, once a
                                                      year and free of charge,
                                                      information about
                                                      categories of personal
                                                      information (if any) we
                                                      disclosed to third parties
                                                      for direct marketing
                                                      purposes and the names and
                                                      addresses of all third
                                                      parties with which we
                                                      shared personal
                                                      information in the
                                                      immediately preceding
                                                      calendar year. If you are
                                                      a California resident and
                                                      would like to make such a
                                                      request, please submit
                                                      your request in writing to
                                                      us using the contact
                                                      information provided
                                                      below.
                                                    </span>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    If you are under 18 years of
                                                    age, reside in California,
                                                    and have a registered
                                                    account with the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    , you have the right to
                                                    request removal of unwanted
                                                    data that you publicly post
                                                    on the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    . To request removal of such
                                                    data, please contact us
                                                    using the contact
                                                    information provided below,
                                                    and include the email
                                                    address associated with your
                                                    account and a statement that
                                                    you reside in California. We
                                                    will make sure the data is
                                                    not publicly displayed on
                                                    the{' '}
                                                    <bdt className="block-component" />
                                                    Services
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <bdt className="block-component" />
                                                    <bdt className="block-component" />
                                                    , but please be aware that
                                                    the data may not be
                                                    completely or
                                                    comprehensively removed from
                                                    our systems.
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="policyupdates"
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        15. DO WE MAKE UPDATES
                                                        TO THIS POLICY?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <strong>
                                                    <em>
                                                      <span
                                                        style={{
                                                          fontSize: '15px'
                                                        }}
                                                      >
                                                        <span data-custom-class="body_text">
                                                          In Short:
                                                        </span>
                                                      </span>{' '}
                                                    </em>{' '}
                                                  </strong>
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <em>
                                                      <span data-custom-class="body_text">
                                                        Yes, we will update this
                                                        policy as necessary to
                                                        stay compliant with
                                                        relevant laws.
                                                      </span>
                                                    </em>
                                                  </span>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    We may update this{' '}
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        <bdt className="block-component" />
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span data-custom-class="body_text">
                                                            privacy policy
                                                          </span>
                                                        </span>
                                                        <bdt className="statement-end-if-in-editor" />
                                                      </span>{' '}
                                                    </span>
                                                    from time to time. The
                                                    updated version will be
                                                    indicated by an updated
                                                    “Revised” date and the
                                                    updated version will be
                                                    effective as soon as it is
                                                    accessible. If we make
                                                    material changes to this{' '}
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        <bdt className="block-component" />
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span data-custom-class="body_text">
                                                            privacy policy
                                                          </span>
                                                        </span>
                                                        <bdt className="statement-end-if-in-editor" />
                                                      </span>
                                                    </span>
                                                    , we may notify you either
                                                    by prominently posting a
                                                    notice of such changes or by
                                                    directly sending you a
                                                    notification. We encourage
                                                    you to review this{' '}
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        <bdt className="block-component" />
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <span data-custom-class="body_text">
                                                            privacy policy
                                                          </span>
                                                        </span>
                                                        <bdt className="statement-end-if-in-editor" />
                                                      </span>{' '}
                                                    </span>
                                                    frequently to be informed of
                                                    how we are protecting your
                                                    information.
                                                  </span>
                                                </span>
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: '15px',
                                                  lineHeight: '1.5'
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <br />
                                                </span>
                                              </p>
                                              <p
                                                id="contact"
                                                style={{ fontSize: '15px' }}
                                              >
                                                <span
                                                  style={{
                                                    color: 'rgb(0, 0, 0)'
                                                  }}
                                                >
                                                  <strong>
                                                    <span
                                                      style={{
                                                        fontSize: '19px'
                                                      }}
                                                    >
                                                      <span data-custom-class="heading_1">
                                                        16. HOW CAN YOU CONTACT
                                                        US ABOUT THIS POLICY?
                                                      </span>
                                                    </span>
                                                  </strong>
                                                </span>
                                              </p>
                                              <p style={{ fontSize: '15px' }}>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    If you have questions or
                                                    comments about this policy,
                                                    you may{' '}
                                                    <bdt className="block-component" />
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    contact our Data Protection
                                                    Officer (DPO),{' '}
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    <bdt className="question">
                                                      Douglas Naphas
                                                    </bdt>
                                                    , by email at{' '}
                                                    <bdt className="question">
                                                      douglasnaphas@gmail.com
                                                    </bdt>
                                                  </span>
                                                </span>
                                                <span data-custom-class="body_text">
                                                  ,
                                                  <bdt className="block-component" />
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)',
                                                    fontSize: '15px'
                                                  }}
                                                >
                                                  <span data-custom-class="body_text">
                                                    <bdt className="else-block" />{' '}
                                                    or by post to:
                                                  </span>
                                                </span>
                                              </p>
                                              <div>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <bdt className="question">
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        Very Awesome Passover
                                                      </span>
                                                    </span>{' '}
                                                  </bdt>
                                                  <span data-custom-class="body_text">
                                                    <span
                                                      style={{
                                                        fontSize: '15px'
                                                      }}
                                                    >
                                                      <span data-custom-class="body_text">
                                                        <bdt className="block-component" />
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <bdt className="question">
                                                          Douglas Naphas
                                                        </bdt>
                                                        <bdt className="block-component" />
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <bdt className="question">
                                                          4614 Chester Ave
                                                        </bdt>
                                                        <bdt className="block-component" />
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <bdt className="question">
                                                          2nd Floor
                                                        </bdt>
                                                        <bdt className="statement-end-if-in-editor" />
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <bdt className="question">
                                                        Philadelphia
                                                      </bdt>
                                                      <bdt className="block-component" />
                                                      <bdt className="block-component" />
                                                      ,{' '}
                                                      <bdt className="question">
                                                        PA
                                                      </bdt>
                                                      <bdt className="statement-end-if-in-editor" />
                                                      <bdt className="block-component" />
                                                    </span>
                                                    <bdt className="block-component" />{' '}
                                                    <bdt className="question">
                                                      19143
                                                    </bdt>
                                                    <bdt className="statement-end-if-in-editor" />
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <bdt className="block-component" />{' '}
                                                        <bdt className="block-component" />
                                                        <bdt className="block-component" />
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <span data-custom-class="body_text">
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <bdt className="question">
                                                          United States
                                                        </bdt>
                                                      </span>
                                                    </span>
                                                    <span data-custom-class="body_text">
                                                      <span
                                                        style={{
                                                          color:
                                                            'rgb(89, 89, 89)'
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            color:
                                                              'rgb(89, 89, 89)'
                                                          }}
                                                        >
                                                          <bdt className="statement-end-if-in-editor" />
                                                        </span>
                                                        <bdt className="else-block">
                                                          <span data-custom-class="body_text">
                                                            <span
                                                              style={{
                                                                color:
                                                                  'rgb(89, 89, 89)'
                                                              }}
                                                            >
                                                              <bdt className="statement-end-if-in-editor" />
                                                            </span>
                                                          </span>
                                                        </bdt>
                                                      </span>
                                                    </span>
                                                    <span
                                                      style={{
                                                        color: 'rgb(89, 89, 89)'
                                                      }}
                                                    >
                                                      <bdt className="else-block" />
                                                      <bdt className="else-block" />
                                                    </span>
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    color: 'rgb(89, 89, 89)'
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontSize: '15px' }}
                                                  >
                                                    <span data-custom-class="body_text">
                                                      <bdt className="block-component" />
                                                    </span>
                                                  </span>
                                                </span>
                                              </div>
                                              <div>
                                                <br />
                                              </div>
                                              <div>
                                                <bdt className="block-component" />
                                              </div>
                                              <style
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    '\n      ul {\n        list-style-type: square;\n      }\n      ul > li > ul {\n        list-style-type: circle;\n      }\n      ul > li > ul > li > ul {\n        list-style-type: square;\n      }\n      ol li {\n        font-family: Arial ;\n      }\n    '
                                                }}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                padding: '16px 0 20px',
                                                background: 'transparent'
                                              }}
                                            >
                                              <h1
                                                style={{
                                                  fontFamily: 'Arial',
                                                  fontSize: '19px',
                                                  color: '#000000',
                                                  textTransform: 'uppercase'
                                                }}
                                              >
                                                How can you review, update, or
                                                delete the data we collect from
                                                you?
                                              </h1>
                                              <div
                                                style={{
                                                  color: '#595959',
                                                  fontSize: '14px',
                                                  fontFamily: 'Arial',
                                                  marginTop: '18px',
                                                  lineHeight: '1.2'
                                                }}
                                              >
                                                Based on the laws of some
                                                countries, you may have the
                                                right to request access to the
                                                personal information we collect
                                                from you, change that
                                                information, or delete it in
                                                some circumstances. To request
                                                to review, update, or delete
                                                your personal information,
                                                please submit a request by
                                                emailing{' '}
                                                <a
                                                  style={{
                                                    color:
                                                      'rgb(48, 48, 241) !important'
                                                  }}
                                                  href="mailto:admin@passover.lol"
                                                >
                                                  admin@passover.lol
                                                </a>
                                                . We will respond to your
                                                request within 30 days.
                                              </div>
                                            </div>
                                            <div
                                              style={{
                                                color: '#595959',
                                                fontSize: '14px',
                                                fontFamily: 'Arial',
                                                paddingTop: '16px'
                                              }}
                                            >
                                              This privacy policy was created
                                              using{' '}
                                              <a
                                                style={{
                                                  color:
                                                    'rgb(48, 48, 241) !important'
                                                }}
                                                href="https://termly.io/products/privacy-policy-generator/?ftseo"
                                              >
                                                Termly’s Privacy Policy
                                                Generator
                                              </a>
                                              .
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PrivacyPolicy);
