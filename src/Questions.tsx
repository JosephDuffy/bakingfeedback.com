import * as React from 'react';
import './Questions.css';

import QuestionIndicator from './QuestionIndicator';

class Questions extends React.Component {
  public render() {
    return (
      <div id="questions-container">
        <div id="question-container">
          <h1>What did you think of the cheesecake?</h1>
          <div id="answers-container">
              <a href="#" title="Vote for 🤢"><img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f922.svg" /></a>
              <a href="#" title="Vote for 🙁"><img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f641.svg" /></a>
              <a href="#" title="Vote for 😕"><img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f615.svg" /></a>
              <a href="#" title="Vote for 😋"><img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f60b.svg" /></a>
              <a href="#" title="Vote for 🤤"><img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/1f924.svg" /></a>
          </div>
        </div>
        <nav id="question-indicators-container">
          <QuestionIndicator text="Question 1" state="current"/>
          <QuestionIndicator text="Question 2" state="locked"/>
          <QuestionIndicator text="Question 3" state="locked"/>
        </nav>
      </div>
    );
  }
}

export default Questions;
