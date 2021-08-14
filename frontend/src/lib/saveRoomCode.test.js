import { saveRoomCode } from './saveRoomCode';
describe('lib/saveRoomCode', () => {
  test('should save a roomCode 1', () => {
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
    const roomCode = 'THISON';
    saveRoomCode(storage, roomCode, date);
    const expectedK = 'roomCode#' + date.now();
    const expectedV = roomCode;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
  test('should save a roomCode 2', () => {
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
    const roomCode = 'THATON';
    saveRoomCode(storage, roomCode, date);
    const expectedK = 'roomCode#' + date.now();
    const expectedV = roomCode;
    expect((setItemCalledWith[expectedK] = expectedV));
  });
});
