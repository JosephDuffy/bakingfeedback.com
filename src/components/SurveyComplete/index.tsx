import * as React from 'react';
import './index.css';

export default class SurveyComplete extends React.Component {

  public render() {
    return (
      <div className="survey-complete-container">
        <h1>Thank you!</h1>
        <p>Thank you for completing this survey 😃 In the future results will be published on this website.</p>
      </div>
    );
  }

}
