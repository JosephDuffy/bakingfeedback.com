import * as React from 'react';
import './Questions.css';

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
        <nav id="question-indicator-container">
          <span className="answer-indicator current-answer"></span>
          <a href="#" title="Open question 2"><span className="answer-indicator"></span></a>
          <a href="#" title="Open question 3"><span className="answer-indicator"></span></a>
        </nav>
      </div>
    );
  }
}

export default Questions;
