import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetch from 'jest-fetch-mock';
import localStorage from './components/__mocks__/localstorage'

configure({adapter: new Adapter()});
global.fetch = fetch;
global.window.localStorage = new localStorage();
