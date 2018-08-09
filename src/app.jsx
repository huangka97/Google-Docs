import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Editor, Modifier, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// dropdown

import FlatButton from 'material-ui/FlatButton';

import FormatUnderlined from 'material-ui/svg-icons/editor/format-underlined'

import Popover from 'material-ui/Popover';

// icons

import FormatColorText from 'material-ui/svg-icons/editor/format-color-text';

import FormatBold from 'material-ui/svg-icons/editor/format-bold';

import FormatItalic from 'material-ui/svg-icons/editor/format-italic';
import FormatSize from 'material-ui/svg-icons/editor/format-size';
import FormatAlignLeft from 'material-ui/svg-icons/editor/format-align-left';
import FormatAlignRight from 'material-ui/svg-icons/editor/format-align-right';

import FormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted';

import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';




import FontPicker from 'font-picker-react';

import Registration from "./registration"
import Login from "./login"

import Documents from "./documents"

// socket io

import io from 'socket.io-client';




// hello

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

function myBlockStyleFn(contentBlock){
  console.log("TEST");
  const type=contentBlock.getType();
  if (type=='right'){
    return "right"
  }else if(type=='left'){
    return "left"
  }else if(type=='center'){
    return "center"
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopOver: false,
      showPopOverSize: false,
      showPopOverAlignment:false,
      editorState: EditorState.createEmpty(),
      textAlignment:'left',
      activeFont: "Open-Sans",
      showEditor:false,
      showRegister:false,
      showLogin:false,
      showDocuments: false,
      documentID:"",
      socket: io('http://localhost:8080')
    };
   // this.onChange = (editorState) => this.setState({editorState});
  }

  //socket stuff

  componentDidMount() {
    this.state.socket.on("connect", function() {
      console.log("server connected");
    })
  }

  onChange(editorState) {
    //socket stuff
    // console.log("ON CHANGE FIRED!!!!!!!!!!!!!!!");
    this.setState({ editorState });
  }




  toggleLogin(e){
    e.preventDefault();
    this.setState({
      showLogin:!this.state.showLogin

    })
  }
  toggleRegister(e){

    e.preventDefault();
    //console.log("ENTERED TOGGLEREGISTER")
    this.setState({
      showRegister:!this.state.showRegister,
      showEditor:!this.state.showEditor
    })
    //console.log(this.state.showRegister);

  }

  toggleDocuments(e,id) {
    console.log(id);
    e.preventDefault();
    this.setState({
      showDocuments: !this.state.showDocuments,
      documentID:id
    }, () => {

    fetch("http://localhost:8080/save/"+this.state.documentID, {
      method: "get",
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"}
    })
    .then((res)=>(res.json()))
    .then((json)=> {
      if(json.success === true) {
        console.log("JSON SUCCESS");
        var contentState = convertFromRaw(json.content);
        this.setState({
          editorState: EditorState.createWithContent(contentState)
        });
        //socket io to join a room
        this.state.socket.emit("roomId", this.state.documentID);
      }
    })
    .catch((error)=>(console.log(error)))})
  }
  // toggleDocumentId(e){
  //   e.preventDefault();
  //   this.setState({
  //     documentID:this.state.
  //   })
  // }


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


onAlignRight(e){
  e.preventDefault();
  this.onChange(RichUtils.toggleBlockType(this.state.editorState,"right"));
}


onAlignLeft(e){
  e.preventDefault();
  this.onChange(RichUtils.toggleBlockType(this.state.editorState,"left"));
}


onAlignCenter(e){
  e.preventDefault();
  console.log("Entered align center");
  this.onChange(RichUtils.toggleBlockType(this.state.editorState,"center"));
}

toggleBulletPoints(){
    this.onChange(
        RichUtils.toggleBlockType(
            this.state.editorState,
            'unordered-list-item'
        )
    )
}
toggleNumberedPoints(){
    this.onChange(
        RichUtils.toggleBlockType(
            this.state.editorState,
            'ordered-list-item'
        )
    )
}

saveEditor(e) {
  e.preventDefault();
  var convertedContent=convertToRaw(this.state.editorState.getCurrentContent())
  console.log("save triggered!!!!");
  console.log("DOC ID IS", this.state.documentID);
  fetch("http://localhost:8080/save/"+this.state.documentID, {
    method: "POST",
    credentials: "same-origin",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      contents: convertedContent
    })
  })
  .then((res) => {
     return res.json();
   })
   .then((json) => {
     console.log("JSON FOR EDITOR", json);
     if (json.success === true)
     {
       console.log("successfully updated the editor contents")
     }
   })
  .catch((error) => console.log("Error: ", error));
}

// myBlockStyleFn(contentBlock) {
//   const type = contentBlock.getType();
//   if (type === 'blockquote') {
//     return 'superFancyBlockquote';
//   }
// }




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

      {!this.state.showEditor && !this.state.showLogin?<div>
      <Registration loginFunction={(e)=>this.toggleLogin(e)}/>
    </div>: (!this.state.showEditor) && this.state.showLogin?
    <div>
      <Login registerFunction={(e)=>this.toggleRegister(e)}/>
    </div>: this.state.showEditor && this.state.showRegister && !this.state.showDocuments?
    <div>
      <Documents documentFunction={(e,id)=>this.toggleDocuments(e,id)}/>
    </div> :
    <div>
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

      <FlatButton//alignment
        icon = {<FormatAlignLeft/>}
        onMouseDown={(e) => {
        e.preventDefault();
        this.setState({showPopOverAlignment:true, fontMenuEl: e.currentTarget})
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
        <FlatButton
          icon = {<FormatListBulleted/>}
          onMouseDown={(e) => this.toggleBulletPoints(e)}>
        </FlatButton>
        <FlatButton
          icon={<FormatListNumbered/>}
          onMouseDown={(e) => this.toggleNumberedPoints(e)}>
        </FlatButton>
        <FontPicker
          apiKey = {process.env.FONTAPI}
          activeFont = {this.state.activeFont}
          onChange = {nextFont => this.setState({activeFont: nextFont.family})}/>
          <div className="apply-font">

            <FlatButton
              onMouseDown={(e) => this.saveEditor(e)}>Save
            </FlatButton>
    <Editor blockStyleFn={myBlockStyleFn} customStyleMap={styleMap} editorState={this.state.editorState} onChange={(editorState) => {this.onChange(editorState)}} style = {{border: "2px solid black", backgroundColor: "lightgrey"}} />



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
      <MenuItem primaryText="12" onMouseDown={e => this.onTwelveClick(e)}/>
      <MenuItem primaryText="14" onMouseDown={(e) => this.onFourteenClick(e)}/>
      <MenuItem primaryText="18" onMouseDown={(e) => this.onEighteenClick(e)}/>
      <MenuItem primaryText="36" onMouseDown={(e) => this.onThirtySixClick(e)}/>
     </Menu>
   </Popover>

         <Popover
           open={this.state.showPopOverAlignment}
           anchorEl={this.state.fontMenuEl}
           anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
           targetOrigin={{horizontal: 'left', vertical: 'top'}}
           onRequestClose={() => this.setState({showPopOverAlignment: false})}
         >
          <Menu>
            <MenuItem primaryText="Left" onMouseDown={(e) => this.onAlignLeft(e)}/>
            <MenuItem primaryText="Right" onMouseDown={(e) => this.onAlignRight(e)}/>
            <MenuItem primaryText="Center" onMouseDown={(e) => this.onAlignCenter(e)}/>
         </Menu>
        </Popover>
        </div>


      </div>}
    </div>);
  }
}
