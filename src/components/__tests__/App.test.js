import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import {BrowserRouter} from 'react-router-dom';
import App from '../App';

it('renders without crashing', () => {
  const wrapper = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
