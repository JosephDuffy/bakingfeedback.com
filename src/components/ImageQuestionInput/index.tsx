import * as React from 'react';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class ImageQuestionInput extends React.Component<QuestionInputComponent.Props<Question.ImagesOptions>, {}> implements QuestionInputComponent<Question.ImagesOptions> {

  public render() {
    const { images } = this.props.options;

    const elements = images.map((image, index) => {
      const isChosenAnswer = image.id === this.props.answer;

      return (
        <img
          key={index}
          className={isChosenAnswer ? 'chosen-answer' : undefined}
          src={image.url}
          title={image.title}
          aria-label={image.title}
          alt={image.alt}
          role="button"
          onClick={() => this.props.updateAnswer(image.id, true, true)}
        />
      );
    });

    return (
      <div className="emoji-container">
        {elements}
      </div>
    );
  }
}
