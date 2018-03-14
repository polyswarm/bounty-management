import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Info from '../Info';

it('renders without crashing', () => {
  const wrapper = render(<Info />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
