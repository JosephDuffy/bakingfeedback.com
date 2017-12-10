import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';

import surveyAnswers, { State as SurveysAnswersState } from './surveyAnswers';
import { default as surveysReducer, State as SurveysState } from './surveys';

export type AppState = {
  surveys: SurveysState,
  surveyAnswers: SurveysAnswersState,
};

const surveysPersistTransforms = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (state: SurveysState) => {
    return state;
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  (state: any, key: string) => {
    if (key === 'surveys') {
      const surveys = {};

      for (const surveyId of Object.keys(state)) {
        const survey = state[surveyId];
        delete survey.loadError;
        survey.loading = false;
        surveys[surveyId] = survey;
      }

      return surveys;
    }
    return state;
  },
);

const surveysPersistConfig = {
  key: 'surveys',
  storage: localForage,
  transforms: [
    surveysPersistTransforms,
  ],
};

const surveyAnswersPersistConfig = {
  key: 'surveyAnswers',
  storage: localForage,
};

export default combineReducers({
  surveys: persistReducer(surveysPersistConfig, surveysReducer),
  surveyAnswers: persistReducer(surveyAnswersPersistConfig, surveyAnswers),
});
