import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ModalPassword from '../ModalPassword';
import HttpAccount from '../ModalPassword/http';

const mockUnlockAccount = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(true);
  });
});

jest.mock('../ModalPassword/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      unlockAccount: mockUnlockAccount
    };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  HttpAccount.mockClear();
  mockUnlockAccount.mockClear();
});

it('renders without crashing', () => {
  const wrapper = render(<ModalPassword />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('sets state open to true when open is called', () => {
  const wrapper = mount(<ModalPassword />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.open();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: true});
});

it('sets state open to false when close is called', () => {
  const wrapper = mount(<ModalPassword />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.close();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: false});
});

it('hides the Modal when closed', () => {
  const wrapper = mount(<ModalPassword />);
  wrapper.setState({open: false});

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('shows the Modal when open', () => {
  const wrapper = mount(<ModalPassword />);
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('closes the modal on click outside the main content', () => {
  const wrapper = mount(<ModalPassword />);
  wrapper.setState({open: true});

  wrapper.find('.ModalBackground').simulate('click');

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('calls accountSet when store is true', () => {
  const accountSet = jest.fn();
  const wrapper = mount(<ModalPassword accountSet={accountSet} />);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onAccountSet();

  expect(accountSet).toHaveBeenCalledTimes(1);
});

it('does not call accountSet when store is false', () => {
  const accountSet = jest.fn();
  const wrapper = mount(<ModalPassword accountSet={accountSet} />);
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onAccountSet();

  expect(accountSet).toHaveBeenCalledTimes(0);
});

it('it does not call upload when url not set', () => {
  const wrapper = mount(<ModalPassword />);
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  expect(mockUnlockAccount).toHaveBeenCalledTimes(0);
});

it('does not call accountSet when store is false after unlocking', () => {
  const url = 'https://localhost:8080';
  const accountSet = jest.fn();
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      url={url}/>
  );
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  expect(accountSet).toHaveBeenCalledTimes(0);
  expect(mockUnlockAccount).toHaveBeenCalledTimes(1);
});

it('does call accountSet when store is true after unlocking', (done) => {
  const url = 'https://localhost:8080';
  const accountSet = jest.fn();
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockUnlockAccount).toHaveBeenCalledTimes(1);
      expect(accountSet).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('closes the modal when unlock succeeds', (done) => {
  const url = 'https://localhost:8080';
  const close = spyOn(ModalPassword.prototype, 'close');
  const wrapper = mount(<ModalPassword url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockUnlockAccount).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does not call accountSet when unlock fails', (done) => {
  const mockBadUnlock = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(false);
    });
  });
  HttpAccount.mockImplementation(() => {
    return {
      unlockAccount: mockBadUnlock,
    };
  });

  const url = 'https://localhost:8080';
  const accountSet = jest.fn();
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockBadUnlock).toHaveBeenCalledTimes(1);
      expect(accountSet).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does not close when unlock fails', () => {
  const mockBadUnlock = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(false);
    });
  });
  HttpAccount.mockImplementation(() => {
    return {
      unlockAccount: mockBadUnlock,
    };
  });
  const url = 'https://localhost:8080';
  const close = spyOn(ModalPassword.prototype, 'close');
  const wrapper = mount(<ModalPassword url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockBadUnlock).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});
