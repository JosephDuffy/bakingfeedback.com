import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { loadSurveyWorker, selectQuestion, updateQuestionAnswer } from '../../actions/activeSurvey';
import { default as QuestionInterface } from '../../interfaces/Question';
import { default as SurveyInterface } from '../../interfaces/Survey';
import Question from '../Question';
import QuestionIndicator from '../QuestionIndicator';

export namespace Survey {
  export interface Props extends RouteComponentProps<{}> {
    currentQuestionIndex: number;
    answers: string[][],
    survey?: SurveyInterface;
    loadSurvey: () => void;
    updateQuestionAnswer: (questionIndex: number, answerIndex: number, answer: string) => void;
    selectQuestion: (questionNumber: number) => void;
  }

  export interface State {
    loadingSurvey: boolean;
    loadingError?: Error;
  }
}

export class Survey extends React.Component<Readonly<Survey.Props>, Readonly<Survey.State>> {

  private get isOnSubmit(): boolean {
    if (!this.props.survey) {
      return false;
    }

    const { currentQuestionIndex, survey } = this.props;
    const { questions } = survey;

    return currentQuestionIndex >= questions.length;
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

    const { currentQuestionIndex, survey } = this.props;
    const { questions } = survey;
    const currentQuestionAnswers = this.props.answers[currentQuestionIndex] || [];

    const content = (() => {
      if (this.isOnSubmit) {
        const submitQuestion: QuestionInterface = {
          id: 'submit',
          title: 'Submit',
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

        return (
          <Question
            question={submitQuestion}
            answers={currentQuestionAnswers}
            onAnswerUpdated={this.onAnswerUpdated.bind(this, currentQuestionIndex)}
            onSubmit={this.onSubmit}
          />
        );
      } else {
        const question = questions[currentQuestionIndex];
        return (
          <Question
            question={question}
            answers={currentQuestionAnswers}
            onAnswerUpdated={this.onAnswerUpdated.bind(this, currentQuestionIndex)}
            onSubmit={this.onSubmit}
          />
        );
      }
    })();

    const numberOfQuestions = questions.length;
    const enableSubmit = this.props.answers.length >= questions.length;

    return (
      <div id="questions-container">
        <div id="question-container">
          {content}
        </div>
        <nav id="question-indicators-container">
          {this.questionIndicators()}
          <QuestionIndicator
            text="Submit"
            style={this.isOnSubmit ? 'current' : enableSubmit ? 'complete' : 'locked'}
            onClick={enableSubmit && !this.isOnSubmit ? this.props.selectQuestion.bind(this, numberOfQuestions) : undefined}
          />
        </nav>
      </div>
    );
  }

  private onAnswerUpdated(questionIndex: number, answerIndex: number, answer: string) {
    this.props.updateQuestionAnswer(questionIndex, answerIndex, answer);
  }

  private onSubmit() {
    if (this.isOnSubmit) {
      // TODO: Submit
    } else {
      this.props.selectQuestion(this.props.currentQuestionIndex + 1);
    }
  }

  private questionIndicators() {
    if (!this.props.survey) {
      return;
    }

    return this.props.survey.questions.map((question, index) => {
      let style: QuestionIndicator.Style;
      let enableClicking: boolean;

      if (this.props.currentQuestionIndex === index) {
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
          text={`Question ${index + 1}`}
          style={style}
          onClick={enableClicking ? this.props.selectQuestion.bind(this, index) : undefined}
        />
      );
    });
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
    selectQuestion: (questionNumber: number) => {
      dispatch(selectQuestion(questionNumber));
    },
  };
};

const SurveyContainer = connect(mapStateToProps, mapDispatchToProps)(Survey);

export default SurveyContainer;
