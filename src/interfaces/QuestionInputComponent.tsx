import * as React from 'react';

import Question from './Question';

namespace QuestionInputComponent {
  export interface Props<QuestionOptions extends Question.Options, InputType> {
    answer?: any;
    options: QuestionOptions;
    className?: string;
    updateAnswer: (answer: InputType) => void;
    trySubmit: () => void;
  }

  export interface State {
    errors: string[];
  }
}

abstract class QuestionInputComponent<QuestionOptions extends Question.Options, InputType> extends React.Component<QuestionInputComponent.Props<QuestionOptions, InputType>, QuestionInputComponent.State> {

  constructor(props: QuestionInputComponent.Props<QuestionOptions, InputType>) {
    super(props);

    this.state = {
      errors: this.validate(props.answer, false),
    };
  }

  public validate(input: InputType | undefined, forceAll: boolean, updateState?: (() => void) | true): string[] {
    const errors = this._validate(input, forceAll);

    if (updateState) {
      const callback = updateState !== true ? updateState : undefined;
      this.setState({
        errors,
      }, callback);
    }

    return errors;
  }

  protected abstract _validate(input: InputType | undefined, forceAll: boolean): string[];

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

  protected renderHint(hint: string | undefined = this.props.options.hint) {
    if (hint) {
      return <small className="hint">{hint}</small>;
    } else {
      return undefined;
    }
  }

  protected handleValueChange(value: InputType) {
    this.validate(value, false, () => {
      this.props.updateAnswer(value);
    });
  }

}

export default QuestionInputComponent;
