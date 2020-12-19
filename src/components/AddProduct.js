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
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '100%', height: 800}}>
                <div style={{position: 'fixed', top: 7, right: 7}}>
                    <CloseOutlined onClick={e => this.onClose(e)}/>
                </div>
                <div style={{backgroundColor: '#fff', paddingLeft: '150px', fontFamily: 'Verdana, Geneva, sans-serif', height: '100px'}}>
                    <input type="text" name="url" value={this.state.url} onChange={this.onChange}/> 
                    <input type="number" name="desired_price" value={this.state.desired_price} onChange={this.onChange} />
                </div>
                <div style={{backgroundColor: '#fff', height: '70px', position: 'fixed', bottom: '0px', left: '6px', width: '96%'}}>
                    <button 
                        style={{width: '100%', backgroundColor: '#54b947', height: '60px', borderRadius: '5px', border: 'none', fontFamily: 'Verdana, Geneva, sans-serif'}} 
                        onClick={e => {this.url(); this.desiredPrice(); setTimeout(this.handler(e), 3000)}}
                    >Add Product
                    </button>
                </div>
                    
            </div>
        )
    }
}