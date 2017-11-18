import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { answerQuestion, loadSurvey, selectQuestion } from '../actions/activeSurvey';
import Survey from '../interfaces/Survey';

export type State = {
  currentQuestion: number,
  survey?: Survey,
  answers: string[],
};

const initialState = {
  currentQuestion: 0,
  answers: [],
};

const reducer = reducerWithInitialState<State>(initialState)
  .case(selectQuestion, (state, newQuestion) => ({
    ...state,
    currentQuestion: newQuestion,
  }))
  .case(answerQuestion, (state, payload) => {
    const answers = state.answers;
    answers[payload.questionNumber] = payload.answer;

    return {
      ...state,
      answers,
    };
  })
  .case(loadSurvey.done, (state, { result: survey }) => ({
    ...state,
    currentQuestion: 0,
    survey,
  }))
  .build();

export default reducer;
