import React, { Component } from "react";
import { connect } from "react-redux";
import { Auth } from "aws-amplify";
import FormErrors from "./FormErrors";
import { logIn } from "../actions/authActions";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        blankfield: false
      }
    };
  }

  // test function
  getSession = () => {
    Auth.currentAuthenticatedUser({})
      .then(user => console.log("user data" + user))
      .catch(err => console.log(err));
    Auth.currentSession()
      .then(data => console.log("session data" + data))
      .catch(err => console.log("session error" + err));
  };

  validateForm = event => {
    const { email, password } = this.state;

    // clear all error messages
    const inputs = document.getElementsByClassName("invalid");
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].classList.contains("error")) {
        inputs[i].classList.remove("invalid");
      }
    }

    this.setState({
      errors: {
        blankfield: false
      }
    });

    if (email === "") {
      this.setState({
        errors: { ...this.state.errors, blankfield: true }
      });
      document.getElementById("email").classList.add("invalid");
      return;
    }
    if (password === "") {
      this.setState({
        errors: { ...this.state.errors, blankfield: true }
      });
      document.getElementById("password").classList.add("invalid");
      return;
    }
    return;
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.validateForm(event);
    try {
      const authenticatedUser = await Auth.signIn(
        this.state.email,
        this.state.password
      );
      console.log(authenticatedUser);
      this.props.logIn();
      this.props.history.push("/");
      this.getSession();
    } catch (error) {
      console.loh(error.message);
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("invalid");
  };

  render() {
    return (
      <div className="mt-5">
        <h2>Log in</h2>
        <FormErrors registrationerrors={this.state.errors} />
        <form className="col-6 mt-4" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={this.state.email}
              onChange={this.onInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.onInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log in
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { logIn }
)(LogIn);
