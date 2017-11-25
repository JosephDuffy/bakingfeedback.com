import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import './global.css';

import Footer from './components/Footer';
import Survey from './components/Survey';

import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './store';

const { persistor, store } = configureStore();
const history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
      loading={<div>Loading...</div>}
    >
      <main>
        <Router
          history={history}
        >
          <Switch>
            <Route path="/" exact={true} component={Survey} />
            <Route path="/question/" exact={true} component={Survey} />
            <Route path="/question/:questionNumber" exact={true} component={Survey} />
          </Switch>
        </Router>
      </main>
      <Footer/>
    </PersistGate>
  </Provider >,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
