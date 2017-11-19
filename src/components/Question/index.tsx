import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';

namespace Question {
  export interface Props {
    question: QuestionInterface;

    onAnswerChosen: (answer: string) => void;
  }

  export interface State {
    answer: string;
    errors: string[];
  }
}

class Question extends React.Component<Question.Props, Question.State> {

  constructor(props: Question.Props) {
    super(props);

    this.state = {
      answer: '',
      errors: [],
    };
  }

  public render() {
    switch (this.props.question.input.type) {
      case QuestionInterface.InputType.Images:
        return this.renderEmojiQuestions(this.props.question.input.options as QuestionInterface.ImagesOptions);
      case QuestionInterface.InputType.TextField:
        return this.renderTextField(this.props.question.input.options as QuestionInterface.TextFieldOptions);
      default:
        return (
          <div>Unsupported question</div>
        );
    }
  }

  /**
   * Updates the answer to the question, optionally validating and submitting the answer.
   *
   * @param answer The new answer
   * @param action An optional action to perform. If 'validate', passed value will be
   *               validates (this is the default if there are errors). If 'submit' the
   *               passed value will first be validated, and if it passes, `onAnswerChosen`
   *               will be called after a render of the form has been completed.
   */
  private updateAnswer(answer: string, action?: 'validate' | 'submit') {
    const performValidation = action !== undefined || this.state.errors.length > 0;

    if (performValidation) {
      this.validateAnswer(answer, action === 'submit');
    } else {
      this.setState({
        answer,
      });
    }
  }

  private validateAnswer(answer: string, submitIfValid: boolean) {
    const errors: string[] = [];

    switch (this.props.question.input.type) {
      case QuestionInterface.InputType.Images:
        break;
      case QuestionInterface.InputType.TextField:
        const options = this.props.question.input.options as QuestionInterface.TextFieldOptions;

        if (options.minimumCharacters && answer.length < options.minimumCharacters) {
          const suffix = options.minimumCharacters === 1 ? ' long' : '\'s long';
          errors.push(`Answer must be at least ${options.minimumCharacters} character${suffix}`);
        }
      default:
        break;
    }

    this.setState({
      answer,
      errors,
    }, () => {
      if (errors.length === 0 && submitIfValid) {
        this.props.onAnswerChosen(answer);
      }
    });
  }

  private validateCurrentAnswer(submitIfValid: boolean) {
    this.validateAnswer(this.state.answer, submitIfValid);
  }

  private renderEmojiQuestions(options: QuestionInterface.ImagesOptions) {
    const { images } = options;

    const elements = images.map((image, index) => (
      <img
        key={index}
        src={image.url}
        title={image.title}
        aria-label={image.title}
        alt={image.alt}
        role="button"
        onClick={() => this.updateAnswer(image.id, 'submit')}
      />
    ));

    return (
      <div className="emoji-container">
        {elements}
      </div>
    );
  }

  private renderTextField(options: QuestionInterface.TextFieldOptions) {
    const { placeholder, maximumCharacters, minimumCharacters } = options;

    return (
      <div className="text-field-container">
        <textarea
          placeholder={placeholder}
          maxLength={maximumCharacters}
          required={(minimumCharacters || -1) > 0}
          onChange={event => this.updateAnswer(event.target.value, 'validate')}
        />
        <button
          onClick={() => this.validateCurrentAnswer(true)}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Question;
