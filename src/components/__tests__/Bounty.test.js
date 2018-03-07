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
  Http.mockClear();
  mockUploadFiles.mockClear();
  mockUploadBounty.mockClear();
});

it('renders without crashing', () => {
  const wrapper = render(<BountyCreate />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
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

it('calls uploadFiles when all parameters are met (files, trackBounty, url)', () => {
  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  wrapper.find('.Bounty-Create-Upload').simulate('click');

  // assert
  expect(mockUploadFiles).toHaveBeenCalledTimes(1);
});

it('doesn\'t call uploadFiles when parameters are missing', () => {
  const wrapper = mount(<BountyCreate />);

  // act
  wrapper.find('.Bounty-Create-Upload').simulate('click');
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

  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  wrapper.find('.Bounty-Create-Upload').simulate('click');

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

  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  wrapper.find('.Bounty-Create-Upload').simulate('click');

  // assert
  setTimeout(() => {
    try {
      expect(mockUploadBounty).toHaveBeenCalledWith(10, ['demo', 'asdf'], 300);
      expect(mockUploadBounty).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('calls trackBounty when upload bounty is a success', (done) => {
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

  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files});

  // act
  wrapper.find('.Bounty-Create-Upload').simulate('click');

  // assert
  setTimeout(() => {
    try {
      expect(trackBounty).toHaveBeenCalledWith('asdf');
      expect(trackBounty).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('sets uploading to false when uploads complete', (done) => {
  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});
  const setStateMock = jest.spyOn(BountyCreate.prototype, 'setState');

  wrapper.find('.Bounty-Create-Upload').simulate('click');

  // assert
  setTimeout(() => {
    try {
      expect(setStateMock).toHaveBeenCalledWith({uploading: true});
      expect(setStateMock).toHaveBeenLastCalledWith({uploading: false});
      expect(setStateMock).toHaveBeenCalledTimes(2);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('has uploading true after clicking create button', () => {
  const trackBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'asdf'}
      trackBounty={trackBounty}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});
  const setStateMock = jest.spyOn(BountyCreate.prototype, 'setState');

  wrapper.find('.Bounty-Create-Upload').simulate('click');

  expect(setStateMock).toHaveBeenCalledWith({uploading: true});
});

it('disables button when uploading', () => {
  const wrapper = mount(<BountyCreate url={'url'}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: true});

  expect(wrapper.find('.Bounty-Create-Upload').props().disabled).toBeTruthy();
});

it('disables button when there is no supplied url', () => {
  const wrapper = mount(<BountyCreate />);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false});

  expect(wrapper.find('.Bounty-Create-Upload').props().disabled).toBeTruthy();
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
