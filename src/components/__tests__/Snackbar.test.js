import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Snackbar from '../Snackbar';

it('renders without crashing', () => {
  const wrapper = render(<Snackbar />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the text given as the message property', () => {
  const message = 'Show this error?';
  const wrapper = mount(<Snackbar message={message}/>);

  expect(wrapper.find('p').text()).toEqual('Show this error?');
});

it('calls onDismiss when dismiss is clicked', () => {
  const onDismiss = jest.fn();
  const message = 'Show this error?';
  const wrapper = mount(<Snackbar message={message} onDismiss={onDismiss}/>);

  wrapper.find('button').simulate('click');

  expect(onDismiss).toHaveBeenCalledTimes(1);
});
