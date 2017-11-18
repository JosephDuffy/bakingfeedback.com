import Question from './Question';

export default interface Survey {

  readonly id: string;

  readonly questions: [Question];

}
