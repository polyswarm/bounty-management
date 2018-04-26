import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Welcome from '../Welcome';
import App from '../App';

it('renders without crashing', () => {
  const wrapper = render(<Welcome />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call onClick when button is clicked', () => {
  const onClick = jest.fn();
  const wrapper = mount(<Welcome onClick={onClick}/>);
  wrapper.setState({accepted: true});

  wrapper.find('button').simulate('click');

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('should close when button is clicked', () => {
  const wrapper = mount(<App />);
  wrapper.setState({first: true});

  expect(wrapper.find('.Welcome')).toHaveLength(1);

  wrapper.find('.Welcome').find('input').simulate('change', { target: { checked: true } });
  wrapper.find('.Welcome').find('button').simulate('click');

  expect(wrapper.find('.Welcome')).toHaveLength(0);
});

it('should change accepted to true when checked', () => {
  const setState = jest.spyOn(Welcome.prototype, 'setState');
  const wrapper = mount(<Welcome/>);

  wrapper.find('input').simulate('change', { target: { checked: true } });

  expect(setState).toHaveBeenCalledWith({accepted: true});
});

it('should change accept to false when unchecked', () => {
  const setState = jest.spyOn(Welcome.prototype, 'setState');
  const wrapper = mount(<Welcome/>);
  wrapper.setState({accepted: true});
  setState.mockClear();

  wrapper.find('input').simulate('change', { target: { checked: false } });

  expect(setState).toHaveBeenCalledWith({accepted: false});
});

it('should enable the button when accepted is true', () => {
  const wrapper = mount(<Welcome/>);
  wrapper.setState({accepted: true});

  expect(wrapper.find('button').props().disabled).toBeFalsy();
});

it('should disable the button when accepted is false', () => {
  const wrapper = mount(<Welcome/>);
  wrapper.setState({accepted: false});

  expect(wrapper.find('button').props().disabled).toBeTruthy();
});
