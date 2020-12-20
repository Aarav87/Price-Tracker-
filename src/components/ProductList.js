import React, { Component } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons/';
import {db, auth, arrayUpdate} from '../firebase';
import EditProduct from './EditProduct'
import firebase from 'firebase/app';
import DeleteProduct from './DeleteProduct'

export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: this.props.list,
            showEditProduct: true,
            showDeleteProduct: true
        }

        this.showEditProduct = this.showEditProduct.bind(this)
        this.showDeleteProduct = this.showDeleteProduct.bind(this)
    }

    update(e) {
        this.props.update && this.props.update(e)
    }

    showEditProduct() {
        this.setState({showEditProduct: !this.state.showEditProduct})
    }

    showDeleteProduct() {
        this.setState({showDeleteProduct: !this.state.showDeleteProduct})
    }

    render() {        
        return (
            <div style={{border: '1px solid rgb(206, 212, 218)', textDecoration: 'none', maxHeight: 'auto', fontFamily: 'Verdana, Geneva, sans-serif'}} >
                {
                    this.state.list.youSave &&
                        <div style={{width: '100%', paddingLeft: '5px'}}>
                            <a style={{backgroundColor: '#ff3700', color: '#fff', fontSize: '12px', paddingLeft: '2px'}}>{this.state.list.youSave}&nbsp;</a> 
                        </div>
                }
                <a style={{textDecoration: 'none'}} href={this.state.list.url} target="_blank">
                    <img style={{height: '75px', width: '125px', padding: '10px', float: 'left'}} src={this.state.list.imageUrl} />
                    <h1 style={{fontSize: '15px', paddingTop: '7px', paddingLeft: '150px', textDecoration: 'none'}}>{this.state.list.productTitle.slice(0, 37)}...</h1>
                    <p style={{textDecoration: 'none', paddingLeft: '150px'}}>Current Price: {this.state.list.currentProductPrice.replace(/\s+/g, '')}</p>
                </a>
                <div style={{paddingTop: '1px', width: '382px', paddingBottom: '5px'}}>
                    <span>
                        <EditOutlined title="Edit Product"  onClick={this.showEditProduct} style={{color: '#000000', paddingTop: '5px', paddingLeft: '10px', outline: 'none'}}/>
                        <DeleteOutlined title="Delete Product" onClick={this.showDeleteProduct} style={{color: '#000000', paddingLeft: '10px', paddingRight: '98px', outline: 'none'}}/>
                        <input style={{width: '200px'}} type="number" min="0" value={this.state.list.desired_price} placeholder="Desired Price" readonly="true"/> 
                    </span>
                </div>
                <EditProduct show={this.state.showEditProduct} onClose={this.showEditProduct} list={this.state.list} />
                <DeleteProduct show={this.state.showDeleteProduct} onClose={this.showDeleteProduct} list={this.state.list} />
            </div>
            
        )
    }
}
