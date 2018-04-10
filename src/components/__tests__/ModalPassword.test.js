import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import ModalPassword from '../ModalPassword';
import HttpAccount from '../ModalPassword/http';

const mockUnlockWallet = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(true);
  });
});

const mockCreateWallet = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(true);
  });
});

const mockGetEth = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(1200000000000000000);
  });
});

const mockGetNct = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(1200000000000000000);
  });
});

jest.mock('../ModalPassword/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      unlockWallet: mockUnlockWallet,
      createWallet: mockCreateWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
    };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  HttpAccount.mockClear();
  mockUnlockWallet.mockClear();
  mockCreateWallet.mockClear();

  HttpAccount.mockImplementation(() => {
    return {
      unlockWallet: mockUnlockWallet,
      createWallet: mockCreateWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
    };
  });
});

it('renders without crashing', () => {
  const walletList = [];
  const wrapper = render(<ModalPassword walletList={walletList}/>);

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('opens without crashing', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true});
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('opens with some wallets without crashing', () => {
  const walletList = ['asdf', 'demo'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true});
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('sets state open to true when open is called', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.open();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: true});
});

it('sets state open to false and password empty when close is called', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  const instance = wrapper.instance();
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');

  instance.close();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: false, password: ''});
});

it('hides the Modal when closed', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  wrapper.setState({open: false});

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('shows the Modal when open', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('closes the modal on click outside the main content', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  wrapper.setState({open: true});

  wrapper.find('.ModalBackground').simulate('click');

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('hides the select when wallet list is empty', () => {
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  wrapper.setState({open: true});

  expect(wrapper.find('select')).toHaveLength(0);
});

it('shows the select when wallet list is not empty', () => {
  const walletList = ['asdf'];
  const wrapper = mount(<ModalPassword walletList={walletList} />);
  wrapper.setState({open: true});

  expect(wrapper.find('select')).toHaveLength(1);
});

it('calls onWalletChange with true when store is true', () => {
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword walletList={walletList}
      onWalletChange={onWalletChange} />
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onWalletChangeHandler();

  expect(onWalletChange).toHaveBeenCalledTimes(1);
  expect(onWalletChange).toHaveBeenCalledWith(true);
});

it('call onWalletChange with false when store is false', () => {
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword walletList={walletList}
      onWalletChange={onWalletChange} />
  );
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onWalletChangeHandler();

  expect(onWalletChange).toHaveBeenCalledTimes(1);
  expect(onWalletChange).toHaveBeenCalledWith(false);
});

it('shows given walletList as options in dropdown', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({store: false, open: true});

  expect(wrapper.find('option')).toHaveLength(3);
});

it('updates account when option is selected', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#address').simulate('change', {target:{value: 'demo'}});

  expect(setState).toHaveBeenCalledWith({address:1});
});

it('updates the password when typed', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#password').simulate('change', {target:{value: 'asdf'}});

  expect(setState).toHaveBeenCalledWith({password:'asdf'});
});

it('shows error message when error is true', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true, error: true});

  expect(wrapper.find('.ModalError')).toHaveLength(1);
  expect(wrapper.find('.ModalError').text()).toEqual('Unabled to login. Check your password.');
});

it('does not show error message when error is false', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true, error: false});

  expect(wrapper.find('.ModalError').text()).toHaveLength(0);
});

it('closes the modal and clears password when Cancel is pressed', () => {
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword walletList={walletList}/>);
  wrapper.setState({open: true, error: false});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('.flat-cancel').simulate('click');

  expect(setState).toHaveBeenCalledWith({open: false, password: ''});
});

it('starts unlocking when Unlock is pressed with wallets', () => {
  const url = 'https://localhost:8080';
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('.flat').simulate('click');

  expect(setState).toHaveBeenCalledWith({unlocking: true, error: false});
});

it('tries to unlock when enter is pressed inside the text field with wallets', () => {
  const onUnlockClick = jest.spyOn(ModalPassword.prototype, 'onUnlockClick');
  const url = 'https://localhost:8080';
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false});
  onUnlockClick.mockClear();

  wrapper.find('#password').simulate('keypress', {key: 'Enter'});

  expect(onUnlockClick).toHaveBeenCalledTimes(1);
});

it('tries to create when enter is pressed inside the password field without wallets', () => {
  const onUnlockClick = jest.spyOn(ModalPassword.prototype, 'onUnlockClick');
  const url = 'https://localhost:8080';
  const walletList = [];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false});
  onUnlockClick.mockClear();

  wrapper.find('#password').simulate('keypress', {key: 'Enter'});

  expect(onUnlockClick).toHaveBeenCalledTimes(1);
});

it('does not call onUnlockAccount when a key other than enter is pressed', () => {
  const onUnlockClick = jest.spyOn(ModalPassword.prototype, 'onUnlockClick');
  const url = 'https://localhost:8080';
  const walletList = [];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false});
  onUnlockClick.mockClear();

  wrapper.find('#password').simulate('keypress', {key: 'Shift'});

  expect(onUnlockClick).toHaveBeenCalledTimes(0);
});

it('unlocks with the values entered in the state for unlockWallet', () => {
  const onUnlock = jest.spyOn(ModalPassword.prototype, 'onUnlock');
  const url = 'https://localhost:8080';
  const walletList = ['asdf','demo','omed'];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false, password: 'password'});

  onUnlock.mockClear();

  wrapper.find('.flat').simulate('click');

  expect(onUnlock).toHaveBeenCalledWith('asdf', 'password');
});

it('creates with the values entered in the state for unlockWallet', () => {
  const createWallet = jest.spyOn(ModalPassword.prototype, 'createWallet');
  const url = 'https://localhost:8080';
  const walletList = [];
  const wrapper = mount(<ModalPassword url={url} walletList={walletList}/>);
  wrapper.setState({open: true, error: false, password: 'password', address:'address'});
  createWallet.mockClear();

  wrapper.find('.flat').simulate('click');

  expect(createWallet).toHaveBeenCalledWith('password');
});

it('does call onWalletChange with false when store is false after unlocking', (done) => {
  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(onWalletChange).toHaveBeenCalledTimes(1);
      expect(mockUnlockWallet).toHaveBeenCalledTimes(1);
      done();
    } catch(error) {
      done.fail(error);
    }
  },0);
});

it('does call onWalletChange when store is true after unlocking', (done) => {
  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockUnlockWallet).toHaveBeenCalledTimes(1);
      expect(onWalletChange).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('closes the modal when unlock succeeds', (done) => {
  const url = 'https://localhost:8080';
  const close = jest.spyOn(ModalPassword.prototype, 'close');
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockUnlockWallet).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
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
      unlockWallet: mockBadUnlock,
    };
  });
  const url = 'https://localhost:8080';
  const close = jest.spyOn(ModalPassword.prototype, 'close');
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
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

it('sets unlocking:true, error: false when unlock starts', () => {
  const url = 'https://localhost:8080';
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  expect(setState).toHaveBeenCalledWith({unlocking: true, error: false});
});

it('sets unlocking:false, error:false when unlock succeeds', (done) => {
  const url = 'https://localhost:8080';
  const walletList = ['asdf'];
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  setState.mockClear();
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try{
      expect(setState.mock.calls[3][0]).toEqual({unlocking: false, error: false});
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does not call onWalletChange when unlock fails', (done) => {
  const mockBadUnlock = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(false);
    });
  });
  HttpAccount.mockImplementation(() => {
    return {
      unlockWallet: mockBadUnlock,
    };
  });

  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.onUnlock('address', 'password');

  setTimeout(() => {
    try {
      expect(mockBadUnlock).toHaveBeenCalledTimes(1);
      expect(onWalletChange).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does call onWalletChange with false when store is false after creating', (done) => {
  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: false});
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try {
      expect(onWalletChange).toHaveBeenCalledTimes(1);
      expect(mockCreateWallet).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail();
    }
  });
});

it('does call onWalletChange when store is true after create', (done) => {
  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try {
      expect(mockCreateWallet).toHaveBeenCalledTimes(1);
      expect(onWalletChange).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('closes the modal when create succeeds', (done) => {
  const url = 'https://localhost:8080';
  const close = jest.spyOn(ModalPassword.prototype, 'close');
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try {
      expect(mockCreateWallet).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does not close when create fails', (done) => {
  const mockBadCreate = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(false);
    });
  });
  HttpAccount.mockImplementation(() => {
    return {
      createWallet: mockBadCreate,
    };
  });
  const url = 'https://localhost:8080';
  const close = jest.spyOn(ModalPassword.prototype, 'close');
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try {
      expect(mockBadCreate).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('sets unlocking:true, error: false when create starts', () => {
  const url = 'https://localhost:8080';
  const walletList = [];
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  const instance = wrapper.instance();

  instance.createWallet('password');

  expect(setState).toHaveBeenCalledWith({unlocking: true, error: false});
});

it('sets unlocking:false, error:false when create succeeds', (done) => {
  const url = 'https://localhost:8080';
  const walletList = [];
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  const wrapper = mount(<ModalPassword walletList={walletList} url={url}/>);
  wrapper.setState({store: true});
  setState.mockClear();
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try{
      expect(setState.mock.calls[1][0]).toEqual({unlocking: false, error: false});
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('does not call onWalletChange when create fails', (done) => {
  const mockBadCreate = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(false);
    });
  });
  HttpAccount.mockImplementation(() => {
    return {
      createWallet: mockBadCreate,
    };
  });

  const url = 'https://localhost:8080';
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <ModalPassword onWalletChange={onWalletChange}
      walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: true});
  const instance = wrapper.instance();

  instance.createWallet('password');

  setTimeout(() => {
    try {
      expect(mockBadCreate).toHaveBeenCalledTimes(1);
      expect(onWalletChange).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('sets eth & nct to 1.2 when getETh/getNct succeed', (done) => {
  const url = 'https://localhost:8080';
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  const walletList = [];
  const wrapper = mount(
    <ModalPassword walletList={walletList}
      url={url}/>
  );
  wrapper.setState({store: true});
  setState.mockClear();
  const instance = wrapper.instance();

  instance.updateBalance('address');

  setTimeout(() => {
    try {
      expect(mockGetEth).toHaveBeenCalledTimes(1);
      expect(mockGetNct).toHaveBeenCalledTimes(1);
      expect(setState.mock.calls[0][0]).toEqual({eth: 1.2});
      expect(setState.mock.calls[1][0]).toEqual({nct: 1.2});
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});
