import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { loadSurveyWorker, updateQuestionAnswer } from '../../actions/activeSurvey';
import { default as QuestionInterface } from '../../interfaces/Question';
import { default as SurveyInterface } from '../../interfaces/Survey';
import Question from '../Question';
import QuestionIndicator from '../QuestionIndicator';

export namespace Survey {
  export type AllProps = Survey.Props & Survey.DispatchProps & Survey.RouteProps;

  export interface Props {
    answers: string[][];
    survey?: SurveyInterface;
  }

  export interface DispatchProps {
    loadSurvey: () => void;
    updateQuestionAnswer: (questionIndex: number, answerIndex: number, answer: string) => void;
  }

  export type RouteProps = RouteComponentProps<RouteParameters>;

  export interface RouteParameters {
    questionNumber?: string;
  }

  export interface State {
    loadingSurvey: boolean;
    loadingError?: Error;
  }
}

export class Survey extends React.Component<Survey.AllProps, Survey.State> {

  private get currentQuestionIndex() {
    if (this.props.match.params.questionNumber === undefined) {
      return -1;
    }

    return Number.parseInt(this.props.match.params.questionNumber, 10) - 1;
  }

  private get isOnSubmit(): boolean {
    if (!this.props.survey || this.currentQuestionIndex < 0) {
      return false;
    }

    const { survey } = this.props;
    const { questions } = survey;

    return this.currentQuestionIndex >= questions.length;
  }

  public componentWillMount() {
    if (!this.props.survey) {
      this.props.loadSurvey();
    }
  }

  public render() {
    if (!this.props.survey) {
      return (
        <div>Loading survey...</div>
      );
    }

    const { answers, survey } = this.props;
    const { questions } = survey;

    if (this.currentQuestionIndex < 0) {
      return (
        <Redirect to="/question/1" />
      );
    } else if (this.currentQuestionIndex > answers.length) {
      return (
        <Redirect to={`/question/${answers.length + 1}`} />
      );
    }

    const currentQuestionAnswers = answers[this.currentQuestionIndex] || [];

    const submitQuestion: QuestionInterface = {
      id: 'submit',
      title: 'About You',
      inputs: [
        {
          type: QuestionInterface.InputType.Text,
          options: {
            label: 'Name',
            allowMultipleLines: false,
            minimumCharacters: 2,
          },
        },
        {
          type: QuestionInterface.InputType.Text,
          options: {
            label: 'Email Address',
            allowMultipleLines: false,
            hint: 'Will never be shown publicly; may be used in future to enable accounts',
          },
        },
      ],
    };

    const content = (() => {
      if (this.isOnSubmit) {

        return (
          <Question
            question={submitQuestion}
            answers={currentQuestionAnswers}
            onAnswerUpdated={this.onAnswerUpdated.bind(this, this.currentQuestionIndex)}
            onSubmit={this.handleQuestionSubmit}
          />
        );
      } else {
        const question = questions[this.currentQuestionIndex];
        return (
          <Question
            question={question}
            answers={currentQuestionAnswers}
            onAnswerUpdated={this.onAnswerUpdated.bind(this, this.currentQuestionIndex)}
            onSubmit={this.handleQuestionSubmit}
          />
        );
      }
    })();

    const allQuestions = survey.questions.concat(submitQuestion);

    return (
      <div id="questions-container">
        <div id="current-question-container">
          {content}
        </div>
        <nav id="question-indicators-container">
          {this.questionIndicators(allQuestions)}
        </nav>
      </div>
    );
  }

  private onAnswerUpdated(questionIndex: number, answerIndex: number, answer: string) {
    this.props.updateQuestionAnswer(questionIndex, answerIndex, answer);
  }

  private handleQuestionSubmit = () => {
    if (this.isOnSubmit) {
      // TODO: Submit
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
    return `/question/${questionNumber}`;
  }

  private changeToQuestion(questionNumber: number) {
    this.props.history.push(this.urlForQuestion(questionNumber));
  }
}

const mapStateToProps = (state: AppState, ownProps: Survey.Props) => {
  return state.activeSurvey;
};

const mapDispatchToProps = (dispatch: Dispatch<Survey>, ownProps: Survey.Props) => {
  return {
    loadSurvey: () => {
      dispatch(loadSurveyWorker({}));
    },
    updateQuestionAnswer: (questionIndex: number, answerIndex: number, answer: string) => {
      dispatch(updateQuestionAnswer({questionIndex, answerIndex, answer}));
    },
  };
};

const SurveyContainer = connect(mapStateToProps, mapDispatchToProps)(Survey as any);

export default SurveyContainer;
