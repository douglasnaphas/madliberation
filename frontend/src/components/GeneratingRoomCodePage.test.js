import { createMount } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { Configs } from '../Configs';
import GeneratingRoomCodePage from './GeneratingRoomCodePage';

let mount;

beforeEach(() => {
  mount = createMount();
});
afterEach(() => {
  mount.cleanUp();
});

describe('GeneratingRoomCodePageWithRouter', () => {
  test('should display a spinner before fetch returns', done => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalled();
    const expectedTypography = (
      <Typography variant="h3">Generating a Room Code...</Typography>
    );
    expect(wrapper.find(CircularProgress).exists()).toBe(true);
    expect(
      wrapper.findWhere(n => n.matchesElement(expectedTypography)).exists()
    ).toBe(true);
    process.nextTick(() => {
      global.fetch.mockClear();
      done();
    });
  });
  test('should fetch /room-code, user present', done => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
          user={{
            email: 'mrseff@f.com',
            nickname: 'Mrs. F',
            sub: 'vnf8da-fjasd-44farqeio'
          }}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      new URL('/room-code', Configs.apiUrl()),
      {
        method: 'POST',
        body: JSON.stringify({
          path: chosenPath,
          user: 'vnf8da-fjasd-44farqeio'
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }
    );
    process.nextTick(() => {
      global.fetch.mockClear();
      done();
    });
  });
  test('should fetch /room-code, no user present', done => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      new URL('/room-code', Configs.apiUrl()),
      {
        method: 'POST',
        body: JSON.stringify({
          path: chosenPath
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    );
    process.nextTick(() => {
      global.fetch.mockClear();
      done();
    });
  });
  test('should set confirmedRoomCode on successful fetch', done => {
    const mockSuccessResponse = { roomCode: 'SUCCES' };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith('SUCCES');
      global.fetch.mockClear();
      done();
    });
  });
  test('should set confirmedRoomCode on successful fetch 2', done => {
    const mockSuccessResponse = { roomCode: 'SECOND' };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith('SECOND');
      global.fetch.mockClear();
      done();
    });
  });
  test('should push onto history', done => {
    const mockSuccessResponse = { roomCode: 'HISTOR' };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledWith('/your-room-code');
      global.fetch.mockClear();
      done();
    });
  });
  test('chosenPath should be hydrated if not supplied, but present in storage, user present', done => {
    const mockSuccessResponse = { roomCode: 'LOCALS' };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = undefined;
    const spy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        return 'script/path/from/storage';
      });

    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
          user={{
            nickname: 'God of Fun',
            email: 'sumslummy@raw.raw',
            sub: 'fj32x-fsa'
          }}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      new URL('/room-code', Configs.apiUrl()), // deviations here are not failing the tests
      {
        method: 'POST',
        body: JSON.stringify({
          path: 'script/path/from/storage',
          user: 'fj32x-fsa'
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }
    );
    Storage.prototype.getItem.mockClear();
    process.nextTick(() => {
      global.fetch.mockClear();
      done();
    });
  });
  test('chosenPath not received or in localStorage', done => {
    done();
  });
  test('fetch resolves to failed response -- should display error message', done => {
    const mockJsonPromise = Promise.resolve({ error: 'there was an error' });
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: false
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn()
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = 'a/b/c';
    const wrapper = mount(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      wrapper.update();
      const expectedFailureMessage1 = (
        <Typography variant="h5">
          So sorry, but a Room Code could not be generated. Please start over by
          clicking{' '}
          <Link
            madliberationid="room-code-error-pick-script-link"
            to="/pick-script"
          >
            here
          </Link>
          , or refreshing the page.
        </Typography>
      );
      const expectedFailureMessage2 = (
        <Typography variant="h5">
          If this keeps happening, try a different browser or device.
        </Typography>
      );
      expect(
        wrapper
          .findWhere(n => n.matchesElement(expectedFailureMessage1))
          .exists()
      ).toBe(true);
      expect(
        wrapper
          .findWhere(n => n.matchesElement(expectedFailureMessage2))
          .exists()
      ).toBe(true);
      global.fetch.mockClear();
      done();
    });
  });
  test('should fetch with user=<user sub> in body if there is a logged-in user', () => {}); // this can now be covered in the earlier tests
  test(
    'should show a "try logging in again" message if a logged-in ' +
      'request fails for identity reasons, with option to not be logged in',
    () => {}
  );
});
