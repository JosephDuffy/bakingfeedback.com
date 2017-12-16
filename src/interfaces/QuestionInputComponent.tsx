import * as React from 'react';

import Question from './Question';

namespace QuestionInputComponent {
  export interface Props<QuestionOptions extends Question.Options> {
    answer?: string;
    options: QuestionOptions;
    updateAnswer: (answer: string) => void;
    trySubmit: () => void;
  }

  export interface State {
    errors: string[];
  }
}

abstract class QuestionInputComponent<QuestionOptions extends Question.Options> extends React.Component<QuestionInputComponent.Props<QuestionOptions>, QuestionInputComponent.State> {

  constructor(props: QuestionInputComponent.Props<QuestionOptions>) {
    super(props);

    this.state = {
      errors: this.validate(props.answer, false),
    };
  }

  public abstract validate(input: string | undefined, forceAll: boolean): string[];

  protected renderErrors() {
    if (this.state.errors.length > 0) {
      const errors = this.state.errors.map((error, index) => {
        return <div key={`${index}`} className="input-error">{error}</div>;
      });

      return <div className="input-errors-container">{errors}</div>;
    } else {
      return undefined;
    }
  }

  protected handleValueChange(value: string) {
    const errors = this.validate(value, false);

    this.setState({
      errors,
    });

    this.props.updateAnswer(value);
  }

}

export default QuestionInputComponent;
