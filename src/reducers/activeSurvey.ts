import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { loadSurvey, selectQuestion, updateQuestionAnswer } from '../actions/activeSurvey';
import Survey from '../interfaces/Survey';

export type State = {
  currentQuestionIndex: number,
  survey?: Survey,
  answers: string[][],
};

const initialState = {
  currentQuestionIndex: 0,
  answers: [],
};

const reducer = reducerWithInitialState<State>(initialState)
  .case(selectQuestion, (state, newQuestion) => ({
    ...state,
    currentQuestionIndex: newQuestion,
  }))
  .case(updateQuestionAnswer, (state, { questionIndex, answerIndex, answer }) => {
    const answers = state.answers;

    if (answers[questionIndex] === undefined) {
      answers[questionIndex] = [];
    }

    answers[questionIndex][answerIndex] = answer;

    return {
      ...state,
      answers,
    };
  })
  .case(loadSurvey.done, (state, { result: survey }) => ({
    ...state,
    currentQuestionIndex: 0,
    survey,
    answers: [],
  }))
  .build();

export default reducer;
