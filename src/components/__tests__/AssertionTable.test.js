import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AssertionTable from '../AssertionTable';

it('renders without crashing', () => {
  const assertions = [];
  const wrapper = render(<AssertionTable assertions={assertions}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('renders the correct number of children', () => {
  const assertions = [
    {author: 'asdf', verdict: false, bid: 5, metadata: 'Nothing'},
    {author: 'demo', verdict: false, bid: 5, metadata: ''},
    {author: 'fdsa', verdict: true, bid: 1000, metadata: 'VIRUS'},
  ];
  const wrapper = render(<AssertionTable assertions={assertions}/>);

  expect(wrapper.find('.AssertionRow')).toHaveLength(3);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
