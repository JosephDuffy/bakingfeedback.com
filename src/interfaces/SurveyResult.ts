
export default interface SurveyResult {

  readonly surveyId: string;

  readonly answers: Array<{ [inputId: string]: string | boolean }>;

  readonly name: string;

  readonly showName: boolean;

  readonly email?: string;

}
