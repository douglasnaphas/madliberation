const C = require('../constants');
const fs = require('fs');
const script2json = class {
  /**
   * Read plaintext pseudo-Markdown Mad Liberation script scriptFile, return a
   * JSON String of the script usable by mljsapi.
   */
  static parseFile(scriptFile) {
    // return fs.readFileSync(scriptFile, 'utf8');
    return JSON.stringify(this.parse(fs.readFileSync(scriptFile, 'utf8')));
  }

  static parseLine(line) {
    const LINE_MARKER = /[^\s]/;
    const INDENT_MARKER = /^    (?=[^\s])/;
    const INDENT_TYPE = 'indent';
    const H1_MARKER = /^\s*#\s+(?=[^s])/;
    const H1_TYPE = 'h1';
    const H2_MARKER = /^\s*##\s+(?=[^s])/;
    const H2_TYPE = 'h2';
    const H3_MARKER = /^\s*###\s+(?=[^s])/;
    const H3_TYPE = 'h3';
    const H4_MARKER = /^\s*####\s+(?=[^s])/;
    const H4_TYPE = 'h4';
    const H5_MARKER = /^\s*#####\s+(?=[^s])/;
    const H5_TYPE = 'h5';
    const H6_MARKER = /^\s*######\s+(?=[^s])/;
    const H6_TYPE = 'h6';
    const STAGE_DIRECTION_REGEX = /^\s*[[][[][^\]]+[\]][\]]\s*$/;
    const STAGE_DIRECTION_TYPE = 'stageDirection';
    const DEFAULT_LINE_TYPE = 'p';

    function* segmentGenerator(str) {
      const nonLibRegex = /^.+?(?={{)/;
      const libRegex = /^{{.*?}}/;
      const libAnywhwere = /{{.*}}/;
      const libSplitRegex = /[/][/]/;
      let segText, seg;
      while (str.length > 0) {
        if (!libAnywhwere.test(str)) {
          return { type: 'text', text: str };
        }
        if (nonLibRegex.test(str) && !libRegex.test(str)) {
          segText = str.match(nonLibRegex)[0];
          str = str.replace(nonLibRegex, '');
          seg = { type: 'text', text: segText };
        } else if (libRegex.test(str)) {
          segText = str
            .match(libRegex)[0]
            .replace(/{{/, '')
            .replace(/}}/, '');
          str = str.replace(libRegex, '');
          let lib = segText.split(libSplitRegex);
          seg = {
            type: 'lib',
            prompt: lib[0] && lib[0].trim(),
            example: lib[1] && lib[1].trim(),
            sentence: lib[2] && lib[2].trim(),
            default: lib[3] && lib[3].trim()
          };
        }
        if (str.length == 0) return seg;
        yield seg;
      }
    }

    let parsedLine = {};

    // figure out the type
    if (INDENT_MARKER.test(line)) {
      parsedLine.type = INDENT_TYPE;
      line = line.replace(INDENT_MARKER, '');
    } else if (C.H1_MARKER.test(line)) {
      parsedLine.type = C.H1_TYPE;
      line = line.replace(C.H1_MARKER, '');
    } else if (H2_MARKER.test(line)) {
      parsedLine.type = H2_TYPE;
      line = line.replace(H2_MARKER, '');
    } else if (H3_MARKER.test(line)) {
      parsedLine.type = H3_TYPE;
      line = line.replace(H3_MARKER, '');
    } else if (H4_MARKER.test(line)) {
      parsedLine.type = H4_TYPE;
      line = line.replace(H4_MARKER, '');
    } else if (H5_MARKER.test(line)) {
      parsedLine.type = H5_TYPE;
      line = line.replace(H5_MARKER, '');
    } else if (H6_MARKER.test(line)) {
      parsedLine.type = H6_TYPE;
      line = line.replace(H6_MARKER, '');
    } else if (STAGE_DIRECTION_REGEX.test(line)) {
      parsedLine.type = STAGE_DIRECTION_TYPE;
      line = line
        .replace(/[[][[]/, '')
        .replace(/]]/, '')
        .trim();
    } else {
      parsedLine.type = C.DEFAULT_LINE_TYPE;
    }

    // add the segments
    const segGen = segmentGenerator(line);
    const segments = [];
    let segment = { done: false };
    let done = false;
    while (!segment.done) {
      segment = segGen.next();
      segments.push(segment.value);
    }
    parsedLine.segments = segments;

    return parsedLine;
  }

  /**
   * Read String script (a Mad Liberation pseudo-Markdown script), return an
   * object representing the script that, when printed as JSON, will be usable
   * by mljsapi.
   */
  static parse(scriptText) {
    const script = {};
    script.pages = [];
    const lines = scriptText.split(/\n|\r\n/);
    let thisPage;
    let theseLines;
    let parsedLine;
    lines.forEach(line => {
      if (C.PAGE_MARKER.test(line)) {
        if (thisPage) {
          thisPage.lines = theseLines;
          script.pages.push(thisPage);
          thisPage = false;
        }
        thisPage = {};
        if (C.FROM_YOUNGEST.test(line)) {
          thisPage.youngest = 'from';
        }
        if (C.TO_YOUNGEST.test(line)) {
          thisPage.youngest = 'to';
        }
        theseLines = [];
      } else if (C.LINE_MARKER.test(line)) {
        parsedLine = this.parseLine(line);
        if (parsedLine) {
          theseLines.push(parsedLine);
        }
      }
    });
    if (thisPage) {
      thisPage.lines = theseLines;
      script.pages.push(thisPage);
    }
    return script;
  }
};
module.exports = script2json;
