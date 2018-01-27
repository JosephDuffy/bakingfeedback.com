import Question from './Question';

export default interface Survey {

  readonly id: string;

  readonly introTitle: string;

  readonly introDescription: string;

  readonly imageURL?: string;

  readonly questions: [Question];

}
