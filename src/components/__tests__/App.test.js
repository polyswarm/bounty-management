import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import App from '../App';

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows create when no bounties found', () => {
  const wrapper = mount(<App />);
  wrapper.setState({first: false});
  expect(wrapper.find('.Bounty-Create')).toHaveLength(1);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows manager when at least one bounty & active selects it', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf'];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  expect(wrapper.find('.Manager')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows manager when at least one bounty & active is negative', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf'];
  const active = -1;
  wrapper.setState({first: false, bounties: bounties, active: active});
  expect(wrapper.find('.Manager')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

// it('shows welcome screen on first load', () => {
//   const wrapper = mount(<App />);
//   expect(wrapper.find('.Welcome')).toHaveLength(1);
// });

it('calls select when a sidebar item is clicked', () => {
  const select = spyOn(App.prototype, 'onSelectBounty');
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('click');
  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith(0);
});
