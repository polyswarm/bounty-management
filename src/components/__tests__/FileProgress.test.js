import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import FileProgress from '../FileProgress';

it('throws on render without files', () => {
  expect(() => {
    render(<FileProgress />);
  }).toThrow();
});

it('renders without crashing', () => {
  const file = {
    name: 'asdf'
  };
  const wrapper = render(<FileProgress file={file} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

if('calls the mock function when I click close', () => {
  const remove = jest.fn();
  const file = {
    name: 'asdf'
  };
  const wrapper = render(<FileProgress file={file} remove={remove} />);
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
});
