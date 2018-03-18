import * as Immutable from 'immutable';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { loadResults } from '../actions/surveyResults';
import PublicSurveyResult from '../interfaces/PublicSurveyResult';

const StateRecord = Immutable.Record({
  cached: Immutable.Map<string, PublicSurveyResult>(),
  errors: Immutable.Map<string, Error>(),
  loading: Immutable.Set<string>(),
}, 'Surveys');

export type State = Immutable.Map<string, any>;

const initialState: State = new StateRecord();

const reducer = reducerWithInitialState<State>(initialState)
  .case(loadResults.started, (state, payload) => {
    let newState = state;

    newState = newState.deleteIn(['errors', payload.surveyId]);
    newState = newState.update('loading', loading => loading.add(payload.surveyId));

    return newState;
  })
  .case(loadResults.done, (state, payload) => {
    let newState = state;

    newState = newState.update('loading', loading => loading.remove(payload.params.surveyId));
    newState = newState.deleteIn(['errors', payload.params.surveyId]);
    newState = newState.setIn(['cached', payload.params.surveyId], payload.result);

    return newState;
  })
  .case(loadResults.failed, (state, failure) => {
    let newState = state;

    newState = newState.setIn(['errors', failure.params.surveyId], failure.error);
    newState = newState.update('loading', loading => loading.remove(failure.params.surveyId));

    return newState;
  })
  .build();

export default reducer;
