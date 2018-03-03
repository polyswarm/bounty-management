import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import FileList from '../FileList';

it('renders without crashing', () => {
  const wrapper = render(<FileList />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
