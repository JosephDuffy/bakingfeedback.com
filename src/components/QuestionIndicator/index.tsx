import * as React from 'react';

import './index.css';

namespace QuestionIndicator {
  export interface Props {
    text: string;
    style: Style;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  }

  export type Style = 'locked' | 'current' | 'complete';

  export interface State {
    transitionState: TransitionState;
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
    };
  }

  public componentDidMount() {
    if (this.props.style === 'current') {
      this.showText(500);
    }
  }

  public componentWillReceiveProps(nextProps: QuestionIndicator.Props) {
    if (nextProps.style === 'current') {
      this.showText();
    } else if (this.state.transitionState === 'showing') {
      this.hideText();
    }
  }

  public render() {
    const isCurrent = this.props.style === 'current';

    return (
      <div
        className={`question-indicator-container ${this.props.style}-question`}
        onMouseOver={!isCurrent ? () => this.showText() : undefined}
        onMouseLeave={!isCurrent ? () => this.hideText() : undefined}
        onClick={this.props.onClick}
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

  private showText(delay: number = 0) {
    this.performAnimation('showing', delay);
  }

  private hideText(delay: number = 0) {
    this.performAnimation('hidden', delay);
  }

  private performAnimation(finalState: QuestionIndicator.FinalTransitionState, delay: number) {
    if (delay > 0) {
      setTimeout(this.performAnimation.bind(this, finalState, 0), delay);
      return;
    }

    const {
      stateToWaitFor,
      requiredState,
      animationState,
    } = (() => {
      switch (finalState) {
      case 'showing':
        return {
          stateToWaitFor: 'animating-out' as QuestionIndicator.AnimationTransitionState,
          requiredState: 'hidden' as QuestionIndicator.FinalTransitionState,
          animationState: 'animating-in' as QuestionIndicator.AnimationTransitionState,
        };
      case 'hidden':
        return {
          stateToWaitFor: 'animating-in' as QuestionIndicator.AnimationTransitionState,
          requiredState: 'showing' as QuestionIndicator.FinalTransitionState,
          animationState: 'animating-out' as QuestionIndicator.AnimationTransitionState,
        };
      }
    })();

    const currentTransitionState = this.state.transitionState;

    if (currentTransitionState === stateToWaitFor) {
      // Asking to show/hide but there's an active hiding/showing animation
      setTimeout(this.performAnimation.bind(this, finalState, delay), this.animationTransitionLength);
      return;
    }

    if (currentTransitionState !== requiredState) {
      // No need to change state when it's already in that state or animating
      return;
    }

    this.setState({
      transitionState: animationState,
    }, () => {
      setTimeout(() => {
        this.setState({
          transitionState: finalState,
        });
      }, this.animationTransitionLength);
    });
  }
}

export default QuestionIndicator;
