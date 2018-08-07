import React from 'react';
var express = require('express');//does this go here?
var models = require("./src/models/models.js");
var User = models.User;


class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),//this probably isn't necessary
      username: "",
      password: ""//add empty documents (collaborated on) array?
    };
  }

  handleUsername(event)//get username
  {
    this.setState({username: event.target.value});
  }

  handlePassword(event)//get password
  {
    this.setState({password: event.target.password});
  }

  handleSubmit(event)//submit username and password and save to database
  {

   event.preventDefault();
   fetch("/register",{
     method:"POST",
     credentials:"same-origin",
     headers:{
       "Content-Type":"application/json"
     },
     body:JSON.stringify({
       username:this.state.username,
       password:this.state.password
     })

   }).then((res)=>{res.json()

   }).then((json)=>{
     if(json.success==="true"){

     }
   }).catch((err)=>console.log("Error",err))

  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <input type = "text" placeholder = "Username" onChange = {(event) => this.handleUsername}>
        <input type = "text" placeholder = "Password" onChange = {(event) => this.handlePassword}>
        <button className="btn btn-default" onClick = {(event) => this.handleSubmit(event)}>Login</button>
      </div>
    );
  }
}


//LESSONS: USE ARROW FUNCTIONS INSTEAD OF BIND, ALWAYS RETURN (, FORMS ARE RETARDED:

export default Registration;
