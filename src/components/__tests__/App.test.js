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

it('updates the state when onSelectBounty called',() => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(1);

  expect(setState).toHaveBeenCalledWith({active: 1});
});

it('does not update the state when onSelectBounty called with negative',() => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with null',() => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with out of bounds',() => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(1000);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls remove when a sidebar item remove is clicked', () => {
  const remove = spyOn(App.prototype, 'onRemoveBounty');
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('mouseEnter');
  wrapper.find('.Remove-Button').simulate('click');
  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(0);
});

it('updates the state when onRemoveBounty called',() => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(1);

  expect(setState).toHaveBeenCalledWith({bounties:['asdf']});
});

it('removes the value at the index passed in onRemoveBounty', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({bounties:['demo']});
});

it('doesn\'t remove anything if onRemoveBounty called with negative', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with null', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with out of bounds', () => {
  const wrapper = mount(<App />);
  const bounties = ['asdf', 'demo'];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(2);

  expect(setState).toHaveBeenCalledTimes(0);
});
