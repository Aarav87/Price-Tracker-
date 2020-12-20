import React, { Component } from 'react';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons/'

export default class AddProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: window.location.href,
            desired_price: 15
        }

        this.onChange = this.onChange.bind(this)

    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    url() {
        this.props.url(this.state.url)
    }

    desiredPrice() {
        this.props.desiredPrice(this.state.desired_price)
    }

    handler(e) {
        this.props.handler && this.props.handler(e)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        if(this.props.show) {
            return null;
        }   
        return(
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '100%', height: 800, fontFamily: 'Verdana, Geneva, sans-serif'}}>
                <div style={{backgroundColor: '#fff', position: 'fixed', top: '40px', left: '90px'}}>
                    <h1>Add Product</h1>
                </div>
                <div>
                    <p style={{position: 'fixed', top: '110px', left: '40px'}}>Product URL</p>
                    <input 
                        type="text"
                        name="url"
                        style={{position: 'fixed', top: '125px', left: '150px', width: '200px'}} 
                        value={this.state.url} 
                        onChange={this.onChange}
                    />
                </div>
                <div>
                    <p style={{position: 'fixed', top: '140px', left: '40px'}}>Desired Price</p>
                        <input
                            name="desired_price"
                            style={{position: 'fixed', top: '155px', left: '150px', width: '200px'}} 
                            value={this.state.desired_price} 
                            onChange={this.onChange}
                        />
                </div>
                <div style={{backgroundColor: '#FFFFFF', height: '70px', position: 'fixed', bottom: '0px', left: '20px', width: '96%'}}>
                    <button 
                        style={{position: 'fixed', bottom: '10px', left: '15px', width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', fontFamily: 'Verdana, Geneva, sans-serif', backgroundColor: '#FFFFFF', height: '40px'}} 
                        onClick={e => this.onClose(e)}
                    >Close
                    </button>
                   
                    <button 
                        style={{position: 'fixed', bottom: '10px', right: '20px', width: '45%', border: '1px solid rgb(206, 212, 218)', borderRadius: '5px', fontFamily: 'Verdana, Geneva, sans-serif', backgroundColor: '#0a1d70', height: '40px', color: '#FFFFFF'}} 
                        onClick={e => {this.url(); this.desiredPrice(); setTimeout(this.handler(e), 3000)}}
                    >Add Product
                    </button>
                </div>
                    
            </div>
        )
    }
}