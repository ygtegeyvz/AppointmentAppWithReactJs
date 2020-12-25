import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import {render} from 'react-dom';

import {App} from './app';

import './index.css';
import {configureFakeBackEnd} from './helpers/';

configureFakeBackEnd();

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
