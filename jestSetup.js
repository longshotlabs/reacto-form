// This file is loaded from the jest.setupFiles config in package.json

import '@babel/polyfill'; // eslint-disable-line import/no-extraneous-dependencies
import Enzyme from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16'; // eslint-disable-line import/no-extraneous-dependencies

Enzyme.configure({ adapter: new Adapter() });
