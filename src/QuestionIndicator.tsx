import * as React from 'react';

import './QuestionIndicator.css';

namespace QuestionIndicator {
  export interface Props {
      text: string;
      state: 'locked' | 'current' | 'complete';
  }

  export interface State {
    transitionState: TransitionState;
  }

  export type TransitionState = 'animating-in' | 'showing' | 'animating-out' | 'hidden';
}

class QuestionIndicator extends React.Component<QuestionIndicator.Props, QuestionIndicator.State> {

  constructor(props: QuestionIndicator.Props) {
    super(props);

    this.state = {
      transitionState: 'hidden',
    };
  }

  public componentDidMount() {
    if (this.props.state === 'current') {
      setTimeout(() => {
        this.showText(true);
      }, 500);
    }
  }

  public render() {
    return (
      <div
        className={`question-indicator-container ${this.props.state}-question`}
        onMouseOver={() => this.showText(false)}
        onMouseLeave={() => this.hideText()}
      >
        <span className="question-indicator"></span>
        <div className="question-indicator-text-container">
            <div className={`question-indicator-text question-indicator-text-${this.state.transitionState}`}>
              {this.props.text}
            </div>
        </div>
      </div>
    );
  }

  private updateTransitionState(toState: QuestionIndicator.TransitionState, after: number, callback?: (() => void)) {
    setTimeout(() => {
      this.setState({
        transitionState: toState,
      }, callback);
    }, after);
  }

  private showText(hideAutomatically: boolean) {
    if (this.state.transitionState !== 'hidden') {
      return;
    }

    this.setState({
      transitionState: 'animating-in',
    }, () => {
      this.performTransitionToNextAnimationState(hideAutomatically, true);
    });
  }

  private hideText() {
    if (this.state.transitionState === 'animating-in') {
      setTimeout(this.hideText.bind(this), 450);
      return;
    }

    if (this.state.transitionState !== 'showing') {
      return;
    }

    this.performTransitionToNextAnimationState(false, false);
  }

  private performTransitionToNextAnimationState(hideAutomatically: boolean, delay: boolean) {
    switch (this.state.transitionState) {
      case 'animating-in':
        this.updateTransitionState('showing', delay ? 450 : 0, hideAutomatically ? this.performTransitionToNextAnimationState.bind(this, hideAutomatically, delay) : undefined);
        break;
      case 'showing':
        this.updateTransitionState('animating-out', delay ? 2000 : 0, this.performTransitionToNextAnimationState.bind(this, hideAutomatically, true));
        break;
      case 'animating-out':
        this.updateTransitionState('hidden', delay ? 450 : 0);
        break;
      case 'hidden':
        break;
    }
  }
}

export default QuestionIndicator;
