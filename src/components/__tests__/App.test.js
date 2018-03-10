import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import LocalStorage from '../__mocks__/localstorage';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

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
  const bounties = [{guid:'asdf'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  expect(wrapper.find('.Manager')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows manager when at least one bounty & active is negative', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
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
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('click');
  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith(0);
});

it('updates the state when onSelectBounty called',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(1);

  expect(setState).toHaveBeenCalledWith({active: 1});
});

it('does not update the state when onSelectBounty called with negative',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with null',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with out of bounds',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
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
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('mouseEnter');
  wrapper.find('.Remove-Button').simulate('click');
  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(0);
});

it('updates the state when onRemoveBounty called',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(1);

  expect(setState).toHaveBeenCalledWith({bounties:[{guid:'asdf'}]});
});

it('removes the value at the index passed in onRemoveBounty', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({bounties:[{guid:'demo'}]});
});

it('doesn\'t remove anything if onRemoveBounty called with negative', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with null', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with out of bounds', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onRemoveBounty(2);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls setState during onAddBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  const setState = spyOn(App.prototype, 'setState');
  instance.onAddBounty('asdf');

  expect(setState).toHaveBeenCalledWith({bounties: [{
    guid: 'asdf',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});
});

it('calls setState during onAddBounty with existing values', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const setState = spyOn(App.prototype, 'setState');

  instance.onAddBounty('asdf');

  expect(setState).toHaveBeenCalledWith({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  },
  {
    guid: 'asdf',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});
});

it('calls storeBounties after onAddBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  const storeBounties = spyOn(App.prototype, 'storeBounties');
  instance.onAddBounty('asdf');

  expect(storeBounties).toHaveBeenCalledWith([{
    guid: 'asdf',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]);
});

it('calls setState during onRemoveBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const setState = spyOn(App.prototype, 'setState');
  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({bounties:[]});
});

it('calls storeBounties after onRemoveBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const storeBounties = spyOn(App.prototype, 'storeBounties');
  instance.onRemoveBounty(0);

  expect(storeBounties).toHaveBeenCalledWith([]);
});

it('calls setState during onUpdateBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const setState = spyOn(App.prototype, 'setState');
  instance.onUpdateBounty('existing', '','','','','','');

  expect(setState).toHaveBeenCalledWith({bounties:[{
    guid: 'existing',
    update: true,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});
});

it('calls storeBounties after onUpdateBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const storeBounties = spyOn(App.prototype, 'storeBounties');
  instance.onUpdateBounty('existing', '','','','','','');

  expect(storeBounties).toHaveBeenCalledWith([{
    guid: 'existing',
    update: true,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]);
});

it('does not call storeBounties after onUpdateBounty with null guid', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const storeBounties = spyOn(App.prototype, 'storeBounties');
  instance.onUpdateBounty(null, '','','','','','');

  expect(storeBounties).toHaveBeenCalledTimes(0);
});

it('does not call storeBounties after onUpdateBounty with guid that does not match', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({bounties: [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }]});

  const storeBounties = spyOn(App.prototype, 'storeBounties');
  instance.onUpdateBounty('asdf', '','','','','','');

  expect(storeBounties).toHaveBeenCalledTimes(0);
});

it('doesn\'t call storeBounties when setState called with identical set of bounties', () => {
  const wrapper = mount(<App />);
  const bounties = [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }];
  const storeBounties = spyOn(App.prototype, 'storeBounties');
  wrapper.setState({bounties: bounties});
  wrapper.setState({bounties: bounties});

  expect(storeBounties).toHaveBeenCalledTimes(1);
});

it('stores bounties into localstore when storeBounties is called', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  const bounties = [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }];

  const setItem = jest.spyOn(LocalStorage.prototype, 'setItem');

  instance.storeBounties(bounties);

  expect(setItem).toHaveBeenCalledTimes(2);
  expect(setItem.mock.calls[1]).toEqual(['bounties', bounties]);
});

it('reads bounties from localStorage and puts into state on startup', () => {
  const bounties = [{
    guid: 'existing',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  }];
  localStorage.setItem('bounties', bounties);

  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  expect(instance.state.bounties).toBe(bounties);
});
