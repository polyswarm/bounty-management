import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import FileSelect from '../FileSelect';

it('throws on render without files', () => {
  expect(() => {
    render(<FileSelect />);
  }).toThrow();
});

it('renders without crashing', () => {
  const file = {
    name: 'asdf'
  };
  const wrapper = render(<FileSelect file={file} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

if('calls the mock function when I click close', () => {
  const remove = jest.fn();
  const file = {
    name: 'asdf'
  };
  const wrapper = render(<FileSelect file={file} remove={remove} />);
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
});
