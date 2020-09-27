import React, { Component } from 'react';
import './App.css';
import logo from './logo.png'
import request from 'request';
import cheerio from 'cheerio';
import { InputNumber } from 'antd';
import AddProduct from './components/AddProduct';
import {db, auth} from './firebase'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pricepoint: '',
      showAddProduct: true,
      users: null, 
      url: "",
      desired_price: 0
    }

    this.handleClick = this.handleClick.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.showAddProduct = this.showAddProduct.bind(this)
    this.addProduct = this.addProduct.bind(this)
  }

  componentDidMount() {
    db.collection('/users/7pIF37Zils2CX14bZIaP/products')
      .get()
      .then( snapshot => {
        const users = []
        snapshot.forEach(doc => {
          const data = doc.data()
          users.push(data)
        })
        this.setState({users: users})
      })
      .catch(error => console.log(error))

  }

  showAddProduct() {
    this.setState({showAddProduct: !this.state.showAddProduct})
  }

  addProduct() {
    db.collection('/users/7pIF37Zils2CX14bZIaP/products')
      .add({
        url: this.state.url,
        desired_price: this.state.desired_price
      });

    db.collection("students")
      .get()
      .then(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          users.push(data);
          this.setState({
            users: users,
            url: "",
            desired_price:0
          });
        });
      })
      .catch(error => console.log(error));

  }

  onInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  handleClick() {
    let url = window.location.href;
    const pricepoint = this.state.pricepoint
  
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        const $ = cheerio.load(body)
        const price = $('.a-span12')
        const pricev2 = price.text().toString().replace(/\s\s+/g, '')
        
        const pricev3 = pricev2.slice(pricev2.indexOf('$') + 2, pricev2.indexOf('DetailsLoad')-17)
        const finalprice = pricev3.split('.')

        if(finalprice[0] < pricepoint) {
          alert('Price is lower stupid')
        }
      }
    })
  }

  render() {
    return (
      <div class="App">
        <header class="App-header">
          <div class="product-list">
            <div class="product" >
              <a href="https://www.amazon.ca/Redragon-K582-Mechanical-Ergonomic-Actuation/dp/B07KCRTN9Q/ref=redir_mobile_desktop?ie=UTF8&aaxitk=PXxuFPVOgpUiUysGc2oqhg&hsa_cr_id=2788190190801&pd_rd_r=7664c339-b954-4e7f-b6c5-fecdee9dd437&pd_rd_w=vWYIQ&pd_rd_wg=8fJBf&ref_=sbx_be_s_sparkle_mcd_asin_0_img" target="_blank">
                <img src="https://images-na.ssl-images-amazon.com/images/I/61nmLAAtdlL._AC_SL1500_.jpg" />
                <h1>Redragon K582 SURARA RGB Gaming Keyboard...</h1>
                <p>Current Price: CDN$ 61.74</p>
              </a>
              <div class="desired-price-input">
                <input type="number" min="0" placeholder="Desired Price"/> 
              </div>
            </div>
          </div>
          {
            this.state.users && 
            this.state.users.map(user => {
              return (
                <div>
                  <p>{user.desired_price}</p>
                </div>
              )
            })
          }
          <div class="add-product-div">
            <div style={{paddingTop: '2px'}}>
              <button onClick={this.showAddProduct} class="add-product">Add Product</button>
            </div>
          </div>
          <AddProduct onChange={this.onInputChange} addProduct={this.addProduct} show={this.state.showAddProduct} onClose={this.showAddProduct} />
        </header>
      </div>
    );
  }
}

export default App;
