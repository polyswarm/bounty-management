import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json'
import FileButton from '../FileButton';

it('FileButton renders without crashing', () => {
  const wrapper = render(<FileButton />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
