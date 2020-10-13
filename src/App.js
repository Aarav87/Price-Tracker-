import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import request from 'request';
import cheerio from 'cheerio';
import { InputNumber } from 'antd';
import AddProduct from './components/AddProduct';
import {db, auth} from './firebase';
import ProductList from './components/ProductList';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';

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
      imageUrl: '',
      loading: true,
      documentID: ''
    }

    this.showAddProduct = this.showAddProduct.bind(this)
    this.getUrl = this.getUrl.bind(this)
    this.getDesiredPrice = this.getDesiredPrice.bind(this)
    this.handler = this.handler.bind(this)
    this.updateList = this.updateList.bind(this)
    this.priceMet = this.priceMet.bind(this)
    this.checkPrice = this.checkPrice.bind(this)
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

    setTimeout(this.updateList, 5000)
    setTimeout(this.priceMet, 10000)
    
  }

  updateList() {
    db.collection(`/users/${this.state.uid}/products`)
      .get()
      .then(snapshot => {
        const users = [];
        snapshot.forEach(document => {
          const data = document.data();
          users.push(data);
          this.setState({
            users: users,
            loading: false
          });
        });
      })
    
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
    this.setState({
      loading: true
    })

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
          imageUrl: this.state.imageUrl,
          docID: this.state.documentID
        })
        .then((docRef) => {
          this.setState({
            documentID: docRef.id
          })
        })
      
    }

    const addDocId = () => {
      var ref = db.collection('users').doc(this.state.uid).collection('products').doc(this.state.documentID)
      ref.update({
        docID: this.state.documentID
      })
    }

    setTimeout(getProductDetails, 3000)
    setTimeout(addProduct, 6000)
    setTimeout(addDocId, 9000)
    setTimeout(this.updateList, 9000)

  }

  checkPrice() {
    if(Array.isArray(this.state.users) || this.state.user.length) {
      this.state.users.forEach(item => {
        const url = item.url
        console.log(item)
        var options = {
          url: this.state.url,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
          }
        }

        request(options, (error, response, html) => {
          if (!error) {
            // Use Cheerio to load the page.
            var $ = cheerio.load(html);
            const currentPrice = $('#priceblock_ourprice').text().replace(/\s\s+/g, '')
            const docID = item.docID
            
            var ref = db.collection('users').doc(this.state.uid).collection('products').doc(docID)
            ref.update({
              currentProductPrice: "51"  
            })
          }
        })
      })
    } else {
      console.log('error')
    }
  }
  
  priceMet() {
    if(Array.isArray(this.state.users) || this.state.user.length) {
      this.state.users.forEach(item => {
        const currentProductPrice = parseInt(item.currentProductPrice.slice(5, item.currentProductPrice.length), 10)
        const desiredPrice = parseInt(item.desired_price, 10)

        if(currentProductPrice < desiredPrice) {
          console.log(`PRICE OF ${item.productTitle} IS LOWER.`)
        } else {
          console.log(`PRICE OF ${item.productTitle} IS HIGHER`)
        }
      })
    } else {
      console.log('error')
    }
  }

  render() {
    if(this.state.loading) {
      return (
        <div class="spinner">
          <Spinner color="#3333ff" />
        </div>
      )
    }

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
