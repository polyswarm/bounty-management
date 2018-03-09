import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import ListItem from '../ListItem';

it('renders without crashing', () => {
  const item = 'asdf';
  const wrapper = render(<ListItem item={item} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the mock function when I click close', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = mount(<ListItem item={item} remove={remove} />);
  wrapper.find('.ListItem').simulate('mouseEnter');
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
});

it('shows remove button when hovered', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = mount(<ListItem item={item} remove={remove} />);
  wrapper.find('.ListItem').simulate('mouseEnter');
  expect(wrapper.find('button')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('adds the active class when active property is true', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = render(<ListItem item={item} remove={remove} active/>);
  expect(wrapper.hasClass('active')).toBeTruthy();
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
