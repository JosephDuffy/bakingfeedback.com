
export default interface PublicSurveyResult {

  readonly answers: Array<{ [inputId: string]: string | boolean }>;

  readonly displayName: string;

  readonly submissionDate: Date;

}
