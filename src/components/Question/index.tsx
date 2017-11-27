import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';

import ImageQuestionInput from '../ImageQuestionInput';
import TextQuestionInput from '../TextQuestionInput';

namespace Question {
  export interface Props {
    question: QuestionInterface;
    answers: string[];

    onAnswerUpdated: (index: number, answer: string) => void;
    onSubmit: () => void;
  }

  export interface State {
    errors: string[][];
    tryingSubmit: boolean;
  }

  export interface Error {
    answerIndex: number;
    text: string;
  }
}

class Question extends React.Component<Question.Props, Question.State> {

  constructor(props: Question.Props) {
    super(props);

    this.state = {
      errors: new Array(props.question.inputs.length),
      tryingSubmit: false,
    };
  }

  public componentWillReceiveProps(nextProps: Question.Props) {
    if (this.props.question !== nextProps.question) {
      this.setState({
        errors: new Array(nextProps.question.inputs.length),
      });
    }
  }

  public render() {
    const { question } = this.props;

    const inputs = question.inputs.map((input, index) => {
      const answer = this.props.answers[index];

      // TODO: Render errors

      switch (input.type) {
        case 'images':
          return (
            <ImageQuestionInput answer={answer} key={index} options={input.options as QuestionInterface.ImagesOptions} updateAnswer={this.handleAnswerUpdated.bind(this, index)} trySubmit={this.trySubmit.bind(this)} />
          );
        case 'text':
          return (
            <TextQuestionInput answer={answer} key={index} options={input.options as QuestionInterface.TextOptions} updateAnswer={this.handleAnswerUpdated.bind(this, index)} trySubmit={this.trySubmit.bind(this)} />
          );
      }
    });

    const renderSubmitButton = question.inputs.length > 1 || question.inputs[0].type !== 'images';

    return (
      <div className="question-container">
        {question.title &&
          <h1>{question.title}</h1>
        }
        <form
          className="question-form"
          onSubmit={event => { this.trySubmit(); event.preventDefault(); return false; }}
        >
          {inputs}
          <input
            type="submit"
            className="submit-button"
            onClick={this.trySubmit}
            value="Submit"
            hidden={!renderSubmitButton ? true : undefined}
          />
        </form>
      </div>
    );
  }

  private handleAnswerUpdated(index: number, answer: string, validate: boolean, trySubmit: boolean = false) {
    this.props.onAnswerUpdated(index, answer);

    if (trySubmit) {
      this.trySubmit();
      return;
    }

    const performValidation = validate || this.state.errors[index].length > 0;

    if (performValidation) {
      const errors = this.validateAnswer(index, answer);

      this.setState({
        errors: {
          ...this.state.errors,
          [index]: errors,
        },
      });
    }
  }

  private validateAnswer(answerIndex: number, answer: string): string[] {
    const input = this.props.question.inputs[answerIndex];
    const errors: string[] = [];

    switch (input.type) {
      case 'images':
        if (answer === '') {
          errors.push('An answer is required');
        }
        break;
      case 'text':
        const options = input.options as QuestionInterface.TextOptions;

        if (options.minimumCharacters && answer.length < options.minimumCharacters) {
          const suffix = options.minimumCharacters === 1 ? ' long' : '\'s long';
          errors.push(`Answer must be at least ${options.minimumCharacters} character${suffix}`);
        }

        // TODO: Validate other rules
    }

    return errors;
  }

  private validateAllAnswers(): string[][] {
    const { answers } = this.props;
    const allErrors: string[][] = [];

    // `Array.from` is a hack: https://github.com/Microsoft/TypeScript/issues/11209#issuecomment-303152976
    for (const index of Array.from(answers.keys())) {
      const answer = answers[index];
      const errors = this.validateAnswer(index, answer);
      if (errors.length > 0) {
        allErrors[index] = errors;
      }
    }

    return allErrors;
  }

  private trySubmit = () => {
    const errors = this.validateAllAnswers();

    this.setState({
      errors,
    });

    if (errors.length === 0) {
      this.props.onSubmit();
    }
  }
}

export default Question;
