import React from 'react';


export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docToCreateTitle: "",
      docToCreatePassword: "",
      documents: [],
      docID: ""
    };
  }

  handleDocTitle(event)//get input for doc title
  {
    this.setState({docToCreateTitle: event.target.value});
  }

  handleDocPassword(event)//get input for doc title
  {
    this.setState({docToCreatePassword: event.target.value});
  }

  createDoc(event)//create document when button is pressed
  {
    event.preventDefault();//finish this...
    console.log("TITLE====", this.state.docToCreateTitle);
    console.log("PASS====", this.state.docToCreatePassword);
    fetch("http://localhost:8080/create", {
      method: "POST",
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: this.state.docToCreateTitle,
        password: this.state.docToCreatePassword,
        contents: "",
        url: "",
        ownerOfDoc: "",
        collabsOfDoc: ""
      })
    })
    .then((res) => {
      console.log("DOCUMENT RES IS: ", res);
       return res.json();
     })
     .then((json) => {
       console.log("DOCUMENT JSON IS ": json);
       if (json.success === true)
       {
         this.setState({
           docToCreateTitle: "",
           docToCreatePasssword: "",
         });
        //INSERT TOGGLE TO GET TO EDITOR
       }
     })
     .catch((error) => console.log("Error: ", error));
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
///create is the route


  render() {
    return (
      <div>
        <h1>Documents Portal</h1>
        <input type = "text" placeholder = "New document title" name = "title" onChange = {(event) => this.handleDocTitle(event)} value={this.state.title}/>
        <input type = "password" placeholder = "New document password" name = "password" onChange = {(event) => this.handleDocPassword(event)} value={this.state.password}/>
        <button onClick = {(event) => this.createDoc(event)}>Create Document</button>
        {/* <ul>{this.state.documents.map((doc) => <li>{doc}</li>}</ul> */}
        <input type = "text" placeholder = "paste a doc ID shared with you" onChange = {(event) => this.handleDocID}/>
        <button onClick = {(event) => this.addSharedDoc(event)}>Add Shared Document</button>
      </div>
    );
  }
}
