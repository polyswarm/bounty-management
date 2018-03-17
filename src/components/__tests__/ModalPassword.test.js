import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ModalPassword from '../ModalPassword';

beforeEach(() => {
  jest.clearAllMocks();
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
