import * as React from 'react';

import Question from './Question';

namespace QuestionInputComponent {
  export interface Props<QuestionOptions extends Question.Options> {
    answer: string;
    options: QuestionOptions;
    updateAnswer: (answer: string, validate: boolean, submit: boolean) => void;
    trySubmit: () => void;
  }
}

interface QuestionInputComponent<QuestionOptions extends Question.Options> extends React.Component<QuestionInputComponent.Props<QuestionOptions>, {}> {}

export default QuestionInputComponent;
