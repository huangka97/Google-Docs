import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Editor, EditorState, RichUtils} from 'draft-js';

<RaisedButton color="primary">Bold</RaisedButton>

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  render() {
    return(
      <div className = "editor" style={{border: '1px solid black', backgroundColor: 'white', height: 200, width: 400}}>

      </div>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
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
      <h1>Text Editor</h1>
      <button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
      <Editor editorState={this.state.editorState} onChange={this.onChange}/>
    </div>);
  }
}
