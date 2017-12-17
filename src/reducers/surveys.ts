import * as Immutable from 'immutable';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { loadSurvey } from '../actions/surveys';
import Survey from '../interfaces/Survey';

const StateRecord = Immutable.Record({
  latest: null,
  cached: Immutable.Map<string, Survey>(),
  errors: Immutable.Map<string, Error>(),
  loading: Immutable.Set<string>(),
}, 'Surveys');

export type State = Immutable.Map<string, any>;

const reducer = reducerWithInitialState<State>(new StateRecord())
  .case(loadSurvey.started, (state, payload) => {
    let newState = state;

    newState = newState.deleteIn(['errors', payload.id]);
    newState = newState.update('loading', loading => loading.add(payload.id));

    return newState;
  })
  .case(loadSurvey.done, (state, payload) => {
    let newState = state;

    if (payload.params.id === 'latest') {
      newState = newState.set('latest', payload.result.id);
    }

    newState = newState.update('loading', loading => loading.remove(payload.params.id));
    newState = newState.deleteIn(['errors', payload.params.id]);
    newState = newState.setIn(['cached', payload.result.id], payload.result);

    return newState;
  })
  .case(loadSurvey.failed, (state, failure) => {
    let newState = state;

    newState = newState.setIn(['errors', failure.params.id], failure.error);
    newState = newState.update('loading', loading => loading.remove(failure.params.id));

    return newState;
  })
  .build();

export default reducer;
