import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';
import { QuestionAnswers } from '../../reducers/surveyAnswers';

import CheckboxQuestionInput from '../CheckboxQuestionInput';
import ImageQuestionInput from '../ImageQuestionInput';
import TextQuestionInput from '../TextQuestionInput';

namespace Question {
  export interface Props {
    question: QuestionInterface;
    answers: QuestionAnswers;
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
    [inputId: string]: QuestionInputComponent<any, any>,
  } = {};

  private get flattenedInputs(): QuestionInterface.Input[] {
    return new Array<QuestionInterface.Input>().concat(...this.props.question.inputs);
  }

  constructor(props: Question.Props) {
    super(props);

    this.state = {
      tryingSubmit: false,
    };
  }

  public render() {
    const { formErrors, question } = this.props;

    const convertInputsToComponent = (inputs: QuestionInterface.Input[] | QuestionInterface.Input): JSX.Element => {
      if (Array.isArray(inputs)) {
        return (
          <div
            key={`form-group-${inputs.map(input => input.id).join('-')}`}
            className="form-group"
          >
            {inputs.map(convertInputsToComponent)}
          </div>
        );
      } else {
        const input = inputs;
        const answer = this.props.answers.get(input.id);

        switch (input.type) {
        case 'images':
          return (
            <ImageQuestionInput
              key={input.id}
              ref={instance => this.inputElements[input.id] = instance as any}
              className="question-container"
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
              className="question-container"
              answer={answer}
              options={input.options as QuestionInterface.TextOptions}
              updateAnswer={this.handleAnswerUpdated.bind(this, input.id)}
              trySubmit={this.trySubmit.bind(this)}
            />
          );
        case 'checkbox':
          return (
            <CheckboxQuestionInput
              key={input.id}
              ref={instance => this.inputElements[input.id] = instance as any}
              className="question-container"
              answer={answer}
              options={input.options as QuestionInterface.CheckboxOptions}
              updateAnswer={this.handleAnswerUpdated.bind(this, input.id)}
              trySubmit={this.trySubmit.bind(this)}
            />
          );
        default:
          throw new Error(`Invalid input type ${input.type}`);
        }
      }
    };

    const inputsComponent = question.inputs.map(convertInputsToComponent);

    const hasMoreThan1Input = question.inputs.length > 1;
    const firstInputIsImage = this.flattenedInputs[0].type !== 'images';
    const renderSubmitButton = hasMoreThan1Input || firstInputIsImage;

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
          {inputsComponent}
          <button
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

    if (answer !== '' && this.flattenedInputs.length === 1 && this.flattenedInputs[0].type === 'images') {
      this.trySubmit();
    }
  }

  private validateAllAnswers(): { [inputId: string]: string[]; } {
    const { answers } = this.props;
    const allErrors: {
      [inputId: string]: string[];
    } = {};

    this.flattenedInputs.forEach(input => {
      const component = this.inputElements[input.id];
      const answer = answers.get(input.id);
      const errors = component.validate(answer, true, true);
      if (errors.length > 0) {
        allErrors[input.id] = errors;
      }
    });

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
