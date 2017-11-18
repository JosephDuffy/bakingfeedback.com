import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';

import Question from '../interfaces/Question';
import Survey from '../interfaces/Survey';

const actionCreator = actionCreatorFactory();

export const selectQuestion = actionCreator<number>('SELECT_QUESTION');

export type AnswerQuestionPlayload = {
  questionNumber: number;
  answer: string;
};
export const answerQuestion = actionCreator<AnswerQuestionPlayload>('ANSWER_QUESTION');

export const loadSurvey = actionCreator.async<{}, Survey>('LOAD_SURVEY');

export const loadSurveyWorker = bindThunkAction(loadSurvey, async (options, dispatch, getState) => {
  // TODO: Load via network

  return {
    id: '12345-67890-12345',
    questions: [
      {
        title: 'What did you think of the cheesecake?',
        input: {
          type: Question.InputType.Images,
          options: {
            images: [
              {
                id: '1',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f922.svg',
                title: 'Vote for "really disliked it"',
                alt: 'nauseated face emoji',
              },
              {
                id: '2',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f641.svg',
                title: 'Vote for "disliked it"',
                alt: 'slightly frowning face emoji',
              },
              {
                id: '3',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f615.svg',
                title: 'Vote for "neither liked it nor disliked it"',
                alt: 'confused face emoji',
              },
              {
                id: '4',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f60b.svg',
                title: 'Vote for "liked it"',
                alt: 'face savoring food emoji',
              },
              {
                id: '5',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f924.svg',
                title: 'Vote for "really liked it"',
                alt: 'drooling face emoji',
              },
            ],
          },
        },
      },
    ],
  } as Survey;
});
