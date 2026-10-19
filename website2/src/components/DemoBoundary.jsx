import { Component } from 'react';

export default class DemoBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p role="alert">{this.props.fallback}</p> : this.props.children;
  }
}
