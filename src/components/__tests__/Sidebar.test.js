import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import Sidebar from '../Sidebar';

it('renders without crashing', () => {
  const bounties = [];
  const wrapper = render(<Sidebar bounties={bounties} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows each bounty as a ListItem', () => {
  const bounties = ['asdf', 'demo'];
  const wrapper = mount(<Sidebar bounties={bounties} />);
  expect(wrapper.find('.ListItem')).toHaveLength(2);
});

it('marks the selected row as .active',() => {
  const bounties = ['asdf', 'demo'];
  const wrapper = mount(<Sidebar bounties={bounties} />);
  wrapper.setState({selected: 1});

  expect(wrapper.find('.item-1').props().active).toBeTruthy();
  expect(wrapper.find('.item-0').props().active).toBeFalsy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('selects the row that was clicked',() => {
  const select = jest.fn();
  const bounties = ['asdf', 'demo'];
  const wrapper = mount(<Sidebar select={select} bounties={bounties} />);

  wrapper.find('.item-1').simulate('click');

  expect(select).toHaveBeenCalledWith(1);
  expect(wrapper.find('.item-1').props().active).toBeTruthy();
  expect(wrapper.find('.item-0').props().active).toBeFalsy();
});
//TODO bounty drawing tests.
