import React, { Component } from 'react'

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        }
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    signOut(e) {
        this.props.signOut && this.props.signOut(e)
    }

    render() {
        if(this.props.show) {
            return null;
        }   
        return (
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '100%', height: 800, fontFamily: 'Verdana, Geneva, sans-serif'}}>
                {
                    this.state.user.photoURL ? 
                        <img 
                            src={this.state.user.photoURL} 
                            style={{position: 'fixed', top: '10px', right: '100px', height: '150px', width: '150px', borderRadius: '50%', color: '#FFF', display: 'inline-block'}} 
                        /> : 
                        <div 
                            style={{position: 'fixed', top: '10px', right: '100px', height: '150px', width: '150px', borderRadius: '50%', backgroundColor: '#808080', color: '#FFF', display: 'inline-block', textAlign: 'center', lineHeight: '150px', fontSize: '120px'}}
                        >
                            {this.state.user.email.charAt(0).toUpperCase()}
                        </div>
                }

                <div>
                    <p style={{position: 'fixed', top: '165px', left: '75px'}}>Email</p>
                    <input 
                        style={{position: 'fixed', top: '180px', left: '130px', width: '200px'}} 
                        value={this.state.user.email} 
                        readonly="true" 
                    />
                </div>
                <div>
                    <p style={{position: 'fixed', top: '195px', left: '40px'}}>Password</p>
                    <input
                        type="password" 
                        style={{position: 'fixed', top: '210px', left: '130px', width: '200px'}} 
                        value={this.state.user.providerData[0].providerId} 
                        readonly="true" 
                    />
                </div>
                <div>
                    <p 
                        style={{position: 'fixed', top: '227px', left: '40px', fontSize: '10px'}}
                    >Notifications when desired price is met
                    </p>
                    <input 
                        type="checkbox" 
                        style={{position: 'fixed', top: '234px', left: '142px', width: '200px'}} 
                    />
                </div>
                <div style={{backgroundColor: '#FFFFFF', height: '70px', position: 'fixed', bottom: '0px', left: '20px', width: '96%'}}>
                    <button 
                        style={{position: 'fixed', bottom: '10px', left: '15px', width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#FFFFFF', height: '40px'}} 
                        onClick={e => this.onClose(e)}
                    >Close
                    </button>
                   
                    <button 
                        style={{position: 'fixed', bottom: '10px', right: '20px', width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#0a1d70', height: '40px', color: '#FFFFFF'}} 
                        onClick={e => this.signOut(e)}
                    >Sign Out
                    </button>
                </div>
            </div>
        )
    }
}

export default UserProfile