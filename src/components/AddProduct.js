import React, { Component } from 'react';
import { Input } from 'antd';
import { CloseOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons/'


const backdroupStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0, 
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: 800
}

const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: 5, 
    maxWidth: 500,
    minHeight: 371,
    margin: '0 auto',
    paddingLeft: 10,
    position: 'relative',
}

const closeIconStyle = {
    position: 'fixed',
    top: 7,
    right: 7
}

const inputStyle = {
    backgroundColor: '#fff'
}

export default class AddProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: window.location.href
        }

    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    handler() {
        this.props.handler(this.state.url)
    }

    render() {
        if(this.props.show) {
            return null;
        }   
        return(
            <div style={backdroupStyle}>
                <div style={closeIconStyle}>
                    <CloseOutlined onClick={e => this.onClose(e)}/>
                </div>
                <div style={inputStyle}>
                    <input type="text" name="url" value={this.state.url}/>    
                </div>
                <div>
                    <button onClick={e => this.handler(e)}>Add Product</button>
                </div>
                    
            </div>
        )
    }
}