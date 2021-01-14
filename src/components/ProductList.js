import React, { Component } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons/';
import EditProduct from './EditProduct'
import axios from 'axios';

export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: this.props.list,
            showEditProduct: true,
            showDeleteProduct: false
        }

        this.showEditProduct = this.showEditProduct.bind(this)
        this.showDeleteProduct = this.showDeleteProduct.bind(this)
    }

    update(e) {
        this.props.update && this.props.update(e)
    }

    editProduct(e) {
        this.props.editProduct && this.props.editProduct(e)
    }

    showEditProduct() {
        this.setState({showEditProduct: !this.state.showEditProduct})
    }

    showDeleteProduct() {
        this.setState({showDeleteProduct: !this.state.showDeleteProduct})
    }

    deleteProduct() {
        const productTitle = this.state.list.productTitle.replace('/', ' ')

        const data = {
            productTitle
        }

        axios.post('http://localhost:3001/deleteProduct', data)
        
        this.update()
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
                        <EditOutlined title="Edit Product"  onClick={e => {this.editProduct(e); this.showEditProduct()}} style={{color: '#000000', paddingTop: '5px', paddingLeft: '10px', outline: 'none'}}/>
                        <DeleteOutlined title="Delete Product" onClick={this.showDeleteProduct} style={{color: '#000000', paddingLeft: '10px', paddingRight: '98px', outline: 'none'}}/>
                        <input style={{width: '200px'}} type="number" min="0" value={this.state.list.desired_price} placeholder="Desired Price" readonly="true"/> 
                    </span>
                </div>
                <EditProduct show={this.state.showEditProduct} onClose={e => {this.editProduct(e); this.showEditProduct()}} list={this.state.list} />
                {
                    this.state.showDeleteProduct &&
                        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 800, background: 'rgba(0, 0, 0, 0.5)'}}>
                            <div style={{position: 'fixed', top: '100px', left: '50px', backgroundColor: '#fff', width: '300px', height: '100px', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px'}}>
                                <p style={{fontSize: '13px', paddingLeft: '5px'}}>Are you sure you want to stop tracking this product</p>
                                <button 
                                    style={{width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#FFFFFF', height: '30px'}} 
                                    onClick={() => this.showDeleteProduct()}
                                >Cancel
                                </button>
                                <button 
                                    style={{width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', backgroundColor: '#0a1d70', height: '30px', color: '#FFFFFF'}} 
                                    onClick={() => this.deleteProduct()}
                                >Yes
                                </button>
                            </div>
                        </div>
                }
            </div>
            
        )
    }
}
