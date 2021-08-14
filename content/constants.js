const constants = {
  PAGE_MARKER: /^[#\s]*#[#\s]*{{\s*Page\s*([:]\s*(to|from) \s*youngest\s*)?}}\s*$/i,
  TO_YOUNGEST: /to \s*youngest/i,
  FROM_YOUNGEST: /from \s*youngest/i,
  LINE_MARKER: /[^\s]/,
  H1_MARKER: /^\s*#\s+(?=[^s])/,
  H1_TYPE: "h1",
  DEFAULT_LINE_TYPE: "p",
};
module.exports = constants;
