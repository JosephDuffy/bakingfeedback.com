import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class ImageQuestionInput extends React.Component<QuestionInputComponent.Props<Question.ImagesOptions>, {}> implements QuestionInputComponent<Question.ImagesOptions> {

  public render() {
    const { images } = this.props.options;
    const inputName = `image-question-input-${this.props.options.images.length}`;

    const elements = images.map((image, index) => {
      const isChosenAnswer = image.id === this.props.answer;

      const handleOnClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        if (event.screenX === 0 && event.screenY === 0) {
          // This event is triggered when the value is updated using the arrow
          // keys on the keyboard while focussed on selected input. When this is
          // the case `screen[X|Y]` are equal to 0
          return;
        }

        isChosenAnswer ? this.props.trySubmit() : this.props.updateAnswer(image.id, true, true);
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
            onChange={!isChosenAnswer ? () => this.props.updateAnswer(image.id, true, false) : undefined}
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
      <div className="image-question-input-container">
        {elements}
      </div>
    );
  }
}
