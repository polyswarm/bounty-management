import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import FileProgress from '../FileProgress';

it('renders without crashing', () => {
  const wrapper = render(<FileProgress />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
