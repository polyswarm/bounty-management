import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import Modal from '../Modal';

it('renders without crashing', () => {
  const wrapper = render(<Modal/>);

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('opens without crashing', () => {
  const wrapper = mount(<Modal />);
  wrapper.setState({open: true});
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('sets state open to true when open is called', () => {
  const wrapper = mount(<Modal/>);
  const instance = wrapper.instance();
  const setState = jest.spyOn(Modal.prototype, 'setState');

  instance.open();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: true});
});

it('sets state open to false when close is called', () => {
  const setState = jest.spyOn(Modal.prototype, 'setState');
  const wrapper = mount(<Modal />);
  const instance = wrapper.instance();
  setState.mockClear();

  instance.close();

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({open: false});
});

it('hides the Modal when closed', () => {
  const wrapper = mount(<Modal />);
  wrapper.setState({open: false});

  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('shows the Modal when open', () => {
  const wrapper = mount(<Modal />);
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('does not close the modal on click outside the main content', () => {
  const wrapper = mount(<Modal/>);
  wrapper.setState({open: true});

  wrapper.find('.ModalBackground').simulate('click');

  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('shows the property title', () => {
  const title = 'Title';
  const wrapper = mount(<Modal title={title}/>);
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalContentHeader')).toHaveLength(1);
  expect(wrapper.find('.ModalContentHeader').text()).toEqual('Title');
});

it('shows the property message', () => {
  const title = 'Title';
  const message = 'message';
  const wrapper = mount(<Modal
    title={title}
    message={message}/>
  );
  wrapper.setState({open: true});

  expect(wrapper.find('.ModalContent')).toHaveLength(1);
  expect(wrapper.find('.ModalContent').find('p').text()).toEqual('message');
});
