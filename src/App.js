import React, { Component } from 'react';
import './App.css';
import logo from './logo.png'
import request from 'request';
import cheerio from 'cheerio';
import { InputNumber } from 'antd';
import AddProduct from './components/AddProduct';
import {db, auth} from './firebase'
import ProductList from './components/ProductList'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProduct: true,
      users: null, 
      uid: '',
      url: "Link",
      productTitle: '',
      desired_price: 0,
      currentProductPrice: 0,
      imageUrl: ''
    }

    this.showAddProduct = this.showAddProduct.bind(this)
    this.getUrl = this.getUrl.bind(this)
    this.getDesiredPrice = this.getDesiredPrice.bind(this)
    this.handler = this.handler.bind(this)
  }
  
  componentDidMount() {
    auth.signInAnonymously().catch(function(error) {
      console.log('error')
    });
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        this.setState({
          uid: uid
        })
      } else {
        console.log('error')
      }
        
    });  
  }

  showAddProduct() {
    this.setState({showAddProduct: !this.state.showAddProduct})
  }

  getUrl(value) {
    this.setState({
      url: value
    })
  }

  getDesiredPrice(value) {
    this.setState({
      desired_price: value
    })
    
  }
  
  handler() {
    const getProductDetails = () => {
      var options = {
        url: this.state.url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }
      };

      request(options, (error, response, html) => {
        if (!error) {
          // Use Cheerio to load the page.
          var $ = cheerio.load(html);
          const productTitle = $('#titleSection').text().replace(/\s\s+/g, '')
          const currentPrice = $('#priceblock_ourprice').text().replace(/\s\s+/g, '')
          const imageUrl = $('#landingImage').attr("data-old-hires")

          this.setState({
            productTitle: productTitle,
            currentProductPrice: currentPrice,
            imageUrl: imageUrl
          })
        }
      })
    }

    const addProduct = () => {
      db.collection(`/users/${this.state.uid}/products`)
        .add({
          url: this.state.url,
          productTitle: this.state.productTitle,
          currentProductPrice: this.state.currentProductPrice,
          desired_price: this.state.desired_price,
          imageUrl: this.state.imageUrl
        });

      db.collection(`/users/${this.state.uid}/products`)
        .get()
        .then(snapshot => {
          const users = [];
          snapshot.forEach(document => {
            const data = document.data();
            users.push(data);
            console.log(users)
            this.setState({
              users: users
            });
          });
        })
        .catch(error => console.log(error));
    }

    setTimeout(getProductDetails, 5000)
    setTimeout(addProduct, 10000)
  }

  render() {
    return (
      <div class="App">
        <header class="App-header">
          <div class="product-list">
            {
              this.state.users && 
              this.state.users.map(user => {
                return(
                  <ProductList list={user} />
                )
              })
            }
          </div>
            <div class="add-product-div">
              <div style={{paddingTop: '2px'}}>
                <button onClick={this.showAddProduct} class="add-product">Add Product</button>
              </div>
            </div>
            <AddProduct url={this.getUrl} desiredPrice={this.getDesiredPrice} handler={this.handler} show={this.state.showAddProduct} onClose={this.showAddProduct} />
        </header>
      </div>
    );
  }
}

export default App;
