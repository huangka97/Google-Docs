import React from 'react';

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyArr: []
    }
  }

  componentDidMount() {
    this.props.showHistory(e, id) {
      this.setState({
        historyArr: this.props.history
      })
    }
  }

  render() {
    console.log("in history component");
    return (
      <h1>Document History</h1>
    )
  }
}
