import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { loadSurveyWorker, updateQuestionAnswer } from '../../actions/surveys';
import { apiBaseURL } from '../../config';
import { default as QuestionInterface } from '../../interfaces/Question';
import { default as SurveyInterface } from '../../interfaces/Survey';
import Question from '../Question';
import QuestionIndicator from '../QuestionIndicator';

export namespace Survey {
  export type Props = Survey.DispatchProps & Survey.RouteProps;

  export interface DispatchProps {
    answers: Array<{
      [inputId: string]: string,
    }>;
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
    if (this.props.match.params.questionNumber === undefined) {
      return -1;
    }

    return Number.parseInt(this.props.match.params.questionNumber, 10) - 1;
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
    } else if (!this.props.match.params.questionNumber) {
      return (
        <Redirect
          to={this.urlForQuestion(1)}
          push={false}
        />
      );
    }

    const { answers, survey } = this.props;
    const { questions } = survey;

    if (this.currentQuestionIndex < 0) {
      return (
        <Redirect
          to={this.urlForQuestion(1)}
          push={false}
        />
      );
    } else if (this.currentQuestionIndex > answers.length) {
      return (
        <Redirect
          to={this.urlForQuestion(answers.length + 1)}
          push={false}
        />
      );
    } else if (`${this.currentQuestionIndex + 1}` !== this.props.match.params.questionNumber) {
      // `Number.parseInt` will happily parse `1-and-lots-more` as `1`
      return (
        <Redirect
          to={this.urlForQuestion(this.currentQuestionIndex + 1)}
          push={false}
        />
      );
    }

    const currentQuestionAnswers = answers[this.currentQuestionIndex] || {};

    const submitQuestion: QuestionInterface = {
      title: 'About You',
      inputs: [
        {
          id: 'name',
          type: 'text',
          options: {
            label: 'Name',
            allowMultipleLines: false,
            minimumCharacters: 2,
          },
        },
        {
          id: 'email',
          type: 'text',
          options: {
            label: 'Email Address',
            allowMultipleLines: false,
            hint: 'Will never be shown publicly; may be used in future to enable accounts',
          },
        },
      ],
    };

    let question: QuestionInterface;
    let nextButtonText: string | undefined;

    if (this.isOnSubmit) {
      question = submitQuestion;
      nextButtonText = 'Submit';
    } else {
      question = questions[this.currentQuestionIndex];
    }

    const allQuestions = survey.questions.concat(submitQuestion);

    return (
      <div id="questions-container">
        {this.state.submissionError &&
          <div className="form-error">{this.state.submissionError.message}</div>
        }
        <div id="current-question-container">
          <Question
            // Key is needed to tell React that every `Question` is unique, so that
            // events from the previous question don't also happen for the next one,
            // e.g., when answering a picture and moving to another picture question
            key={`question-${this.currentQuestionIndex}`}
            question={question}
            answers={currentQuestionAnswers}
            onAnswerUpdated={this.onAnswerUpdated.bind(this, this.currentQuestionIndex)}
            onSubmit={this.handleQuestionSubmit}
            nextButtonText={nextButtonText}
          />
        </div>
        <nav id="question-indicators-container">
          {this.questionIndicators(allQuestions)}
        </nav>
      </div>
    );
  }

  private onAnswerUpdated(questionIndex: number, inputId: string, answer: string) {
    this.props.updateQuestionAnswer(questionIndex, inputId, answer);
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
      const lastAnswer = answers.pop();

      if (!lastAnswer) {
        return;
      }

      const name = lastAnswer.name;
      const email = lastAnswer.email;

      const body = JSON.stringify({
        answers,
        name,
        email,
        anonymous: true,
      });

      const options = {
        method: 'POST',
        headers,
        body,
      };

      this.setState({
        submitting: true,
      });

      fetch(`${apiBaseURL}/surveys/${survey.id}/results`, options)
        .then(response => {
          if (response.status !== 201) {
            console.error(response);

            this.setState({
              submitting: false,
              submissionError: new Error('Failed to submit survey. Please try again.'),
            });
            return;
          }

          this.props.history.push('/survey-complete');
        })
        .catch(error => {
          this.setState({
            submitting: false,
            submissionError: error,
          });
        });
    } else {
      if (this.currentQuestionIndex > -1) {
        this.changeToQuestion(this.currentQuestionIndex + 2);
      }
    }
  }

  private questionIndicators(allQuestions: QuestionInterface[]) {
    return allQuestions.map((question, index) => {
      const questionNumber = index + 1;
      let style: QuestionIndicator.Style;
      let enableClicking: boolean;

      if (this.currentQuestionIndex === index) {
        style = 'current';
        enableClicking = false;
      } else if (this.props.answers.length >= index) {
        style = 'complete';
        enableClicking = true;
      } else {
        style = 'locked';
        enableClicking = false;
      }

      return (
        <QuestionIndicator
          key={index}
          text={`Question ${questionNumber}`}
          style={style}
          href={enableClicking ? this.urlForQuestion(questionNumber) : undefined}
        />
      );
    });
  }

  private urlForQuestion(questionNumber: number) {
    return `/${this.props.match.params.surveyId}/question-${questionNumber}`;
  }

  private changeToQuestion(questionNumber: number) {
    this.props.history.push(this.urlForQuestion(questionNumber));
  }

  private checkProps(props: Survey.Props) {
    if (!props.survey && !props.loadError && !props.loading) {
      props.loadSurvey();
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: Survey.Props) => {
  return {
    ...state.surveys.surveys[ownProps.match.params.surveyId],
    answers: state.surveyAnswers[ownProps.match.params.surveyId] || [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Survey>, ownProps: Survey.Props) => {
  return {
    loadSurvey: () => {
      dispatch(loadSurveyWorker({ id: ownProps.match.params.surveyId }));
    },
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
