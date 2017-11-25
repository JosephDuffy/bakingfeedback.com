import * as React from 'react';
import './index.css';

import Question from '../../interfaces/Question';
import QuestionInputComponent from '../../interfaces/QuestionInputComponent';

export default class TextQuestionInput extends React.Component<QuestionInputComponent.Props<Question.TextOptions>, {}> implements QuestionInputComponent<Question.TextOptions> {

  public render() {
    const { options } = this.props;

    return options.allowMultipleLines ? this.renderTextField() : this.renderTextInput();
  }

  private renderTextField() {
    return (
      <div className="text-field-container text-question-container">
        <label>{this.props.options.label}</label>
        <textarea
          onChange={event => this.props.updateAnswer(event.target.value, true, false)}
          onSubmit={event => this.props.trySubmit()}
        >
          {this.props.answer}
        </textarea>
        {this.props.options.hint &&
          <small className="tip">{this.props.options.hint}</small>
        }
      </div>
    );
  }

  private renderTextInput() {
    return (
      <div className="text-input-container text-question-container">
        <label>{this.props.options.label}</label>
        <input
          type="text"
          value={this.props.answer}
          onChange={event => this.props.updateAnswer(event.target.value, true, false)}
          onSubmit={event => this.props.trySubmit()}
        />
        {this.props.options.hint &&
          <small className="tip">{this.props.options.hint}</small>
        }
      </div>
    );
  }
}
