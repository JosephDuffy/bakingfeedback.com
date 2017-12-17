import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class CheckboxQuestionInput extends QuestionInputComponent<Question.CheckboxOptions, boolean> {

  public render() {
    const { required, label, defaultValue, checkedHint, uncheckedHint } = this.props.options;
    const isChecked = this.props.answer === true || defaultValue;
    return (
      <div className={['checkbox-question-input-container', this.props.className].filter(value => !!value).join(' ')}>
        <label
          className="checkbox-label"
        >
          <input
            type="checkbox"
            defaultChecked={isChecked}
            required={required}
            onChange={event => this.handleValueChange(event.target.checked)}
          />
          {label}
        </label>
        {this.renderHint(isChecked ? checkedHint : uncheckedHint)}
        {this.renderErrors()}
      </div>
    );
  }

  protected _validate(input: boolean | undefined, forceAll: boolean) {
    const { options } = this.props;

    if (options.required && (typeof input === 'undefined' || input === false)) {
      return['You must check this checkbox'];
    }

    return [];
  }

}
