import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyInfo from '../BountyInfo';

it('renders without crashing', () => {
  const bounty = { };
  const wrapper = render(<BountyInfo bounty={bounty}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows files as passed in though the bounty object', () => {
  const bounty = {
    artifacts: [{name: 'asdf'},{name: 'demo'}],
  };
  const wrapper = mount(<BountyInfo bounty={bounty}/>);

  expect(wrapper.find('.ListItem')).toHaveLength(2);
  expect(wrapper.find('.item-0').text()).toEqual('asdf');
  expect(wrapper.find('.item-1').text()).toEqual('demo');
});
