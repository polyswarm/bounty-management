import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Manager from '../Manager';

it('renders without crashing', () => {
  const wrapper = render( <Manager /> );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
