import { saveGameName } from './saveGameName';
describe('lib/saveGameName', () => {
  test('should save a gameName 1', () => {
    let setItemCalledWith;
    const storage = {
      setItem: (k, v) => {
        setItemCalledWith = {};
        setItemCalledWith[k] = v;
      }
    };
    const date = {
      now: () => 200
    };
    const gameName = 'the first player';
    saveGameName(storage, gameName, date);
    const expectedK = 'gameName#' + date.now();
    const expectedV = gameName;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
  test('should save a gameName 2', () => {
    let setItemCalledWith;
    const storage = {
      setItem: (k, v) => {
        setItemCalledWith = {};
        setItemCalledWith[k] = v;
      }
    };
    const date = {
      now: () => 1554090430963
    };
    const gameName = 'The Second Player';
    saveGameName(storage, gameName, date);
    const expectedK = 'gameName#' + date.now();
    const expectedV = gameName;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
});
