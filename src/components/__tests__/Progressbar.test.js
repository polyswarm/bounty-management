import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Progressbar from '../Progressbar';

it('renders without crashing', () => {
  const wrapper = render(<Progressbar />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('sets progress width according to value passed', () => {
  const wrapper = mount(<Progressbar progress={40}/>);

  expect(wrapper.find('.Progressbar-Fill').props().style.width).toBe('40%');
});

it('caps progress at 100%', () => {
  const wrapper = mount(<Progressbar progress={10000}/>);

  expect(wrapper.find('.Progressbar-Fill').props().style.width).toBe('100%');
});

it('uses 0 as the minimum', () => {
  const wrapper = mount(<Progressbar progress={-10}/>);

  expect(wrapper.find('.Progressbar-Fill').props().style.width).toBe('0%');
});

it('uses 0 when no progress given', () => {
  const wrapper = mount(<Progressbar/>);

  expect(wrapper.find('.Progressbar-Fill').props().style.width).toBe('0%');
});
