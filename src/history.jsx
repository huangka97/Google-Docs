import React from 'react';
import {Editor, EditorState} from 'draft-js';


export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyArr: [],
      editorState: EditorState.createEmpty()
    }
  }

  componentDidMount() {
    //console.log(this.props.historyArr)
    var newHistory = this.props.historyArr(null, (hArr)=>{
      console.log("NEWHISTORY",hArr);
      this.setState({
        historyArr: hArr,
        editorState: EditorState.createWithContent(hArr[0])
      })
    });


  }


  render() {
    console.log("in history component");
    console.log("this.state.historyArr", this.state.historyArr);
    return (
      <div>
      <h1>Document History</h1>
      {this.state.historyArr.map(history =>
        <div style={{backgroundColor: "gray", margin: "10px"}}>
        <Editor editorState={EditorState.createWithContent(history)}/>
      </div>
      )}

      </div>
    )
  }

}
