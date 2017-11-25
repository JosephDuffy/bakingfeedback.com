import * as React from 'react';

import './index.css';

namespace QuestionIndicator {
  export interface Props {
    text: string;
    style: Style;
    onClick?: () => void;
  }

  export type Style = 'locked' | 'current' | 'complete';

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

    return (
      <div
        className={`question-indicator-container ${this.props.style}-question`}
        onMouseOver={!isCurrent ? this.showText : undefined}
        onMouseLeave={!isCurrent ? this.hideText : undefined}
        tabIndex={this.props.onClick ? 0 : undefined}
        onFocus={this.props.onClick ? this.handleFocus : undefined}
        onBlur={this.handleBlur}
        onKeyDown={this.props.onClick ? this.handleKeyDown : undefined}
        onClick={this.props.onClick ? this.handleClick : undefined}
      >
        <span className="question-indicator"></span>
        <div className="question-indicator-text-container">
            <div className={`question-indicator-text question-indicator-text-${transitionState}`}>
              {this.props.text}
            </div>
        </div>
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

  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
    case 'Enter':
    case ' ':
      this.handleClick(event);
    }
  }

  private handleClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
    event.currentTarget.blur();

    if (this.props.onClick) {
      this.props.onClick();
    }
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
        queuedNextState: finalState,
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
