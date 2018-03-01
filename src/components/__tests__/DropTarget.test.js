import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json'
import DropTarget from '../DropTarget';

it('DropTarget renders without crashing', () => {
  const wrapper = render(<DropTarget />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
