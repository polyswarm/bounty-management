import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Sidebar from '../Sidebar';

it('renders without crashing', () => {
  const wrapper = render(<Sidebar />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
