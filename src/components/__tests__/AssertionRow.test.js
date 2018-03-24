import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AssertionRow from '../AssertionRow';

it('renders without crashing', () => {
  const assertion = {
    name: 'asdf',
    verdict: true,
    bid: 10,
    metadata: 'Some virus'
  };
  const wrapper = render(
    <table>
      <AssertionRow assertion={assertion}/>
    </table>
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('returns Malignant from computeClass with true verdict', () => {
  const result = AssertionRow.computeClass(true);

  expect(result).toEqual('Malignant');
});

it('returns Benign from computeClass with false verdict', () => {
  const result = AssertionRow.computeClass(false);

  expect(result).toEqual('Benign');
});

it('shows Malignant in the veridict column with true verdict', () => {
  const assertion = {
    name: 'asdf',
    verdict: true,
    bid: 10,
    metadata: 'Some virus'
  };
  const wrapper = render(
    <table>
      <AssertionRow assertion={assertion}/>
    </table>
  );

  expect(wrapper.find('.Assertion-Malignant').text()).toEqual('Malicious');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows Benign in the veridict column with false verdict', () => {
  const assertion = {
    name: 'asdf',
    verdict: false,
    bid: 10,
    metadata: ''
  };
  const wrapper = render(
    <table>
      <AssertionRow assertion={assertion}/>
    </table>
  );

  expect(wrapper.find('.Assertion-Benign').text()).toEqual('Safe');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
