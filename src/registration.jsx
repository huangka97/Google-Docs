import React from 'react';
var express = require('express');//does this go here?
var models = require("../src/models/models");
var User = models.User;

import Login from "./login"


export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleUsername(event)//get username
  {
    this.setState({username: event.target.value});
  }

  handlePassword(event)//get password
  {
    this.setState({password: event.target.value});
  }

  handleSubmit(event)//submit username and password and save to database
  {

   event.preventDefault();
   fetch("http://localhost:8080/register",{
     method:"POST",
     credentials:"same-origin",
     headers:{
       "Content-Type":"application/json"
     },
     body: JSON.stringify({
       username:this.state.username,
       password:this.state.password
     })

   })
   .then((res)=>(res.json()))
   .then((json)=>{
     console.log(json);
     if(json.success=== true){
       this.setState({
         username:"",
         password:""
       })
       this.props.loginFunction(event);

     }
   })
   .catch((err)=>console.log("Error",err))


  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <input type = "text" placeholder = "username" name="username" onChange = {(event) => this.handleUsername(event)} value={this.state.username}/>
        <input type = "password" placeholder = "password" name="password" onChange = {(event) => this.handlePassword(event)} value={this.state.password} />
        <button className="btn btn-default" onClick = {(event) => this.handleSubmit(event)}>Register</button>
      </div>
    )
  }
}
