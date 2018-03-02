import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Upload from '../App';

it('renders without crashing', () => {
  const wrapper = render(<Upload />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
