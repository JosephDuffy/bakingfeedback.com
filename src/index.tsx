import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import Questions from './Questions';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Questions />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
