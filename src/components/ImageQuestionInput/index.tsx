import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class ImageQuestionInput extends React.Component<QuestionInputComponent.Props<Question.ImagesOptions>, {}> implements QuestionInputComponent<Question.ImagesOptions> {

  public render() {
    const { images } = this.props.options;

    const elements = images.map((image, index) => {
      const isChosenAnswer = image.id === this.props.answer;

      return (
        <label
          key={index}
          className={isChosenAnswer ? 'chosen-answer' : undefined}
          onClick={isChosenAnswer ? this.props.trySubmit : undefined}
        >
          <input
            type="radio"
            defaultChecked={isChosenAnswer}
            onChange={!isChosenAnswer ? () => this.props.updateAnswer(image.id, true, true) : undefined}
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
