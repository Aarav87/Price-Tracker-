import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

export default class EditProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: this.props.list,
            desired_price: 'Empty',
            data: null,
            options: null
        }

        this.onChange = this.onChange.bind(this)
        this.desiredPrice = this.desiredPrice.bind(this)
        this.saveChanges = this.saveChanges.bind(this)
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e)
    }

    saveChanges() {
        const productTitle = this.state.list.productTitle.replace('/', ' ')
        const desired_price = this.state.desired_price
        
        const data = {
            productTitle: productTitle,
            desired_price: desired_price
        }

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/saveChanges`, data)
    }

    onChange(e) {
        if(e.target.value < parseInt(this.state.list.currentProductPrice.slice(5, this.state.list.currentProductPrice.length))) {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    desiredPrice() {
        const priceHistory = []
        this.state.list.priceHistory.forEach(price => {
            priceHistory.push(parseInt(price.slice(5, price.length), 10))
        });

        this.setState({
            desired_price: this.state.list.desired_price,
            data: {
                labels: this.state.list.dateRecorded,
                datasets: [{
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: '#54b947',
                    borderColor: '#000000',
                    borderWidth: 2,
                    data: priceHistory
                }]
            }, 
            options: {
                legend: {
                    display: false
                }
            } 
        })
    }

    render() { 
        if(this.state.desired_price === "Empty") {
            this.desiredPrice()
        }

        if(this.props.show) {
            return null;
        }   

        return(
            <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#fff', width: '100%', height: 800, fontFamily: 'Verdana, Geneva, sans-serif'}}>
                <div style={{paddingTop: '3px'}}>
                    <a style={{textDecoration: 'none'}} href={this.state.list.url} target="_blank">
                        <img style={{height: '75px', width: '125px', padding: '10px', float: 'left'}} src={this.state.list.imageUrl} />
                        <h1 style={{fontSize: '15px', paddingTop: '7px', paddingLeft: '150px', textDecoration: 'none'}}>{this.state.list.productTitle.slice(0, 37)}...</h1>
                        <p style={{paddingLeft: '150px'}}>Current Price: {this.state.list.currentProductPrice.replace(/\s+/g, '')}</p>
                    </a>
                    <div style={{paddingLeft: '150px'}}>
                        <input style={{width: '200px'}} type="number" min="0" value={this.state.desired_price} placeholder="Desired Price" readonly="true"/> 
                    </div>
                    <hr style={{border: 'none', borderBottom: '1px solid #000000', width: '90%', paddingTop: '5px'}} /> 
                </div>
                <div style={{backgroundColor: '#fff', paddingLeft: '150px', height: '100px'}}>
                    <p style={{position: 'fixed', left: '20px'}}>Desired Price</p>
                    <input style={{width: '200px'}} type="number" name="desired_price" maxlength={this.state.list.desired_price.slice(4, this.state.list.desired_price.length).length} value={this.state.desired_price} onChange={this.onChange} />
                </div>
                <div style={{width: '93%', position: 'fixed', left: '25px', top: '190px'}}>
                    <Line 
                        data={this.state.data}
                        options={this.state.options}
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
                        onClick={() => this.saveChanges()}
                    >Save Changes
                    </button>
                </div>
            </div>
        )
    }
}