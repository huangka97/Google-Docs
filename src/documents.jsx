import React from 'react';

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <ul>{this.props.docList.map((doc) => <li>{doc.title}</li>)}</ul>
    )
  }
}


export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      password: "",
      userDocs:[]
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
      console.log("JSON IN COMPONENT DID MOUNT",json);
      if(json.success===true){
        //populated user docs now
          this.setState({
            userDocs: json.user.usersDocs
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
       console.log("JSON AFTER ADDED DOC", json);
       if (json.success === true)
       {
         // console.log("In the if statement!");
         var userDocsCopy = this.state.userDocs.slice();
         userDocsCopy.push(json.document);
         this.setState({
           title: "",
           password: "",
           userDocs: userDocsCopy
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
    // const renderDocs = () => {
    //   return this.state.usersDocs.map((doc, i) => {
    //     return (
    //       <h1 key={i}>{doc.title}</h1>
    //     );
    //   });
    // }
    // console.log(this.state);
    return (
      <div>
        <h1>Documents Portal</h1>
        <input type = "text" placeholder = "New document title" name = "title" onChange = {(event) => this.handleDocTitle(event)} value={this.state.title}/>
        <input type = "password" placeholder = "New document password" name = "password" onChange = {(event) => this.handleDocPassword(event)} value={this.state.password}/>
        <button onClick = {(event) => this.createDoc(event)}>Create Document</button>
        <input type = "text" placeholder = "paste a doc ID shared with you" onChange = {(event) => this.handleDocID(event)}/>
        <button onClick = {(event) => this.addSharedDoc(event)}>Add Shared Document</button>
        <DocumentList docList = {this.state.userDocs} />
      </div>
    );
  }
}
