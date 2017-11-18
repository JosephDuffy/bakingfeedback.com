import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../../reducers';
import './index.css';

import { answerQuestion, loadSurveyWorker, selectQuestion } from '../../actions/activeSurvey';
import { default as SurveyInterface } from '../../interfaces/Survey';
import Question from '../Question';
import QuestionIndicator from '../QuestionIndicator';

export namespace Survey {
  export interface Props extends RouteComponentProps<{}> {
    currentQuestion: number;
    answers: string[],
    survey?: SurveyInterface;
    loadSurvey: () => void;
    answerQuestion: (questionNumber: number, answer: string) => void;
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

    const { currentQuestion, survey } = this.props;
    const { questions } = survey;

    return currentQuestion >= questions.length;
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

    const { currentQuestion, survey } = this.props;
    const { questions } = survey;

    const content = (() => {
      if (this.isOnSubmit) {
        return (
          <div>You made it! 😱</div>
        );
      } else {
        const question = questions[currentQuestion];
        return [
          <h1 key="title">{question.title}</h1>,
          <Question key="question" question={question} onAnswerChosen={this.userChoseAnswer} />,
        ];
      }
    })();

    return (
      <div id="questions-container">
        <div id="question-container">
          {content}
        </div>
        <nav id="question-indicators-container">
          {this.questionIndicators()}
          <QuestionIndicator text="Submit" style={this.isOnSubmit ? 'current' : 'locked'}/>
        </nav>
      </div>
    );
  }

  private userChoseAnswer = (answer: string) => {
    this.props.answerQuestion(this.props.currentQuestion, answer);

    if (this.isOnSubmit) {
      // TODO: Submit
    } else {
      this.props.selectQuestion(this.props.currentQuestion + 1);
    }
  }

  private questionIndicators() {
    if (!this.props.survey) {
      return;
    }

    return this.props.survey.questions.map((question, index) => {
      let style: QuestionIndicator.Style;

      if (this.props.currentQuestion === index) {
        style = 'current';
      } else if (this.props.currentQuestion > index) {
        style = 'complete';
      } else {
        style = 'locked';
      }

      return <QuestionIndicator key={index} text={`Question ${index + 1}`} style={style}/>;
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
    answerQuestion: (questionNumber: number, answer: string) => {
      dispatch(answerQuestion({questionNumber, answer}));
    },
    selectQuestion: (questionNumber: number) => {
      dispatch(selectQuestion(questionNumber));
    },
  };
};

const SurveyContainer = connect(mapStateToProps, mapDispatchToProps)(Survey);

export default SurveyContainer;
