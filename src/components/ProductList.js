import React, { Component } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons/';
import {db, auth, arrayUpdate} from '../firebase';
import EditProduct from './EditProduct'

export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: this.props.list,
            showEditProduct: true
        }

        this.showEditProduct = this.showEditProduct.bind(this)
    }

    update(e) {
        this.props.update && this.props.update(e)
    }

    deleteProduct(id) {
        var ref = db.collection('users').doc(this.state.list.uid).collection('products').doc(id)
        ref.delete()

        setTimeout(this.updateList, 5000)
    }

    showEditProduct() {
        this.setState({showEditProduct: !this.state.showEditProduct})
    }

    render() {    
        return (
            <div style={{border: '1px solid rgb(206, 212, 218)', textDecoration: 'none', maxHeight: 'auto', paddingTop: '10px'}} >
                <a style={{textDecoration: 'none'}} href={this.state.list.url} target="_blank">
                    <img style={{height: '75px', width: '125px', padding: '10px', float: 'left'}} src={this.state.list.imageUrl} />
                    <h1 style={{fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '15px', paddingTop: '7px', paddingLeft: '150px', textDecoration: 'none'}}>{this.state.list.productTitle.slice(0, 37)}...</h1>
                    <p style={{textDecoration: 'none', paddingLeft: '150px', fontFamily: 'Verdana, Geneva, sans-serif'}}>Current Price: {this.state.list.currentProductPrice.replace(/\s+/g, '')}</p>
                </a>
                <div style={{paddingTop: '1px', width: '382px', paddingBottom: '5px'}}>
                    <span>
                        <EditOutlined title="Edit Product"  onClick={this.showEditProduct} style={{color: '#000000', paddingTop: '5px', paddingLeft: '10px', outline: 'none'}}/>
                        <DeleteOutlined title="Delete Product" onClick={e => this.deleteProduct(e.currentTarget.id)} style={{color: '#000000', paddingLeft: '10px', paddingRight: '98px', outline: 'none'}}/>
                        <input style={{width: '200px'}} type="number" min="0" value={this.state.list.desired_price} placeholder="Desired Price" readonly="true"/> 
                    </span>
                </div>
                <EditProduct show={this.state.showEditProduct} onClose={this.showEditProduct} list={this.state.list} />
            </div>
            
        )
    }
}
