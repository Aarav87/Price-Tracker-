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

    onInputChange(e) {
        this.props.onInputChange && this.props.onInputChange(e)
    }

    addProduct(e) {
        this.props.addProduct && this.props.addProduct(e)
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
                    <input type="text" name="url" value={window.location.href} onChange={this.onInputChange}/>
                    <input type="number" />
                </div>
                <div>
                    <button onClick={e => this.addProduct(e)}>Add Product</button>
                </div>
                    
            </div>
        )
    }
}