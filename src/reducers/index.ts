import * as localForage from 'localforage';
import { persistCombineReducers } from 'redux-persist';

import surveyAnswers, { State as SurveysAnswersState } from './surveyAnswers';
import surveys, { State as SurveysState } from './surveys';

export type AppState = {
  surveys: SurveysState,
  surveyAnswers: SurveysAnswersState,
};

const config = {
  key: 'app',
  storage: localForage,
};

export default persistCombineReducers(config, { surveys, surveyAnswers });
