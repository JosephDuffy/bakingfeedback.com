import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import surveyAnswers, { State as SurveysAnswersState } from './surveyAnswers';
import { default as surveysReducer, State as SurveysState } from './surveys';

// TODO: Reset surveys' `loadError` and `loading` properties on rehydration

export type AppState = {
  surveys: SurveysState,
  surveyAnswers: SurveysAnswersState,
};

const combinedReducers = combineReducers<AppState>({
  surveys: surveysReducer,
  surveyAnswers,
});

const config = {
  key: 'app',
  storage: localForage,
};

export default persistReducer(config, combinedReducers);
