import * as React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

namespace QuestionIndicator {
  export interface Props {
    text: string;
    style: Style;
    href?: string;
  }

  export type Style = 'locked' | 'unlocked' | 'current' | 'complete';

  export interface State {
    transitionState: TransitionState;
    queuedNextState?: FinalTransitionState;
    hasFocus: boolean;
  }

  export type AnimationTransitionState = 'animating-in' | 'animating-out';

  export type FinalTransitionState = 'showing' | 'hidden';

  export type TransitionState = AnimationTransitionState | FinalTransitionState;
}

class QuestionIndicator extends React.Component<QuestionIndicator.Props, QuestionIndicator.State> {

  private get animationTransitionLength() {
    return 450;
  }

  constructor(props: QuestionIndicator.Props) {
    super(props);

    this.state = {
      transitionState: 'hidden',
      hasFocus: false,
    };
  }

  public componentDidMount() {
    if (this.props.style === 'current') {
      setTimeout(() => {
        // Guard against the user answering the question within 0.5 seconds
        if (this.state.transitionState === 'hidden' && this.props.style === 'current') {
          this.showText();
        }
      }, 500);
    }
  }

  public componentWillReceiveProps(nextProps: QuestionIndicator.Props) {
    if (nextProps.style === 'current') {
      this.showText();
    } else {
      this.hideText();
    }
  }

  public render() {
    const isCurrent = this.props.style === 'current';
    const transitionState = this.state.hasFocus ? 'showing' : this.state.transitionState;

    const contents = [
      <span key="indicator" className="question-indicator"></span>,
      <div key="text-container" className="question-indicator-text-container">
          <div className={`question-indicator-text question-indicator-text-${transitionState}`}>
            {this.props.text}
          </div>
      </div>,
    ];

    return (
      <div
        className={`question-indicator-container ${this.props.style}-question`}
        onMouseOver={!isCurrent ? this.showText : undefined}
        onMouseLeave={!isCurrent ? this.hideText : undefined}
        onFocus={!isCurrent ? this.handleFocus : undefined}
        onBlur={this.handleBlur}
      >
        {this.props.href ? (
          <Link
            to={this.props.href}
          >
            {contents}
          </Link>
        ) : (
          contents
        )}
      </div>
    );
  }

  private handleFocus = () => {
    this.setState({
      hasFocus: true,
    });
  }

  private handleBlur = () => {
    this.setState({
      hasFocus: false,
    });
  }

  private showText = () => {
    this.performAnimation('showing');
  }

  private hideText = () => {
    this.performAnimation('hidden');
  }

  private performAnimation(finalState: QuestionIndicator.FinalTransitionState, currentState: QuestionIndicator.TransitionState = this.state.transitionState) {
    if (finalState === currentState) {
      this.setState({
        queuedNextState: undefined,
      });
      return;
    }

    if (
      (finalState === 'hidden' && currentState === 'animating-in') ||
      (finalState === 'showing' && currentState === 'animating-out')
      ) {
        this.setState({
          queuedNextState: finalState,
        });
        return;
    } else if (
        (finalState === 'hidden' && currentState === 'animating-out') ||
        (finalState === 'showing' && currentState === 'animating-in')
    ) {
      this.setState({
        queuedNextState: undefined,
      });
      return;
    }

    const animationState = (() => {
      switch (finalState) {
      case 'showing':
        return 'animating-in' as QuestionIndicator.AnimationTransitionState;
      case 'hidden':
        return 'animating-out' as QuestionIndicator.AnimationTransitionState;
      }
    })();

    this.setState({
      transitionState: animationState,
      queuedNextState: undefined,
      hasFocus: false,
    }, () => {
      setTimeout(() => {
        if (this.state.queuedNextState) {
          this.performAnimation(this.state.queuedNextState, finalState);
        } else {
          this.setState({
            transitionState: finalState,
          });
        }
      }, this.animationTransitionLength);
    });
  }
}

export default QuestionIndicator;
