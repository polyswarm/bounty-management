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
  const accounts = [];
  const wrapper = render(<ModalPassword accounts={accounts}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('sets state open to true when open is called', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.open();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: true});
});

it('sets state open to false when close is called', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.close();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: false});
});

it('hides the Modal when closed', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  wrapper.setState({open: false});

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('shows the Modal when open', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('closes the modal on click outside the main content', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  wrapper.setState({open: true});

  wrapper.find('.ModalBackground').simulate('click');

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('calls accountSet with true when store is true', () => {
  const accountSet = jest.fn();
  const accounts = [];
  const wrapper = mount(
    <ModalPassword accounts={accounts}
      accountSet={accountSet} />
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onAccountSet();

  expect(accountSet).toHaveBeenCalledTimes(1);
  expect(accountSet).toHaveBeenCalledWith(true);
});

it('call accountSet with false when store is false', () => {
  const accountSet = jest.fn();
  const accounts = [];
  const wrapper = mount(
    <ModalPassword accounts={accounts}
      accountSet={accountSet} />
  );
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onAccountSet();

  expect(accountSet).toHaveBeenCalledTimes(1);
  expect(accountSet).toHaveBeenCalledWith(false);
});

it('it does not call upload when url not set', () => {
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} />);
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  expect(mockUnlockAccount).toHaveBeenCalledTimes(0);
});

it('shows given accounts as options in dropdown', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({store: false, open: true});

  expect(wrapper.find('option')).toHaveLength(3);
});

it('updates account when option is selected', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#address').simulate('change', {target:{value: 'asdf'}});

  expect(setState).toHaveBeenCalledWith({address:'asdf'});
});

it('updates the password when typed', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#password').simulate('change', {target:{value: 'asdf'}});

  expect(setState).toHaveBeenCalledWith({password:'asdf'});
});

it('updates store when checkbox is checked', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#store').simulate('change', {checked: true});

  expect(setState).toHaveBeenCalledWith({store:true});
});

it('updates store when checkbox is unchecked', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#store').simulate('change', {checked: false});

  expect(setState).toHaveBeenCalledWith({store:false});
});

it('shows error message when error is true', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true, error: true});

  expect(wrapper.find('.ModalError')).toHaveLength(1);
  expect(wrapper.find('.ModalError').text()).toEqual('Unabled to login. Check your password.');
});

it('does not show error message when error is false', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true, error: false});

  expect(wrapper.find('.ModalError').text()).toHaveLength(0);
});

it('closes the modal when Cancel is pressed', () => {
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword accounts={accounts}/>);
  wrapper.setState({open: true, error: false});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('.flat-cancel').simulate('click');

  expect(setState).toHaveBeenCalledWith({open: false});
});

it('starts unlocking when Unlock is pressed', () => {
  const url = 'https://localhost:8080';
  const accounts = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword url={url} accounts={accounts}/>);
  wrapper.setState({open: true, error: false});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('.Button').simulate('click');

  expect(setState).toHaveBeenCalledWith({unlocking: true, error: false});
});

it('does not call accountSet when store is false after unlocking', () => {
  const url = 'https://localhost:8080';
  const accountSet = jest.fn();
  const accounts = [];
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      accounts={accounts}
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
  const accounts = [];
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      accounts={accounts}
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
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} url={url}/>);
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

it('sets unlocking:true, error: false when unlock starts', () => {
  const url = 'https://localhost:8080';
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} url={url}/>);
  wrapper.setState({store: true});
  const setState = spyOn(ModalPassword.prototype, 'setState');
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  expect(setState).toHaveBeenCalledWith({unlocking: true, error: false});
});

it('sets unlocking:false, error:false when unlock succeeds', (done) => {
  const url = 'https://localhost:8080';
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} url={url}/>);
  wrapper.setState({store: true});
  const setState = spyOn(ModalPassword.prototype, 'setState');
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try{
      expect(setState).toHaveBeenCalledTimes(3);
      expect(setState.calls.argsFor(1)[0]).toEqual({unlocking: false, error: false});
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
  const accounts = [];
  const wrapper = mount(
    <ModalPassword accountSet={accountSet}
      accounts={accounts}
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

it('does not close when unlock fails', (done) => {
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
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockBadUnlock).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('sets unlocking:false, error:true when unlock fails', (done) => {
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
  const accounts = [];
  const wrapper = mount(<ModalPassword accounts={accounts} url={url}/>);
  wrapper.setState({store: true});
  const setState = spyOn(ModalPassword.prototype, 'setState');
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try{
      expect(setState).toHaveBeenCalledTimes(2);
      expect(setState.calls.argsFor(1)[0]).toEqual({unlocking: false, error: true});
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});
