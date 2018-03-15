import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyInfo from '../BountyInfo';

it('renders without crashing', () => {
  const wrapper = render(<BountyInfo />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
