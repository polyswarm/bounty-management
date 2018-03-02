import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import App from '../App';

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
