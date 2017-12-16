import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

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
    formErrors?: string[];

    onAnswerUpdated: (inputId: string, answer: string) => void;
    onSubmit: () => void;
  }

  export interface State {
    tryingSubmit: boolean;
  }

  export interface Error {
    answerIndex: number;
    text: string;
  }
}

class Question extends React.Component<Question.Props, Question.State> {

  private inputElements: {
    [inputId: string]: QuestionInputComponent<any>,
  } = {};

  constructor(props: Question.Props) {
    super(props);

    this.state = {
      tryingSubmit: false,
    };
  }

  public render() {
    const { formErrors, question } = this.props;

    const inputs = question.inputs.map(input => {
      const answer = this.props.answers[input.id];

      switch (input.type) {
        case 'images':
          return (
            <ImageQuestionInput
              key={input.id}
              ref={instance => this.inputElements[input.id] = instance as any}
              answer={answer}
              options={input.options as QuestionInterface.ImagesOptions}
              updateAnswer={this.handleAnswerUpdated.bind(this, input.id)}
              trySubmit={this.trySubmit.bind(this)}
            />
          );
        case 'text':
          return (
            <TextQuestionInput
              key={input.id}
              ref={instance => this.inputElements[input.id] = instance as any}
              answer={answer}
              options={input.options as QuestionInterface.TextOptions}
              updateAnswer={this.handleAnswerUpdated.bind(this, input.id)}
              trySubmit={this.trySubmit.bind(this)}
            />
          );
      }
    });

    const renderSubmitButton = question.inputs.length > 1 || question.inputs[0].type !== 'images';

    return (
      <div className="question-container">
        {question.title &&
          <h1>{question.title}</h1>
        }
        {formErrors &&
          formErrors.map((error, index) => <div key={`form-error-${index}}`} className="form-error">{error}</div>)
        }
        <form
          className="question-form"
          onSubmit={event => { this.trySubmit(); event.preventDefault(); return false; }}
        >
          {inputs}
          <button
            type="button"
            className="submit-button"
            onClick={this.trySubmit}
            hidden={!renderSubmitButton ? true : undefined}
          >
            {this.props.nextButtonText || 'Next'}
          </button>
          {/* Used to allow submitting via hitting return */}
          <input
            type="submit"
            hidden={true}
          />
        </form>
      </div>
    );
  }

  private handleAnswerUpdated(inputId: string, answer: string) {
    this.props.onAnswerUpdated(inputId, answer);

    if (answer !== '' && this.props.question.inputs.length === 1 && this.props.question.inputs[0].type === 'images') {
      this.trySubmit();
    }
  }

  private validateAllAnswers(): { [inputId: string]: string[]; } {
    const { answers } = this.props;
    const allErrors: {
      [inputId: string]: string[];
    } = {};

    // `Array.from` is a hack: https://github.com/Microsoft/TypeScript/issues/11209#issuecomment-303152976
    for (const inputId of Array.from(Object.keys(answers))) {
      const answer = answers[inputId];
      const component = this.inputElements[inputId];
      const errors = component.validate(answer, true);
      if (errors.length > 0) {
        allErrors[inputId] = errors;
      }
    }

    return allErrors;
  }

  private trySubmit = () => {
    const errors = this.validateAllAnswers();

    if (Object.keys(errors).length === 0) {
      this.props.onSubmit();
    }
  }
}

export default Question;
