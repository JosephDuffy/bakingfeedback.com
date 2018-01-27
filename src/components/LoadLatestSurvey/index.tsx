import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { Action, Success } from 'typescript-fsa';
import { LoadSurveyPayload, loadSurveyWorker } from '../../actions/surveys';
import Survey from '../../interfaces/Survey';
import { AppState } from '../../reducers';
import { State as SurveysState } from '../../reducers/surveys';

export namespace LoadLatestSurvey {

  export interface Props extends SurveysState {
    surveys: SurveysState;
    loadSurvey(id: string): Promise<Action<Success<LoadSurveyPayload, Survey>>>;
  }

  export interface State {
    latestSurvey?: Survey;
  }

}

export class LoadLatestSurvey extends React.Component<LoadLatestSurvey.Props, LoadLatestSurvey.State> {

  constructor(props: LoadLatestSurvey.Props) {
    super(props);

    this.state = {};
  }

  public componentWillMount() {
    this.props.loadSurvey('latest').then(latestSurvey => {
      this.setState({
        latestSurvey: latestSurvey.payload.result,
      });
    });
  }

  public render() {
    if (this.state.latestSurvey) {
      return (
        <Redirect
          to={`/${this.state.latestSurvey.id}/`}
          push={false}
        />
      );
    } else if (this.props.surveys.get('errors').get('latest')) {
      const error = this.props.surveys.get('errors').get('latest') as Error;

      return (
        <div>
          <h1>Error :/</h1>
          <div>{error.message}</div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    surveys: state.surveys,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<LoadLatestSurvey>) => {
  return {
    loadSurvey: (id: string) => {
      return dispatch(loadSurveyWorker({ id }));
    },
  };
};

const LoadLatestSurveyContainer = connect(mapStateToProps, mapDispatchToProps)(LoadLatestSurvey as any);

export default LoadLatestSurveyContainer;
