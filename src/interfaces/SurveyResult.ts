
export default interface SurveyResult {

  readonly surveyId: string;

  readonly answers: string[][];

  readonly name: string;

  readonly anonymous: boolean;

  readonly email?: string;

}
