import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Sidebar from '../Sidebar';

it('renders without crashing', () => {
  const bounties = [];
  const wrapper = render(<Sidebar bounties={bounties} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
