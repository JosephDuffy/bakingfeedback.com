import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import activeSurvey, { State as ActiveSurveyState } from './activeSurvey';

export type AppState = {
  activeSurvey: ActiveSurveyState,
};

const combinedReducers = combineReducers<AppState>({
  activeSurvey,
});

const config = {
  key: 'app',
  storage: localForage,
};

const persistedReducer = persistReducer(config, combinedReducers);

export default persistedReducer;
