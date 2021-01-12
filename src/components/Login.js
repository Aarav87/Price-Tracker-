import React, { Component } from 'react';
import { CloseOutlined } from '@ant-design/icons/'
import axios from 'axios';
import { auth } from '../firebase';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: null
        }

        this.onChange = this.onChange.bind(this)
        this.loginEmailPassword = this.loginEmailPassword.bind(this)

    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    loginEmailPassword() {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                const data = {
                    email: this.state.email
                }

                axios.post('http://localhost:3001/onLogin', data)
            })
            .catch((error) => {
                this.setState({
                    error: error.message
                })
            })    
    }

    render() {
         if(this.props.show) {
            return null;
        }   
        return(
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '100%', height: 800, fontFamily: 'Verdana, Geneva, sans-serif'}}>
                <div style={{position: 'fixed', top: 7, right: 7}}>
                    <CloseOutlined onClick={e => this.onClose(e)}/>
                </div>
                <div style={{backgroundColor: '#fff', position: 'fixed', top: '40px', left: '155px'}}>
                    <h1>Login</h1>
                </div>
                <div>
                    <p style={{position: 'fixed', top: '110px', left: '75px'}}>Email</p>
                    <input 
                        type="text"
                        name="email"
                        style={{position: 'fixed', top: '125px', left: '130px', width: '200px'}} 
                        value={this.state.email} 
                        onChange={this.onChange}
                        placeholder="e.g pricetracker@gmail.com"
                        required="true"
                    />
                </div>
                <div>
                    <p style={{position: 'fixed', top: '140px', left: '40px'}}>Password</p>
                        <input
                            type="password"
                            name="password"
                            style={{position: 'fixed', top: '155px', left: '130px', width: '200px'}} 
                            value={this.state.password} 
                            onChange={this.onChange}
                            required="true"
                        />
                </div>
                <div style={{height: '70px', position: 'fixed', top: '200px', left: '40px', width: '80%', textAlign: 'center'}}>
                    <button 
                        style={{width: '100%', backgroundColor: '#FF0000', color: '#fff', height: '30px', borderRadius: '5px', border: 'none'}} 
                        onClick={this.loginEmailPassword}
                    >Login
                    </button>
                </div>
                <div style={{height: '70px', position: 'fixed', top: '220px', left: '40px', width: '80%', textAlign: 'center'}} >
                    <p>or</p>
                    <button 
                        style={{width: '100%', backgroundColor: '#0a1d70', color: '#fff', height: '30px', borderRadius: '5px', border: 'none'}} 
                    >Login With Google
                    </button>
                    <p style={{fontSize: '10px'}}>Don't have an account? <a style={{color: '#3e7aa8'}}>Sign up here</a></p>
                    <p style={{fontSize: '10px', color: '#3e7aa8'}}>Forgot Password?</p>
                </div>
                {
                    this.state.error && 
                    <div style={{color: '#FF0000', width: '80%', position: 'fixed', left: '40px', top: '350px', fontSize: '10px', textAlign: 'left'}}>
                        <p style={{width: '100%'}}>*{this.state.error}</p>
                    </div>
                }
            </div>
        )
    }
}