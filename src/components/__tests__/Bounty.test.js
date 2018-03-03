import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyCreate from '../BountyCreate';

it('renders without crashing', () => {
  const wrapper = render(<BountyCreate />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
