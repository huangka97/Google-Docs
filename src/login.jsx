import React from 'react';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
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

  handleSubmit(event)//submit username and password when button is clicked
  {
    console.log("ENTERED LOGIN HANDLE SUBMIT");
    event.preventDefault();//finish this...
    fetch("http://localhost:8080/login",{
      method:"POST",
      credentials:"same-origin",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username:this.state.username,
        password:this.state.password
      })
    })
    .then((res)=>{
      console.log("RES IS", res);
      return res.json()
    })
    .then((json)=>{
      console.log("JSON ISSSSSSSSS", json);
      if(json.success === true) {
        this.setState({
          username:"",
          password:""
        })
        this.props.registerFunction(event);
      }

    })
    .catch((err)=>console.log("Error",err))

  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <input type = "text" placeholder = "Username" value={this.state.username} name="username" onChange = {(event) => this.handleUsername(event)}/>
        <input type = "text" placeholder = "Password" value={this.state.password} name="password" onChange = {(event) => this.handlePassword(event)}/>
        <button className="btn btn-default" onClick = {(event) => this.handleSubmit(event)}>Login</button>
      </div>
    );
  }
}


//LESSONS: USE ARROW FUNCTIONS INSTEAD OF BIND, ALWAYS RETURN (, FORMS ARE RETARDED:

export default Login;
