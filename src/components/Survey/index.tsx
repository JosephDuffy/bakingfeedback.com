import * as Immutable from 'immutable';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { loadSurveyWorker, updateQuestionAnswer } from '../../actions/surveys';
import { apiBaseURL } from '../../config';
import { default as QuestionInterface } from '../../interfaces/Question';
import { default as SurveyInterface } from '../../interfaces/Survey';
import { SurveyQuestions } from '../../reducers/surveyAnswers';
import Question from '../Question';
import QuestionIndicator from '../QuestionIndicator';

export namespace Survey {
  export type Props = Survey.DispatchProps & Survey.RouteProps;

  export interface DispatchProps {
    answers: SurveyQuestions;
    survey?: SurveyInterface;
    loadError?: Error,
    loading: boolean,
    loadSurvey: () => void;
    updateQuestionAnswer: (questionIndex: number, inputId: string, answer: string) => void;
  }

  export type RouteProps = RouteComponentProps<RouteParameters>;

  export interface RouteParameters {
    surveyId: string;
    questionNumber?: string;
  }

  export interface State {
    submitting: boolean;
    submissionError?: Error;
  }
}

export class Survey extends React.Component<Survey.Props, Survey.State> {

  private get currentQuestionIndex() {
    if (this.currentStageIndex === 0) {
      return -1;
    }

    return this.currentStageIndex - 1;
  }

  private get currentStageIndex() {
    if (this.props.match.params.questionNumber === undefined) {
      return 0;
    }

    return Number.parseInt(this.props.match.params.questionNumber, 10);
  }

  private get lastQuestionNumberUnlocked() {
    if (!this.props.survey) {
      return 1;
    }

    // +1 for submit question
    const totalQuestions = this.props.survey.questions.length + 1;

    for (let questionNumber = 1; questionNumber <= totalQuestions; questionNumber++) {
      if (!this.props.answers.hasOwnProperty(questionNumber)) {
        return questionNumber;
      }
    }

    return totalQuestions;
  }

  private get isOnSubmit(): boolean {
    if (!this.props.survey || this.currentQuestionIndex < 0) {
      return false;
    }

    const { survey } = this.props;
    const { questions } = survey;

    return this.currentQuestionIndex >= questions.length;
  }

  constructor(props: Survey.Props) {
    super(props);

    this.state = {
      submitting: false,
    };
  }

  public componentWillMount() {
    this.checkProps(this.props);
  }

  public componentWillReceiveProps(nextProps: Survey.Props) {
    this.checkProps(nextProps);
  }

  public render() {
    if (this.props.loading) {
      return (
        <div>Loading survey...</div>
      );
    } else if (this.props.loadError) {
      return (
        <div>
          <h1>Error Loading Survey :(</h1>
          <div>{this.props.loadError.message}</div>
        </div>
      );
    } else if (!this.props.survey) {
      return (
        <div>🤯🤯🤯</div>
      );
    }

    const { answers, survey } = this.props;
    const { questions } = survey;
    const { questionNumber } = this.props.match.params;

    if (this.currentQuestionIndex > answers.count() && !this.isOnSubmit) {
      return (
        <Redirect
          to={this.urlForStage(answers.count())}
          push={false}
        />
      );
    } else if (questionNumber !== undefined && `${this.currentQuestionIndex + 1}` !== questionNumber) {
      // `Number.parseInt` will happily parse `1-and-lots-more` as `1`
      return (
        <Redirect
          to={this.urlForStage(this.currentStageIndex)}
          push={false}
        />
      );
    }

    const submitQuestion: QuestionInterface = {
      title: 'About You',
      inputs: [
        [
          {
            id: 'name',
            type: 'text',
            options: {
              label: 'Name',
              kind: 'text',
              minimumCharacters: 2,
              autoCapitalize: 'words',
            },
          },
          {
            id: 'showName',
            type: 'checkbox',
            options: {
              label: 'Show publicly',
              required: false,
              defaultValue: false,
              checkedHint: 'Uncheck to be shown as "Anonymous" on results',
              uncheckedHint: 'Leave unchecked to be shown as "Anonymous" on results',
            },
          },
        ],
        {
          id: 'email',
          type: 'text',
          options: {
            label: 'Email Address',
            kind: 'email',
            minimumCharacters: 6,
            hint: 'Can never be seen (gets hashed). I will not send you email. May be used in the future to enable accounts/link results',
          },
        },
      ],
    };

    let contentComponent: JSX.Element;

    if (questionNumber === undefined) {
      contentComponent = (
        <div id="current-question-container">
          <h1>{survey.introTitle}</h1>
          <div dangerouslySetInnerHTML={{__html: survey.introDescription}} />
          <button
            className="submit-button"
            onClick={ () => this.changeToStage(1) }
          >
           Let's go!
          </button>
        </div>
      );
    } else {

      const currentQuestionAnswers = answers.get(this.currentQuestionIndex) || Immutable.Map();

      let question: QuestionInterface;
      let nextButtonText: string | undefined;

      if (this.isOnSubmit) {
        question = submitQuestion;
        nextButtonText = 'Submit';
      } else {
        question = questions[this.currentQuestionIndex];
      }
      const formErrors = this.state.submissionError ? [`Submission error: ${this.state.submissionError.message}`] : undefined;

      contentComponent = (
        <div id="current-question-container">
          <Question
            // Key is needed to tell React that every `Question` is unique, so that
            // events from the previous question don't also happen for the next one,
            // e.g., when answering am image question and moving to another image question
            key={`question-${this.currentQuestionIndex}`}
            question={question}
            answers={currentQuestionAnswers}
            formErrors={formErrors}
            onAnswerUpdated={this.props.updateQuestionAnswer.bind(this, this.currentQuestionIndex)}
            onSubmit={this.handleQuestionSubmit}
            nextButtonText={nextButtonText}
          />
        </div>
      );
    }

    const stageTitles = [
      'Intro',
      ...questions.map((question, index) => `Question ${index + 1}`),
      'Submit',
    ];

    return (
      <div id="questions-container">
        {contentComponent}
        <nav id="question-indicators-container">
          {this.stageIndicators(stageTitles)}
        </nav>
      </div>
    );
  }

  private handleQuestionSubmit = () => {
    if (this.isOnSubmit) {
      if (this.state.submitting || !this.props.survey) {
        return;
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
      });

      const { answers, survey } = this.props;
      const lastAnswer = answers.last();

      if (!lastAnswer) {
        return;
      }

      const name = lastAnswer.get('name');
      const email = lastAnswer.get('email');
      const showName = lastAnswer.get('showName');

      const body = JSON.stringify({
        answers: answers.pop().map(answer => answer === null ? '' : answer),
        name,
        email,
        showName,
      });

      const options = {
        method: 'POST',
        headers,
        body,
      };

      this.setState({
        submitting: true,
        submissionError: undefined,
      });

      fetch(`${apiBaseURL}/surveys/${survey.id}/results`, options)
        .then(response => {
          if (response.status === 201) {
            this.props.history.push(`/${this.props.match.params.surveyId}/completed`);
          } else {
            response.json()
              .then(json => {
                if (json.message) {
                  console.error(json);

                  this.setState({
                    submitting: false,
                    submissionError: new Error(json.message),
                  });
                } else {
                  throw new Error('Response was not a 201 but did not contain a message');
                }
              })
              .catch(caughtError => console.error('response', response));
          }
        })
        .catch(error => this.setState({
            submitting: false,
            submissionError: error,
          }));
    } else {
      if (this.currentQuestionIndex > -1) {
        this.changeToStage(this.currentStageIndex + 1);
      }
    }
  }

  private stageIndicators(titles: string[]) {
    return titles.map((title, index) => {
      let style: QuestionIndicator.Style;
      let enableClicking: boolean;

      if (this.currentStageIndex === index) {
        style = 'current';
        enableClicking = false;
      } else if (index === 1 && this.currentStageIndex === 0) {
        style = 'unlocked';
        enableClicking = true;
      } else if (this.props.answers.count() >= index - 1) {
        style = 'complete';
        enableClicking = true;
      } else {
        style = 'locked';
        enableClicking = false;
      }

      return (
        <QuestionIndicator
          key={index}
          text={title}
          style={style}
          href={enableClicking ? this.urlForStage(index) : undefined}
        />
      );
    });
  }

  private urlForStage(stageIndex: number) {
    if (stageIndex === 0) {
      return `/${this.props.match.params.surveyId}/`;
    } else {
      return `/${this.props.match.params.surveyId}/question-${stageIndex}`;
    }
  }

  private changeToStage(stageIndex: number) {
    if (this.state.submitting) {
      return;
    }

    this.props.history.push(this.urlForStage(stageIndex));
  }

  private checkProps(props: Survey.Props) {
    if (!props.survey && !props.loadError && !props.loading) {
      props.loadSurvey();
    } else if (props.match.params.questionNumber !== this.props.match.params.questionNumber) {
      this.setState({
        submissionError: undefined,
      });
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: Survey.Props) => {
  return {
    answers: state.surveyAnswers.get(ownProps.match.params.surveyId) || Immutable.List(),
    survey: state.surveys.getIn(['cached', ownProps.match.params.surveyId]),
    loadError: state.surveys.getIn(['errors', ownProps.match.params.surveyId]),
    loading: state.surveys.get('loading').includes(ownProps.match.params.surveyId),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Survey>, ownProps: Survey.Props) => {
  return {
    loadSurvey: () => dispatch(loadSurveyWorker({ id: ownProps.match.params.surveyId })),
    updateQuestionAnswer: (questionIndex: number, inputId: string, answer: string) => {
      dispatch(updateQuestionAnswer({
        surveyId: ownProps.match.params.surveyId,
        questionIndex,
        inputId,
        answer,
      }));
    },
  };
};

const SurveyContainer = connect(mapStateToProps, mapDispatchToProps)(Survey as any);

export default SurveyContainer;
