import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class ImageQuestionInput extends QuestionInputComponent<Question.ImagesOptions, string> {

  public render() {
    const { images } = this.props.options;
    const inputName = `image-question-input-${this.props.options.images.length}`;

    const elements = images.map((image, index) => {
      const isChosenAnswer = image.id === this.props.answer;

      const handleOnClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        if (event.screenX === 0 && event.screenY === 0) {
          // This event is triggered when the value is updated using the arrow
          // keys on the keyboard while focussed on selected input. In this case
          // the `onChange` handler on the `<input>` will handle the change.
          return;
        }

        isChosenAnswer ? this.props.trySubmit() : this.handleValueChange(image.id);
      };

      return (
        <label
          key={index}
          className={isChosenAnswer ? 'chosen-answer' : undefined}
          onClick={handleOnClick}
        >
          <input
            type="radio"
            name={inputName}
            defaultChecked={isChosenAnswer}
            onChange={!isChosenAnswer ? () => this.handleValueChange(image.id) : undefined}
          />
          <img
            src={image.url}
            title={image.title}
            aria-label={image.title}
            alt={image.alt}
          />
        </label>
      );
    });

    return (
      <div className={['image-question-input-container', this.props.className].filter(value => !!value).join(' ')}>
        {elements}
        {this.renderErrors()}
      </div>
    );
  }

  protected _validate(input: string | undefined, forceAll: boolean) {
    const { options } = this.props;
    const errors: string[] = [];

    function checkValueIsNotEmpty() {
      if (options.required && (typeof input === 'undefined' || input === '')) {
        errors.push('A value is required');
        return false;
      }

      return true;
    }

    function checkValueIsValid() {
      const imageIds = options.images.map(image => image.id);
      if (typeof input !== 'undefined' && imageIds.indexOf(input) === -1) {
        errors.push(`Selected value (${input}) is not a valid option`);
        return false;
      }

      return true;
    }

    if (forceAll) {
      checkValueIsNotEmpty();
      checkValueIsValid();
    } else {
      if (checkValueIsNotEmpty()) {
        checkValueIsValid();
      }
    }

    return errors;
  }

}
