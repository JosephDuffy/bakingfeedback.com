import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import './global.css';

import Footer from './components/Footer';
import LoadLatestSurvey from './components/LoadLatestSurvey';
import Survey from './components/Survey';
import SurveyComplete from './components/SurveyComplete';

import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './store';

const { persistor, store } = configureStore();
const history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
      loading={<div>Rehydrating...</div>}
    >
      <main>
        <Router
          history={history}
        >
          <Switch>
            <Route path="/" exact={true} component={LoadLatestSurvey} />
            <Route path="/latest-survey" exact={true} component={LoadLatestSurvey} />
            <Route path="/survey-complete" exact={true} component={SurveyComplete} />
            <Route path="/:surveyId/" exact={true} component={Survey} />
            <Route path="/:surveyId/question-:questionNumber" exact={true} component={Survey} />
          </Switch>
        </Router>
      </main>
      <Footer/>
    </PersistGate>
  </Provider >,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
