import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import './index.css';

export namespace SurveyComplete {

  export type Props = RouteProps;

  export type RouteProps = RouteComponentProps<RouteParameters>;

  export interface RouteParameters {
    surveyId: string;
  }

}

export class SurveyComplete extends React.Component<SurveyComplete.Props> {

  public render() {
    return (
      <div className="survey-complete-container">
        <h1>Thank you!</h1>
        <p>Thank you for your answers! 😃 You may also <Link to={`/${this.props.match.params.surveyId}/results`}>view the results</Link>.</p>
      </div>
    );
  }

}

export default SurveyComplete;
