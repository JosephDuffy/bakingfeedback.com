
export default interface SurveyResult {

  readonly surveyId: string;

  readonly answers: Array<{ [inputId: string]: any }>;

  readonly name: string;

  readonly anonymous: boolean;

  readonly email?: string;

}
