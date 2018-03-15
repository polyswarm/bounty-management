import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import Sidebar from '../Sidebar';
import App from '../App';

it('renders without crashing', () => {
  const bounties = [];
  const wrapper = render(<Sidebar bounties={bounties} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows each bounty as a ListItem', () => {
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const wrapper = mount(<Sidebar bounties={bounties} />);
  expect(wrapper.find('.ListItem')).toHaveLength(2);
});

it('marks the selected row as .active',() => {
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const wrapper = mount(<Sidebar bounties={bounties} active={1}/>);

  expect(wrapper.find('.item-1').props().active).toBeTruthy();
  expect(wrapper.find('.item-0').props().active).toBeFalsy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('sets the state when onSelectBounty called',() => {
  const select = jest.fn();
  const bounties = [{guid:'asdf'}, {guid:'demo'}];

  const wrapper = mount(<Sidebar select={select} bounties={bounties} />);
  const instance = wrapper.instance();

  instance.onSelectBounty(1);

  expect(select).toHaveBeenCalledWith(1);
});

it('selects the row that was clicked',() => {
  const select = jest.spyOn(App.prototype, 'onSelectBounty');
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const wrapper = mount(<App/>);
  wrapper.setState({first: false, bounties: bounties, active: 0});

  wrapper.find('.item-1').simulate('click');

  expect(select).toHaveBeenCalledWith(1);
  expect(wrapper.find('.item-1').props().active).toBeTruthy();
});

it('calls remove when onBountyRemoved called',() => {
  const remove = jest.fn();
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const wrapper = mount(<Sidebar remove={remove} bounties={bounties} />);
  const instance = wrapper.instance();

  instance.onBountyRemoved(1);

  expect(remove).toHaveBeenCalledWith(1);
});

it('calls remove when RemoveButton clicked for a row',() => {
  const remove = jest.fn();
  const select = jest.fn();
  const bounties = [{guid:'asdf'}, {guid:'demo'}];

  const wrapper = mount(<Sidebar select={select} remove={remove} bounties={bounties} />);

  wrapper.find('.item-1').simulate('mouseEnter');
  wrapper.find('.item-1').find('.Remove-Button').simulate('click');

  expect(remove).toHaveBeenCalledWith(1);
  expect(select).toHaveBeenCalledTimes(0);
});

it('shows alert when bounty has updated: true', () => {
  const remove = jest.fn();
  const select = jest.fn();
  const bounties = [{guid:'asdf', updated: true}, {guid:'demo'}];

  const wrapper = mount(<Sidebar select={select} remove={remove} bounties={bounties} />);

  expect(wrapper.find('.item-0').find('.alert')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});
