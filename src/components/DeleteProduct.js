import React, { Component } from 'react';
import { CloseOutlined } from '@ant-design/icons/';
import firebase from 'firebase/app';
import {db, auth, arrayUpdate} from '../firebase';

export default class DeleteProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: this.props.list
        }
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    deleteProduct() {
        const email = firebase.auth().currentUser.email;
        const productTitle = this.state.list.productTitle.replace('/', ' ')
        
        var ref = db.collection('users').doc(email).collection('products').doc(productTitle)
        ref.delete() 
    }

    render() {
         if(this.props.show) {
            return null;
        }   
        return(
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '300px', height: '100px', fontFamily: 'Verdana, Geneva, sans-serif', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px'}}>
                <p style={{fontSize: '13px'}}>Are you sure you want to stop tracking this product</p>
                <button 
                    style={{width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#FFFFFF', height: '30px'}} 
                    onClick={e => this.onClose(e)}
                >Cancel
                </button>
                <button 
                    style={{width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#0a1d70', height: '30px', color: '#FFFFFF'}} 
                    onClick={() => this.deleteProduct()}
                >Yes
                </button>
            </div>
        )
    }
}