import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import {BrowserRouter} from 'react-router-dom';
import Manager from '../Manager';

it('renders without crashing', () => {
  const wrapper = render(
    <BrowserRouter>
      <Manager />
    </BrowserRouter>
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
