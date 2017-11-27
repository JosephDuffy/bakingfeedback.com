import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';

import { apiBaseURL } from '../config';
import Survey from '../interfaces/Survey';

const actionCreator = actionCreatorFactory();

export type AnswerQuestionPlayload = {
  surveyId: string;
  questionIndex: number;
  answerIndex: number;
  answer: string;
};
export const updateQuestionAnswer = actionCreator<AnswerQuestionPlayload>('UPDATE_QUESTION_ANSWER');

export type LoadSurveyPayload = {
  id: string,
};

export const loadSurvey = actionCreator.async<LoadSurveyPayload, Survey>('LOAD_SURVEY');

export const loadSurveyWorker = bindThunkAction(loadSurvey, async (options, dispatch, getState) => {
  const url = `${apiBaseURL}/surveys/${options.id}`;

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('Survey not found');
  }

  const survey: Survey = await response.json();

  return survey;
});
