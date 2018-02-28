import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json'
import App from '../App';

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
