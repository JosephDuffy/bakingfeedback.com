import * as moment from 'moment';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { loadResultsWorker } from '../../actions/surveyResults';
import { loadSurveyWorker } from '../../actions/surveys';
import PublicSurveyResult from '../../interfaces/PublicSurveyResult';
import Question from '../../interfaces/Question';
import Survey from '../../interfaces/Survey';

export namespace SurveyResults {
  export type Props = SurveyResults.DispatchProps & RouteProps;

  export interface DispatchProps {

    survey?: Survey;

    isLoadingSurvey: boolean;

    results?: PublicSurveyResult[];

    isLoadingResults: boolean;

    loadError?: Error;

    loadSurvey: () => void;

    loadResults: () => void;
  }

  export type RouteProps = RouteComponentProps<RouteParameters>;

  export interface RouteParameters {
    surveyId: string;
  }

  export interface State {}
}

export class SurveyResults extends React.Component<SurveyResults.Props, SurveyResults.State> {

  constructor(props: SurveyResults.Props) {
    super(props);

    this.state = {};
  }

  public componentWillMount() {
    this.checkProps(this.props);
  }

  public componentWillReceiveProps(nextProps: SurveyResults.Props) {
    this.checkProps(nextProps);
  }

  public render() {
    if (this.props.isLoadingSurvey || this.props.isLoadingResults) {
      return (
        <div>Fetching results...</div>
      );
    } else if (this.props.loadError) {
      return (
        <div>
          <h1>Error Loading Survey :(</h1>
          <div>{this.props.loadError.message}</div>
        </div>
      );
    } else if (!this.props.survey || !this.props.results) {
      return (
        <div>🤯🤯🤯</div>
      );
    }

    const { results, survey } = this.props;

    // survey.questions.map(question => {
    //   const flattenedInputs = new Array<Question.Input>().concat(...question.inputs);
    //   const allAnswers = new Array<{ [inputId: string]: any }>().concat(...results.map(result => result.answers));

    //   const inputs = flattenedInputs.map(input => {
    //     switch (input.type) {
    //     case 'images':
    //       const options = input.options as Question.ImagesOptions;
    //       const images = options.images;
    //       const answers = allAnswers.map(answer => answer[input.id]).map(answer => {
    //         if (typeof answer === 'string') {
    //           return answer;
    //         } else {
    //           return undefined;
    //         }
    //       }).filter(answer => answer !== undefined) as string[];
    //       const answerTotals: {
    //         [answer: string]: number | undefined,
    //       } = {};

    //       answers.forEach(answer => {
    //         let value = answerTotals[answer];
    //         if (typeof value === 'number') {
    //           value += 1;
    //         } else {
    //           value = 1;
    //         }
    //         answerTotals[answer] = value;
    //       });

    //       const maximumVotes = Object.keys(answerTotals).reduce((previous, current) => {
    //         const answerCount = answerTotals[current];

    //         if (answerCount === undefined) {
    //           return previous;
    //         }

    //         return answerCount > previous ? answerCount : previous;
    //       }, 0);
    //       const answerWidthPercent = 100 / images.length;

    //       const columns = images.map(image => {
    //         const votesForImage = answerTotals[image.id] || 0;
    //         const heightPercent = votesForImage / maximumVotes;
    //         return (
    //           <div className="column-container" style={{width: `${answerWidthPercent}%`, height: `${heightPercent}%`}}>

    //           </div>
    //         );
    //       });

    //       return (
    //         <div className="bar-chart">

    //         </div>
    //       );
    //     case 'checkbox':
    //       // There are no public surveys with checkbox questions, yet
    //       return undefined;
    //     case 'text':
    //       return undefined;
    //     }
    //   });
    // });

    // Sorted from newest to oldest
    const sortedResults = results.sort((a: PublicSurveyResult, b: PublicSurveyResult) => {
      return b.submissionDate.getTime() - a.submissionDate.getTime();
    });

    const resultElements = sortedResults.map((result: PublicSurveyResult) => {
      const questionAnswers = result.answers.map((answers, index) => {
        if (!answers) {
          return;
        }

        const question = survey.questions[index];
        const flattenedInputs = new Array<Question.Input>().concat(...question.inputs);

        const answersElements: JSX.Element[] = [];

        for (const questionId of Object.keys(answers)) {
          const answer = answers[questionId];
          // tslint:disable-next-line:no-shadowed-variable
          const input = flattenedInputs.find(input => input.id === questionId);
          const answerElementKey = `result-question-${index}-answer-${questionId}`;

          if (!input) {
            continue;
          }

          switch (input.type) {
          case 'images':
            const imageOptions = input.options as Question.ImagesOptions;
            const selectedImage = imageOptions.images.find(image => image.id === answer);

            if (!selectedImage) {
              break;
            }

            answersElements.push(
              <img key={answerElementKey} className="image-question-answer-image" src={selectedImage.url} />,
            );
            break;
          case 'text':
            const textOptions = input.options as Question.TextOptions;

            if (textOptions.label) {
              answersElements.push(
                <h4>{textOptions.label}</h4>,
              );
            }

            answersElements.push(
              <div key={answerElementKey} className="text-question-answer-text">
                {answer}
              </div>,
            );
            break;
          case 'checkbox':
            answersElements.push(
              <div key={answerElementKey} className="checkbox-question-answer">
                {answer ? 'Yes' : 'No'}
              </div>,
            );
            break;
          }
        }

        if (answersElements.length === 0) {
          return;
        }

        return (
          <div key={`result-question-${index}`} className="result-question-container">
            {question.title &&
              <h3>{question.title}</h3>
            }
            {answersElements}
          </div>
        );
      });

      // This could create a non-unique id. Maybe fix this some day?
      const containerElementKey = `results-container-${result.submissionDate.getTime()}-${result.displayName}`;

      return (
        <div key={containerElementKey} className="result-container">
          <h2>{result.displayName}</h2>
          <time dateTime={result.submissionDate.toISOString()}>{moment(result.submissionDate).format('MMMM Do YYYY, h:mm:ss a')}</time>
          <div className="result-questions-container">
            {questionAnswers}
          </div>
        </div>
      );
    });

    return (
      <div id="results-container">
        <h1>{survey.foodName + ' Feedback'}</h1>
        <div className="results-metadata">
          Results: {results.length}
        </div>
        {resultElements}
      </div>
    );
  }

  private checkProps(props: SurveyResults.Props) {
    if (!props.survey && !props.loadError && !props.isLoadingSurvey) {
      props.loadSurvey();
    }

    if (!props.results && !props.loadError && !props.isLoadingResults) {
      props.loadResults();
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: SurveyResults.Props): Partial<SurveyResults.DispatchProps> => {
  return {
    results: state.surveyResults.getIn(['cached', ownProps.match.params.surveyId]),
    isLoadingResults: state.surveyResults.get('loading').includes(ownProps.match.params.surveyId),
    survey: state.surveys.getIn(['cached', ownProps.match.params.surveyId]),
    isLoadingSurvey: state.surveys.get('loading').includes(ownProps.match.params.surveyId),
    loadError: state.surveys.getIn(['errors', ownProps.match.params.surveyId]) || state.surveyResults.getIn(['errors', ownProps.match.params.surveyId]),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<SurveyResults>, ownProps: SurveyResults.Props) => {
  return {
    loadSurvey: () => dispatch(loadSurveyWorker({ id: ownProps.match.params.surveyId })),
    loadResults: () => dispatch(loadResultsWorker({ surveyId: ownProps.match.params.surveyId })),
  };
};

const SurveyContainer = connect(mapStateToProps, mapDispatchToProps)(SurveyResults as any);

export default SurveyContainer;
