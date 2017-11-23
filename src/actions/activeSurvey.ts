import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';

import Question from '../interfaces/Question';
import Survey from '../interfaces/Survey';

import confusedFace from '../assets/confused-face.svg';
import droolingFace from '../assets/drooling-face.svg';
import faceSavouringFood from '../assets/face-savouring-food.svg';
import nauseatedFace from '../assets/nauseated-face.svg';
import slightlyFrowningFace from '../assets/slightly-frowning-face.svg';

const actionCreator = actionCreatorFactory();

export const selectQuestion = actionCreator<number>('SELECT_QUESTION');

export type AnswerQuestionPlayload = {
  questionIndex: number;
  answerIndex: number;
  answer: string;
};
export const updateQuestionAnswer = actionCreator<AnswerQuestionPlayload>('UPDATE_QUESTION_ANSWER');

export const loadSurvey = actionCreator.async<{}, Survey>('LOAD_SURVEY');

export const loadSurveyWorker = bindThunkAction(loadSurvey, async (options, dispatch, getState) => {
  // TODO: Load via network

  return {
    id: '12345-67890-12345',
    questions: [
      {
        title: 'What did you think of the cheesecake?',
        inputs: [
          {
            type: Question.InputType.Images,
            options: {
              images: [
                {
                  id: '1',
                  url: nauseatedFace,
                  title: 'Vote for "really disliked it"',
                  alt: 'nauseated face emoji',
                },
                {
                  id: '2',
                  url: slightlyFrowningFace,
                  title: 'Vote for "disliked it"',
                  alt: 'slightly frowning face emoji',
                },
                {
                  id: '3',
                  url: confusedFace,
                  title: 'Vote for "neither liked it nor disliked it"',
                  alt: 'confused face emoji',
                },
                {
                  id: '4',
                  url: faceSavouringFood,
                  title: 'Vote for "liked it"',
                  alt: 'face savouring food emoji',
                },
                {
                  id: '5',
                  url: droolingFace,
                  title: 'Vote for "really liked it"',
                  alt: 'drooling face emoji',
                },
              ],
            },
          },
        ],
      },
    ],
  } as Survey;
});
