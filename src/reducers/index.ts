import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';

import surveyAnswers, { State as SurveysAnswersState } from './surveyAnswers';
import surveyResults, { State as SurveysResultsState } from './surveyResults';
import { default as surveysReducer, State as SurveysState } from './surveys';

// TODO: Reset surveys' `loadError` and `loading` properties on rehydration

export type AppState = {
  surveys: SurveysState,
  surveyAnswers: SurveysAnswersState,
  surveyResults: SurveysResultsState,
};

const combinedReducers = combineReducers<AppState>({
  surveys: surveysReducer,
  surveyAnswers,
  surveyResults,
});

const config = {
  key: 'app',
  storage: localForage,
  transforms: [immutableTransform()],
};

export default persistReducer(config, combinedReducers);
