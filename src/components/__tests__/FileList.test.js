import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson, mountToJson} from 'enzyme-to-json';
import FileList from '../FileList';

it('throws when created without files', () => {
  expect(() => { render(<FileList />);  }).toThrow();
});

it('renders without crashing', () => {
  const files = [];
  const wrapper = render(<FileList files={files} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('contains 3 FileProgress when 3 added', () => {
  const files = [
    {name: 'asdf'},
    {name: 'demo'},
    {name: 'test'},
  ];
  const wrapper = render(<FileList files={files} />);
  expect(wrapper.find('.ListItem')).toHaveLength(3);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls remove when FileProgress remove button clicked',() => {
  const remove = jest.fn();
  const files = [
    {name: 'asdf'},
  ];
  const wrapper = mount(
    <FileList
      removeFile={remove}
      files={files} />
  );
  wrapper.find('.ListItem').simulate('mouseEnter');
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});
