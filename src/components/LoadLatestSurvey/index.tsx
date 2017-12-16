import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { loadSurveyWorker } from '../../actions/surveys';
import { AppState } from '../../reducers';
import { State as SurveysState } from '../../reducers/surveys';

export namespace LoadLatestSurvey {

  export interface Props extends SurveysState {
    loadSurvey(id: string): void;
  }
}

export class LoadLatestSurvey extends React.Component<LoadLatestSurvey.Props, {}> {

  public componentWillMount() {
    this.props.loadSurvey('latest');
  }

  public render() {
    if (this.props.get('latest')) {
      return (
        <Redirect
          to={`/${this.props.get('latest')}/`}
          push={false}
        />
      );
    } else if (this.props.get('surveys').get('latest') && this.props.get('surveys').get('latest').loadError) {
      const error = this.props.get('surveys').get('latest').loadError as Error;

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
    ...state.surveys,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<LoadLatestSurvey>) => {
  return {
    loadSurvey: (id: string) => {
      dispatch(loadSurveyWorker({ id }));
    },
  };
};

const LoadLatestSurveyContainer = connect(mapStateToProps, mapDispatchToProps)(LoadLatestSurvey as any);

export default LoadLatestSurveyContainer;
