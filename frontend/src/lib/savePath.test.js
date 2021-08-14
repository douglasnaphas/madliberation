import { savePath } from './savePath';
describe('lib/savePath', () => {
  test('should save a path 1', () => {
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
    const path = 'madliberation-scripts/004-Practice_Script';
    savePath(storage, path, date);
    const expectedK = 'path#' + date.now();
    const expectedV = path;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
  test('should save a path 2', () => {
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
    const path = 'madliberation-scripts/006-Unwritten_Script';
    savePath(storage, path, date);
    const expectedK = 'path#' + date.now();
    const expectedV = path;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
});
