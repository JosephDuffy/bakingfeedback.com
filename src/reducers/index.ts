import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';
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

const surveysPersistTransforms = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (state: SurveysState) => {
    return state;
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  (state: any, key: string) => {
    if (key === 'surveys') {
      let transformedState = state;

      transformedState = transformedState.get('loading').clear();
      transformedState = transformedState.get('errors').clear();

      return transformedState;
    }
    return state;
  },
);

const combinedReducers = combineReducers<AppState>({
  surveys: surveysReducer,
  surveyAnswers,
  surveyResults,
});

const config = {
  key: 'app',
  storage: localForage,
  transforms: [
    surveysPersistTransforms,
    immutableTransform(),
  ],
};

export default persistReducer(config, combinedReducers);
