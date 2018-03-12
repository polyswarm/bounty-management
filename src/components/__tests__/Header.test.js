import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Header from '../Header';

it('renders without crashing', () => {
  const wrapper = render(<Header />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows title props', () => {
  const wrapper = render(<Header title={'Title'}/>);

  expect(wrapper.find('h1').text()).toBe('Title');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call onClick callback when clicked', () => {
  const onClick = jest.fn();
  const wrapper = mount(<Header title={'Title'} onClick={onClick}/>);

  wrapper.find('button').simulate('click');

  expect(onClick).toHaveBeenCalledTimes(1);
});
