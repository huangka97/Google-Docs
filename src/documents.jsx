import React from 'react';


export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      password: "",
      documents: [],
      userDocs:[],
      docID: ""
    };
  }
  componentDidMount(){
    fetch("http://localhost:8080/user",{
      method:"GET",
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"},
    })
    .then((res)=>(res.json()))
    .then((json)=>{
      if(json.success===true){
        let userDocsCopy = this.state.userDocs.slice();
        userDocsCopy.push(json.user);
        this.setState({
          userDocs: userDocsCopy
        })
      }
    })
  }
  handleDocTitle(event)//get input for doc title
  {
    this.setState({title: event.target.value});
  }

  handleDocPassword(event)//get input for doc title
  {
    this.setState({password: event.target.value});
  }

  createDoc(event)//create document when button is pressed
  {
    event.preventDefault();//finish this...
    // console.log("TITLE====", this.state.title);
    // console.log("PASS====", this.state.password);
    fetch("http://localhost:8080/create", {
      method: "POST",
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: this.state.title,
        password: this.state.password,
        contents: "",
        url: "",
        ownerOfDoc: "",
        collabsOfDoc: ""
      })
    })
    .then((res) => {
      // console.log("DOCUMENT RES IS: ", res);
       return res.json();
     })
     .then((json) => {
       // console.log("DOCUMENT JSON IS ", json);
       if (json.success === true)
       {
         // console.log("In the if statement!");
         this.setState({
           title: "",
           password: "",
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
        <input type = "text" placeholder = "paste a doc ID shared with you" onChange = {(event) => this.handleDocID(event)}/>
        <button onClick = {(event) => this.addSharedDoc(event)}>Add Shared Document</button>
      </div>
    );
  }
}
