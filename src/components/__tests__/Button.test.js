import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Button from '../Button';

it('renders without crashing', () => {
  const wrapper = render(<Button />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the onClick function passed as a property when clicked', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button onClick={onClickHandler} />);

  wrapper.simulate('click');

  expect(onClickHandler).toHaveBeenCalled();
});
