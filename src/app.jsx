import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Editor, Modifier, EditorState, RichUtils} from 'draft-js';

<RaisedButton color="primary">Bold</RaisedButton>





export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
   // this.onChange = (editorState) => this.setState({editorState});
  }

  onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicsClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  onUnderlineClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }


  onChange(editorState) {
    this.setState({ editorState });
  }




  // const socket = io('http://localhost:8080');
  // componentDidMount() {
  //   const socket = io('http://localhost:8080');
  //   socket.on('connect', function() {
  //     console.log('ws connect')
  //   });
  //   socket.on('disconnect', function() {
  //     console.log('ws disconnect')
  //   });
  //   socket.on('msg', function(data) {
  //     console.log('ws msg:', data);
  //     socket.emit('cmd', {foo: 123})
  //   });
  // }


  render() {
    return (<div>
    <button className="glyphicon glyphicon-bold" onMouseDown={(e) => this.onBoldClick(e)}>BOLD</button>
    <button onMouseDown={(e) =>this.onItalicsClick(e)}>Italics</button>
   <button onMouseDown={(e) => this.onUnderlineClick(e)}>Underline</button>
    <Editor editorState={this.state.editorState} onChange={(editorState) => {this.onChange(editorState)}} style = {{border: "2px solid black", backgroundColor: "lightgrey"}}/>
    </div>);
  }
}
