import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { loadSurvey } from '../actions/surveys';
import Survey from '../interfaces/Survey';

export type State = {
  latest?: string,
  surveys: {
    [surveyId: string]: {
      survey?: Survey,
      loadError?: Error,
      loading: boolean,
    },
  },
};

const initialState = {
  surveys: {},
};

const reducer = reducerWithInitialState<State>(initialState)
  .case(loadSurvey.started, (state, payload) => ({
    ...state,
    surveys: {
      ...state.surveys,
      [payload.id]: {
        survey: undefined,
        ...state[payload.id],
        loadError: undefined,
        loading: true,
      },
    },
  }))
  .case(loadSurvey.done, (state, payload) => {
    const newState = state;

    if (payload.result.id !== payload.params.id) {
      // In some cases (e.g. fetching `latest`) the requested id
      // may not match the returned id
      delete newState.surveys[payload.params.id];
    }

    if (payload.params.id === 'latest') {
      newState.latest = payload.result.id;
    }

    newState.surveys[payload.result.id] = {
      ...state.surveys[payload.result.id],
      survey: payload.result,
      loadError: undefined,
      loading: false,
    };

    return newState;
  })
  .case(loadSurvey.failed, (state, failure) => ({
    ...state,
    surveys: {
      ...state.surveys,
      [failure.params.id]: {
        ...state[failure.params.id],
        loadError: failure.error,
        loading: false,
      },
    },
  }))
  .build();

export default reducer;
