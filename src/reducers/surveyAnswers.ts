import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { updateQuestionAnswer } from '../actions/surveys';

export type State = {
  [surveyId: string]: Array<{
    [inputId: string]: any,
  }>,
};

const initialState = {};

const reducer = reducerWithInitialState<State>(initialState)
  .case(updateQuestionAnswer, (state, { surveyId, questionIndex, inputId, answer }) => {
    const answers = {...state};

    if (answers[surveyId] === undefined) {
      answers[surveyId] = [];
    }

    if (answers[surveyId][questionIndex] === undefined) {
      answers[surveyId][questionIndex] = {};
    }

    answers[surveyId][questionIndex][inputId] = answer;

    return answers;
  })
  .build();

export default reducer;
