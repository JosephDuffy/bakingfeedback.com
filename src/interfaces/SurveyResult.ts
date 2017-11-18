
export default interface SurveyResult {

  readonly surveyId: string;

  readonly answers: any[];

  readonly public: boolean;

  readonly name?: string;

  readonly email?: string;

}
