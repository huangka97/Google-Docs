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
import FormatSize from 'material-ui/svg-icons/editor/format-size'
import FontPicker from 'font-picker-react';



const styleMap = {
  'REDFONT': {
    color: "red"
  },
  'BLUEFONT': {
    color: "blue"
  },
  'PURPLEFONT': {
    color: "purple"
  },

  'TWELVE': {
    fontSize: 12
  },

  'FOURTEEN': {
    fontSize: 14
  },
  'EIGHTEEN': { 
     fontSize: 18
  },

  'THIRTYSIX': { 
     fontSize: 36
  }
};




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopOver: false,
      showPopOverSize: false,
      editorState: EditorState.createEmpty(),
      activeFont: "Open-Sans"
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


onTwelveClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'TWELVE'));
}
onFourteenClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'FOURTEEN'));
}

onEighteenClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'EIGHTEEN'));
}
onThirtySixClick(e) {
  e.preventDefault();
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'THIRTYSIX'));
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
    return (
      <div>
        <FontPicker
        apiKey='AIzaSyAInS6kxBT6_iwgttwOaXVi4JJDP7k1bEQ'
        activeFont={this.state.activeFont}
        onChange={nextFont => this.setState({activeFont: nextFont.family})}/>
          <div className = "apply-font">
      <FlatButton
        icon = {<FormatColorText/>}
        onMouseDown={(e) => {
        e.preventDefault();
        this.setState({showPopOver:true, fontMenuEl: e.currentTarget})
      }}></FlatButton>

      <FlatButton//size
        icon = {<FormatSize/>}
        onMouseDown={(e) => {
        e.preventDefault();
        this.setState({showPopOverSize:true, fontMenuEl: e.currentTarget})
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


    <Popover
              open={this.state.showPopOverSize}
              anchorEl={this.state.fontMenuEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => this.setState({showPopOverSize: false})}
            >
    <Menu>
      <MenuItem primaryText="12" onMouseDown={(e) => this.onTwelveClick(e)}/>
      <MenuItem primaryText="14" onMouseDown={(e) => this.onFourteenClick(e)}/>
      <MenuItem primaryText="18" onMouseDown={(e) => this.onEighteenClick(e)}/>
      <MenuItem primaryText="36" onMouseDown={(e) => this.onThirtySixClick(e)}/>
     </Menu>
   </Popover>
    </div>
    </div>);
  }
}
