const C = require('./constants');
describe('PAGE_MARKER', () => {
  test('Should match variations of # {{page}}', () => {
    const good = [
      '# {{page}}',
      '# {{ page }}',
      '# {{ PAGE}}',
      '# {{page: to youngest}}',
      '#    {{ Page: From Youngest }}'
    ].forEach(s => {
      expect(C.PAGE_MARKER.test(s)).toBeTruthy();
    });
  });
});
