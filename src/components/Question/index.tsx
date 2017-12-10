import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';

import ImageQuestionInput from '../ImageQuestionInput';
import TextQuestionInput from '../TextQuestionInput';

namespace Question {
  export interface Props {
    question: QuestionInterface;
    answers: {
      [inputId: string]: string;
    };
    /// Will default to "Next"
    nextButtonText?: string;

    onAnswerUpdated: (inputId: string, answer: string) => void;
    onSubmit: () => void;
  }

  export interface State {
    errors: {
      [inputId: string]: string[];
    };
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
      errors: {},
      tryingSubmit: false,
    };
  }

  public componentWillReceiveProps(nextProps: Question.Props) {
    if (this.props.question !== nextProps.question) {
      this.setState({
        errors: {},
      });
    }
  }

  public render() {
    const { question } = this.props;

    const inputs = question.inputs.map(input => {
      const answer = this.props.answers[input.id];

      // TODO: Render errors

      switch (input.type) {
        case 'images':
          return (
            <ImageQuestionInput answer={answer} key={input.id} options={input.options as QuestionInterface.ImagesOptions} updateAnswer={this.handleAnswerUpdated.bind(this, input.id)} trySubmit={this.trySubmit.bind(this)} />
          );
        case 'text':
          return (
            <TextQuestionInput answer={answer} key={input.id} options={input.options as QuestionInterface.TextOptions} updateAnswer={this.handleAnswerUpdated.bind(this, input.id)} trySubmit={this.trySubmit.bind(this)} />
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
            value={this.props.nextButtonText || 'Next'}
            hidden={!renderSubmitButton ? true : undefined}
          />
        </form>
      </div>
    );
  }

  private handleAnswerUpdated(inputId: string, answer: string, validate: boolean, trySubmit: boolean = false) {
    this.props.onAnswerUpdated(inputId, answer);

    if (trySubmit) {
      this.trySubmit();
      return;
    }

    const performValidation = validate || this.state.errors[inputId].length > 0;

    if (performValidation) {
      const errors = this.validateAnswer(inputId, answer);

      this.setState({
        errors: {
          ...this.state.errors,
          [inputId]: errors,
        },
      });
    }
  }

  private validateAnswer(inputId: string, answer: string): string[] {
    const input = this.props.question.inputs.find(i => i.id === inputId);

    if (!input) {
      return [];
    }

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

  private validateAllAnswers(): { [inputId: string]: string[]; } {
    const { answers } = this.props;
    const allErrors: {
      [inputId: string]: string[];
    } = {};

    // `Array.from` is a hack: https://github.com/Microsoft/TypeScript/issues/11209#issuecomment-303152976
    for (const inputId of Array.from(Object.keys(answers))) {
      const answer = answers[inputId];
      const errors = this.validateAnswer(inputId, answer);
      if (errors.length > 0) {
        allErrors[inputId] = errors;
      }
    }

    return allErrors;
  }

  private trySubmit = () => {
    const errors = this.validateAllAnswers();

    this.setState({
      errors,
    });

    if (Object.keys(errors).length === 0) {
      this.props.onSubmit();
    }
  }
}

export default Question;
