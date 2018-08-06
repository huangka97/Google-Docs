import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Editor, EditorState, RichUtils} from 'draft-js';
import ColorPicker, {colorPickerPlugin} from 'draft-js-color-picker';

<RaisedButton color="primary">Bold</RaisedButton>

const presetColors = [
  '#ff00aa',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF'
];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.updateEditorState = editorState => this.setState({editorState});
    this.getEditorState = () => this.state.editorState;
    this.picker = colorPickerPlugin(this.updateEditorState, this.getEditorState);
    //   this.onChange = (editorState) => this.setState({editorState});
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
    this.setState({editorState});
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
    const {editorState} = this.state;
    <ColorPicker toggleColor={color => this.picker.addColor(color)} presetColors={presetColors} color={this.picker.currentColor(editorState)}/>
    <button onClick={this.picker.removeColor}>clear</button>
    // Optional: you can use an export the color styles if you plan to render html
    const inlineStyles = this.picker.exporter(editorState);
    const html = stateToHTML(this.state.editorState.getCurrentContent(), {inlineStyles});
    return (<div>
      <button onMouseDown={(e) => this.onBoldClick(e)}>BOLD</button>
      <button onMouseDown={(e) => this.onItalicsClick(e)}>Italics</button>
      <button onMouseDown={(e) => this.onUnderlineClick(e)}>Underline</button>
      <Editor editorState={this.state.editorState} onChange={(editorState) => {
          this.onChange(editorState)
        }} style={{
          border: "2px solid black",
          backgroundColor: "lightgrey"
        }}/>
    </div>);
  }
}
