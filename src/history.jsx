import React from 'react';

export default class History extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("in history component");
    return (
      <h1>Document History</h1>
    )
  }
}
