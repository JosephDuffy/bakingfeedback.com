import * as React from 'react';
import './index.css';

import { default as QuestionInterface } from '../../interfaces/Question';

namespace Question {
  export interface Props {
    question: QuestionInterface;

    onAnswerChosen: (answer: string) => void;
  }

  export interface State {}
}

class Question extends React.Component<Question.Props, Question.State> {

  constructor(props: Question.Props) {
    super(props);

    this.state = {};
  }

  public render() {
    switch (this.props.question.input.type) {
      case QuestionInterface.InputType.Images:
        return this.renderEmojiQuestions(this.props.question.input.options as QuestionInterface.ImagesOptions);
        default:
          return (
            <div>Unsupported question</div>
          );
    }
  }

  private renderEmojiQuestions(options: QuestionInterface.ImagesOptions) {
    const { images } = options;

    const elements = images.map((image, index) => (
      // TODO: Add aria-label and alt tags with description of emoji
      <img
        key={index}
        src={image.url}
        title={image.title}
        aria-label={image.title}
        alt={image.alt}
        role="button"
        onClick={() => this.props.onAnswerChosen(image.id)}
      />
    ));

    return (
      <div className="emoji-container">
        {elements}
      </div>
    );
  }
}

export default Question;
