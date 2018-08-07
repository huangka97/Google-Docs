import React from 'react';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      username: "",
      password: ""
    };
  }

/*
  componentWillUnmount() {
    console.log("will unmount");
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    });
*/

  handleUsername(event)//get username
  {
    this.setState({username: event.target.value});
  }

  handlePassword(event)//get password
  {
    this.setState({password: event.target.password});
  }

  handleSubmit(event)//submit username and password
  {
    event.preventDefault();//finish this...
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <input type = "text" placeholder = "Username" onChange = {(event) => this.handleUsername}>
        <input type = "text" placeholder = "Password" onChange = {(event) => this.handlePassword}>
        <button className="btn btn-default" onClick = {(event) => this.handleSubmit(event)}>Login</button>
      </div>
    );
  }
}


//LESSONS: USE ARROW FUNCTIONS INSTEAD OF BIND, ALWAYS RETURN (, FORMS ARE RETARDED:

export default Login;
