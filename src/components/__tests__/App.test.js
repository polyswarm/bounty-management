import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import LocalStorage from '../__mocks__/localstorage';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
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

it('calls setState with create:true when onCreateBounty is called', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  const bounties = [{guid:'asdf'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  const setState = jest.spyOn(App.prototype, 'setState');

  instance.onCreateBounty();

  expect(setState).toHaveBeenCalledWith({active:-1, create: true});
});

it('shows create bounty when create is true.', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
  const active = 0;

  wrapper.setState({first: false, create: true, bounties: bounties, active: active});

  expect(wrapper.find('.Bounty-Create')).toHaveLength(1);
});

it('calls onCreateBounty when header button is clicked.', () => {
  const onCreateBounty = jest.spyOn(App.prototype, 'onCreateBounty');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});

  wrapper.find('.Header-Button').simulate('click');

  expect(onCreateBounty).toHaveBeenCalledTimes(1);
});

it('shows create when header "+ Bounty" is clicked', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});

  wrapper.find('.Header-Button').simulate('click');

  expect(wrapper.find('.Bounty-Create')).toHaveLength(1);
  expect(wrapper.find('.Bounty-Info')).toHaveLength(0);
});

it('shows BountyInfo when at least one bounty & active selects it', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  expect(wrapper.find('.Bounty-Info')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows BountyInfo when at least one bounty & active is negative', () => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}];
  const active = -1;
  wrapper.setState({first: false, bounties: bounties, active: active});

  expect(wrapper.find('.Bounty-Create')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows welcome screen on first load', () => {
  const wrapper = mount(<App />);
  expect(wrapper.find('.Welcome')).toHaveLength(1);
});

it('stores seen true when welcome closed', () => {
  const wrapper = mount(<App />);
  wrapper.find('.Welcome').find('button').simulate('click');
  expect(JSON.parse(localStorage.getItem('seen'))).toBeTruthy();
});

it('calls select when a sidebar item is clicked', () => {
  const select = jest.spyOn(App.prototype, 'onSelectBounty');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('click');
  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith(0);
});

it('updates the state when onSelectBounty called',() => {
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf', updated: true}, {guid:'demo', updated: true}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});

  const setState = jest.spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(1);

  expect(setState).toHaveBeenCalledWith({
    active: 1,
    create: false,
    bounties: [{
      guid:'asdf',
      updated: true
    },
    {
      guid:'demo',
      updated: false
    }],
  });
});

it('sets updated to false on bounty when onSelectBounty clicked', () => {

});

it('does not update the state when onSelectBounty called with negative',() => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with null',() => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with out of bounds',() => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(1000);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls remove when a sidebar item remove is clicked', () => {
  const remove = jest.spyOn(App.prototype, 'onRemoveBounty');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  wrapper.find('.item-0').simulate('mouseEnter');
  wrapper.find('.Remove-Button').simulate('click');
  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(0);
});

it('updates the state when onRemoveBounty called',() => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({first: false, bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(1);

  expect(setState).toHaveBeenCalledWith({bounties:[{guid:'asdf'}]});
});

it('removes the value at the index passed in onRemoveBounty', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();
  const instance = wrapper.instance();
  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({bounties:[{guid:'demo'}]});
});

it('doesn\'t remove anything if onRemoveBounty called with negative', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();
  const instance = wrapper.instance();

  instance.onRemoveBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with null', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('doesn\'t remove anything if onRemoveBounty called with out of bounds', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const bounties = [{guid:'asdf'}, {guid:'demo'}];
  const active = 0;
  wrapper.setState({bounties: bounties, active: active});
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(2);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls setState during onAddBounty', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  const setState = jest.spyOn(App.prototype, 'setState');
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
  const setState = jest.spyOn(App.prototype, 'setState');
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
  setState.mockClear();

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
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState();

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
  const setState = jest.spyOn(App.prototype, 'setState');
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
  setState.mockClear();

  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({bounties:[]});
});

it('calls storeBounties after onRemoveBounty', () => {
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
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
  storeBounties.mockClear();

  instance.onRemoveBounty(0);

  expect(storeBounties).toHaveBeenCalledWith([]);
});

it('doesn\'t call storeBounties when setState called with identical set of bounties', (done) => {
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
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
  localStorage.setItem('bounties', JSON.stringify(bounties));
  const wrapper = mount(<App />);
  storeBounties.mockClear();

  wrapper.setState({bounties: bounties});

  setTimeout(() => {
    try{
      expect(storeBounties).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('calls storeBounties when setState called with different set of bounties', (done) => {
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
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
  localStorage.setItem('bounties', JSON.stringify(bounties));
  const wrapper = mount(<App />);
  storeBounties.mockClear();
  bounties.push({
    guid: 'demo',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: '',
  });
  wrapper.setState({bounties: bounties});

  setTimeout(() => {
    try{
      expect(storeBounties).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 0);
});

it('stores bounties into localstore when storeBounties is called', () => {
  const setItem = jest.spyOn(LocalStorage.prototype, 'setItem');
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

  instance.storeBounties(bounties);

  expect(setItem).toHaveBeenCalledTimes(2);
  expect(setItem.mock.calls[1]).toEqual(['bounties', JSON.stringify(bounties)]);
});

it('reads bounties from localStorage and puts into state on startup', () => {
  const bounties = JSON.stringify([{
    guid: 'existing',
    update: false,
    author: 'asdf',
    amount: 'asdf',
    artifactURI: 'asdf',
    expirationBlock: 'asdf',
    resolved: 'asdf',
    verdicts: 'asdf',
  }]);
  localStorage.setItem('bounties', bounties);

  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  expect(instance.state.bounties).toEqual(JSON.parse(bounties));
});

it('reads seen from localStorage and puts it into state as first on startup', () => {
  localStorage.setItem('seen', JSON.stringify(true));
  const wrapper = mount(<App />);
  const instance = wrapper.instance();

  expect(instance.state.first).toBeFalsy();
});

it('calls setState with account: true when calling onAccountSet(true)', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  setState.mockClear();

  instance.onWalletChangeHandler(true);

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({isUnlocked: true});
});

it('calls setState with account: false when calling onAccountSet(false)', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  setState.mockClear();

  instance.onWalletChangeHandler(false);

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith({isUnlocked: false});
});
