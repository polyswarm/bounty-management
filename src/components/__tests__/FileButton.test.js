import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import FileButton from '../FileButton';

it('renders without crashing', () => {
  const wrapper = render(<FileButton />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the provided fileSelected function', () => {
  // arramnge
  const fileSelected = jest.fn();
  const wrapper = mount(
    <FileButton onFileSelected={fileSelected}/>
  );
  const instance = wrapper.instance();
  const event = {
    target: {
      value: 'fileName'
    }
  };
  // act
  instance.onFileChanged(event);

  // assert
  expect(fileSelected).toHaveBeenCalled();
});
