import * as localForage from 'localforage';
import { persistReducer } from 'redux-persist';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { updateQuestionAnswer } from '../actions/surveys';

export type State = {
  [surveyId: string]: {
    answers: string[][],
  },
};

const initialState = {};

const reducer = reducerWithInitialState<State>(initialState)
  .case(updateQuestionAnswer, (state, { surveyId, questionIndex, answerIndex, answer }) => {
    const answers = state;

    if (answers[surveyId] === undefined) {
      answers[surveyId] = {
        answers: [],
      };
    }

    if (answers[surveyId].answers[questionIndex] === undefined) {
      answers[surveyId].answers[questionIndex] = [];
    }

    answers[surveyId].answers[questionIndex][answerIndex] = answer;

    return answers;
  })
  .build();

const config = {
  key: 'surveyAnswers',
  storage: localForage,
};

export default persistReducer(config, reducer);
