import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';

import { apiBaseURL } from '../config';
import PublicSurveyResult from '../interfaces/PublicSurveyResult';

const actionCreator = actionCreatorFactory();

export type LoadResultsPayload = {
  surveyId: string;
};
export const loadResults = actionCreator.async<LoadResultsPayload, PublicSurveyResult[]>('LOAD_SURVEY_RESULTS');

export const loadResultsWorker = bindThunkAction(loadResults, async (options, dispatch, getState) => {
  const url = `${apiBaseURL}/surveys/${options.surveyId}/results`;

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('Survey not found');
  } else if (response.status !== 200) {
    throw new Error(`Unknown error: ${response.status}`);
  }

  const surveyResults: PublicSurveyResult[] = await response.json();

  return surveyResults.map(result => {
    return {
      ...result,
      submissionDate: new Date(result.submissionDate),
    };
  });
});
