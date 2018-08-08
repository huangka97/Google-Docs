import React from 'react';


export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docToCreate: "",
      documents: [],
      docID: ""
    };
  }

  handleDocTitle(event)//get input for doc title
  {
    this.setState({docsToCreate: event.target.value});
  }

  createDoc(event)//create document when button is pressed
  {
    event.preventDefault();//finish this...
//    fetch("")
  this.props.documentFunction(event);
  }

  handleDocID(event)
  {
    this.setState({docsToCreate: event.target.value});
  }

  addSharedDoc(event)//create document when button is pressed
  {
    event.preventDefault();//finish this...
//    fetch("localhost:3000/documents
  }

//LINKS OF DOCUMENTS SHOULD BE CLICKABLE AND REDIRECT CORRECTLY


  render() {
    return (
      <div>
        <h1>Documents Portal</h1>
        <input type = "text" placeholder = "New document title" onChange = {(event) => this.handleDocTitle}/>
        <button onClick = {(event) => this.createDoc(event)}>Create Document</button>
        {/* <ul>{this.state.documents.map((doc) => <li>{doc}</li>}</ul> */}
        <input type = "text" placeholder = "paste a doc ID shared with you" onChange = {(event) => this.handleDocID}/>
        <button onClick = {(event) => this.addSharedDoc(event)}>Add Shared Document</button>
      </div>
    );
  }
}
