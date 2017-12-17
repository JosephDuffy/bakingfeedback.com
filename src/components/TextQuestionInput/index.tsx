import * as isemail from 'isemail';
import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export class TextQuestionInput extends QuestionInputComponent<Question.TextOptions, string> {

  public render() {
    const { options } = this.props;

    // TODO: Render "required" indicator

    switch (options.kind) {
    case 'text':
    case 'email':
      return this.renderTextInput();
    case 'textfield':
      return this.renderTextField();
    }
  }

  /**
   * Validates the provided input, returning an array of errors.
   *
   * If the `forceAll` parameter is `true` all the validation rules will be run. However,
   * if `false` is passed the rules will be run "dynamically", e.g. if the minimum length is
   * not met no more rules will be validated
   *
   * @param input The value to be validated
   * @param forceAll If `true` all rules will be run
   */
  protected _validate(input: string | undefined, forceAll: boolean): string[] {
    const { options } = this.props;

    const errors: string[] = [];

    function checkMinimumLength() {
      if (typeof options.minimumCharacters !== 'undefined' && (typeof input === 'undefined' || input.length < options.minimumCharacters)) {
        const suffix = options.minimumCharacters === 1 ? ' long' : '\'s long';
        errors.push(`Answer must be at least ${options.minimumCharacters} character${suffix}`);
        return false;
      }

      return true;
    }

    function checkIsEmail() {
      if (options.kind === 'email' && (typeof input === 'undefined' || !isemail.validate(input))) {
        errors.push('Value must be a valid email');

        return false;
      }

      return true;
    }

    if (forceAll) {
      checkMinimumLength();
      checkIsEmail();
    } else {
      if (!checkMinimumLength()) {
        return [];
      }

      checkIsEmail();
    }

    return errors;
  }

  private renderTextField() {
    return (
      <div className={['text-field-container text-question-container', this.props.className].filter(value => !!value).join(' ')}>
        {this.renderLabel()}
        <textarea
          defaultValue={this.props.answer || ''}
          autoCapitalize={this.props.options.autoCapitalize}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
        {this.renderHint()}
        {this.renderErrors()}
      </div>
    );
  }

  private renderTextInput() {
    return (
      <div className={['text-input-container text-question-container', this.props.className].filter(value => !!value).join(' ')}>
        {this.renderLabel()}
        <input
          type={this.props.options.kind}
          defaultValue={this.props.answer || ''}
          autoCapitalize={this.props.options.autoCapitalize}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
        {this.renderHint()}
        {this.renderErrors()}
      </div>
    );
  }

  private renderLabel() {
    if (this.props.options.label) {
      return <label>{this.props.options.label}</label>;
    } else {
      return undefined;
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.handleValueChange(event.target.value);
  }

  private handleSubmit = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.props.trySubmit();
    event.preventDefault();
  }
}

export default TextQuestionInput;
