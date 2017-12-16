import * as Immutable from 'immutable';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { updateQuestionAnswer } from '../actions/surveys';

export type QuestionAnswers = Immutable.Map<string, any>;
export type SurveyQuestions = Immutable.List<QuestionAnswers>;
export type State = Immutable.Map<string, SurveyQuestions>;

const initialState = Immutable.Map<string, SurveyQuestions>();

const reducer = reducerWithInitialState<State>(initialState)
  .case(updateQuestionAnswer, (state, { surveyId, questionIndex, inputId, answer }) => {
    let answers = state;

    if (answers.get(surveyId) === undefined) {
      answers = answers.set(surveyId, Immutable.List());
    }

    if (answers.getIn([surveyId, questionIndex]) === undefined) {
      answers = answers.setIn([surveyId, questionIndex], Immutable.Map());
    }

    answers = answers.setIn([surveyId, questionIndex, inputId], answer);

    return answers;
  })
  .build();

export default reducer;
