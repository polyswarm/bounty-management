import React from 'react';
import {shallow, render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyCreate from '../BountyCreate';
import Http from '../BountyCreate/http';

const mockUploadFiles = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

const mockUploadBounty = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

jest.mock('../BountyCreate/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  Http.mockClear();
  mockUploadFiles.mockClear();
  mockUploadBounty.mockClear();
});

it('renders without crashing', () => {
  const wrapper = render(<BountyCreate />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('deletes the index 0 when onFileRemoved called', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(0);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'omed'}]);
});

it('deletes the file at index when onFileRemoved called', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(1);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'demo'}]);
});

it('deletes all files when onClearAll is called', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onClearAll();

  expect(instance.state.files).toHaveLength(0);
  expect(instance.state.files).toEqual([]);
});

it('doesn\'t delete the file at index when out of bounds', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(1000);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t delete the file at index when negative', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(-1);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t throw with an empty file array when onFileRemoved called', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();

  //act
  instance.onFileRemoved(0);
});

it('stores additional files in state.files', () => {
  const wrapper = shallow(<BountyCreate />);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onMultipleFilesSelected([{name: 'asdf'}]);
  expect(instance.state.files).toHaveLength(3);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}, {name: 'asdf'}]);
});

it('calls uploadFiles when all parameters are met (files, addBounty, url)', () => {
  const addBounty = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty();

  // assert
  expect(mockUploadFiles).toHaveBeenCalledTimes(1);
});

it('doesn\'t call uploadFiles when parameters are missing', () => {
  const wrapper = mount(<BountyCreate />);
  const instance = wrapper.instance();

  // act
  instance.createBounty();
  // assert
  expect(mockUploadFiles).toHaveBeenCalledTimes(0);
});

it('doesn\'t call uploadBounty when uploadFiles fails', () => {
  const mockBadUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      reject();
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockBadUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty();

  // assert
  expect(mockUploadBounty).toHaveBeenCalledTimes(0);
});

it('calls uploadBounty when uploadFiles succeeds', (done) => {
  const mockGoodUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(['demo', 'asdf']);
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockGoodUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {

    // assert
      try {
        expect(mockUploadBounty).toHaveBeenCalledWith('62500000000000000', ['demo', 'asdf'], 300);
        expect(mockUploadBounty).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls addBounty when upload bounty is a success', (done) => {
  const mockGoodUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(['demo', 'asdf']);
    });
  });
  const mockGoodUploadBounty = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve('asdf');
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockGoodUploadFiles,
      uploadBounty: mockGoodUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {
    // assert
      try {
        expect(addBounty).toHaveBeenCalledWith('asdf');
        expect(addBounty).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('sets errors to null when uploads complete', (done) => {
  const addBounty = jest.fn();
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      onWalletChange={onWalletChange}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});
  const setStateMock = jest.spyOn(BountyCreate.prototype, 'setState');

  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(setStateMock).toHaveBeenLastCalledWith({error: null, files: []});
        expect(setStateMock).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('has uploading true after calling createBounty', (done) => {
  const setState = jest.spyOn(BountyCreate.prototype, 'setState');
  const addBounty = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});
  setState.mockClear();

  // act
  instance.createBounty().then(() => {

  // assert
    try {
      expect(setState.mock.calls[0][0]).toEqual({error: null, files:[]});
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('disables button when there are no files', () => {
  const wrapper = mount(<BountyCreate url={'url'}/>);
  const files = [
  ];
  wrapper.setState({files: files, uploading: false});

  expect(wrapper.find('.Bounty-Create-Upload').props().disabled).toBeTruthy();
});

it('enables button when there are files, a url and not uploading ', () => {
  const wrapper = mount(<BountyCreate url={'url'}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});
  expect(wrapper.find('.Bounty-Create-Upload').props().disabled).toBeFalsy();
});

it('shows the error when state has an error', () => {
  const wrapper = mount(<BountyCreate url={'url'}/>);
  wrapper.setState({error: 'Error'});

  expect(wrapper.find('.Bounty-Create-Error').props().children).toBe('Error');
});

it('opens the modal if isUnlocked not set on create click', () => {
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      onWalletChange={onWalletChange}
      walletList={walletList}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});

  wrapper.find('.Bounty-Create-Upload').simulate('click');

  expect(wrapper.find('.ModalContent')).toHaveLength(1);
});

it('calls create after modal is successfully closed & returns unlocked', () => {
  const createBounty = jest.spyOn(BountyCreate.prototype, 'createBounty');
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      onWalletChange={onWalletChange}
      walletList={walletList}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});
  const instance = wrapper.instance();

  instance.onWalletChangeHandler(true, false);

  expect(createBounty).toHaveBeenCalledTimes(1);
});

it('calls onWalletChange when modal closed and password checked', () => {
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      onWalletChange={onWalletChange}
      walletList={walletList}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});
  const instance = wrapper.instance();

  instance.onWalletChangeHandler(true, true);

  expect(onWalletChange).toHaveBeenCalledTimes(1);
  expect(onWalletChange).toHaveBeenCalledWith(true);
});

it('calls onWalletChange when modal closed and password not checked', () => {
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      onWalletChange={onWalletChange}
      walletList={walletList}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});
  const instance = wrapper.instance();

  instance.onWalletChangeHandler(false, false);

  expect(onWalletChange).toHaveBeenCalledTimes(1);
  expect(onWalletChange).toHaveBeenCalledWith(false);
});

it('calls onWalletChange with false when upload bounty returns 401', (done) => {
  const mockBadUploadBounty = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401,
      };
      reject(error);
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      uploadBounty: mockBadUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const onWalletChange = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      onWalletChange={onWalletChange}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {
      // assert
      try {
        expect(onWalletChange).toHaveBeenCalledTimes(1);
        expect(onWalletChange).toHaveBeenCalledWith(false);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls on error when something goes wrong in the upload', (done) => {
  const mockBadUploadBounty = jest.fn().mockImplementation(() => {
    return new Promise(() => {
      throw Error('Failed.');
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      uploadBounty: mockBadUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const onWalletChange = jest.fn();
  const onError = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      onWalletChange={onWalletChange}
      addBounty={addBounty}
      onError={onError}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {

    // assert
      try {
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith('Failed.');
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('should call addCreateBountyRequest and removeCreateBountyRequest in createBounty', (done) => {
  const addCreateBountyRequest = jest.spyOn(BountyCreate.prototype, 'addCreateBountyRequest');
  const removeCreateBountyRequest = jest.spyOn(BountyCreate.prototype, 'removeCreateBountyRequest');
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(addCreateBountyRequest).toHaveBeenCalledTimes(1);
        expect(removeCreateBountyRequest).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('should call addRequest and removeRequest in createBounty', (done) => {
  const addRequest = jest.fn();
  const removeRequest = jest.fn();
  const walletList = [];
  const wrapper = mount(
    <BountyCreate url={'url'}
      walletList={walletList}
      addRequest={addRequest}
      removeRequest={removeRequest}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(addRequest).toHaveBeenCalledTimes(1);
        expect(removeRequest).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});