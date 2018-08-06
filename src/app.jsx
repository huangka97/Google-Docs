import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Editor, Modifier, EditorState, RichUtils} from 'draft-js';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// dropdown

import FlatButton from 'material-ui/FlatButton';

import FormatUnderlined from 'material-ui/svg-icons/editor/format-underlined'

import Popover from 'material-ui/Popover';

// icons

import FormatColorText from 'material-ui/svg-icons/editor/format-color-text';

import FormatBold from 'material-ui/svg-icons/editor/format-bold';

import FormatItalic from 'material-ui/svg-icons/editor/format-italic'



const styleMap = {
  'REDFONT': {
    color: "red"
  },
  'BLUEFONT': {
    color: "blue"
  },
  'PURPLEFONT': {
    color: "purple"
  }
};




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopOver: false,
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

onRedClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'REDFONT'));
}

onBlueClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BLUEFONT'));
}

onPurpleClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'PURPLEFONT'));
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
      <FlatButton
        icon = {<FormatColorText/>}
        onMouseDown={(e) => {
        e.preventDefault();
        this.setState({showPopOver:true, fontMenuEl: e.currentTarget})
      }}></FlatButton>
      <FlatButton
        icon = {<FormatBold/>}
        onMouseDown={(e) => this.onBoldClick(e)}>
        </FlatButton>
        <FlatButton
          icon = {<FormatUnderlined/>}
          onMouseDown={(e) => this.onUnderlineClick(e)}>
        </FlatButton>
        <FlatButton
          icon = {<FormatItalic/>}
          onMouseDown={(e) => this.onItalicsClick(e)}>
        </FlatButton>
    <Editor customStyleMap={styleMap} editorState={this.state.editorState} onChange={(editorState) => {this.onChange(editorState)}} style = {{border: "2px solid black", backgroundColor: "lightgrey"}}/>
    <Popover
              open={this.state.showPopOver}
              anchorEl={this.state.fontMenuEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => this.setState({showPopOver: false})}
            >
    <Menu>
      <MenuItem primaryText="Red" onMouseDown={(e) => this.onRedClick(e)}/>
      <MenuItem primaryText="Blue" onMouseDown={(e) => this.onBlueClick(e)}/>
      <MenuItem primaryText="Purple" onMouseDown={(e) => this.onPurpleClick(e)}/>
     </Menu>
   </Popover>
    </div>);
  }
}
