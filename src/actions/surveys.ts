import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';

import { apiBaseURL } from '../config';
import Survey from '../interfaces/Survey';

const actionCreator = actionCreatorFactory();

export type AnswerQuestionPayload = {
  surveyId: string;
  questionIndex: number;
  inputId: string;
  answer: any;
};
export const updateQuestionAnswer = actionCreator<AnswerQuestionPayload>('UPDATE_QUESTION_ANSWER');

export type LoadSurveyPayload = {
  id: string,
};

export const loadSurvey = actionCreator.async<LoadSurveyPayload, Survey>('LOAD_SURVEY');

export const loadSurveyWorker = bindThunkAction(loadSurvey, async (options, dispatch, getState) => {
  const url = `${apiBaseURL}/surveys/${options.id}`;

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('Survey not found');
  } else if (response.status !== 200) {
    throw new Error(`Unknown error: ${response.status}`);
  }

  const survey: Survey = await response.json();

  return survey;
});
