import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ListItem from '../ListItem';

it('renders without crashing', () => {
  const item = 'asdf';
  const wrapper = render(<ListItem item={item} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

if('calls the mock function when I click close', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = render(<ListItem item={item} remove={remove} />);
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
});
