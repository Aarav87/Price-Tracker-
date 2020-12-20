import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import request from 'request';
import cheerio from 'cheerio';
import { InputNumber, Button, Tooltip } from 'antd';
import AddProduct from './components/AddProduct';
import {db, auth, arrayUpdate} from './firebase';
import ProductList from './components/ProductList';
import { PlusCircleFilled } from '@ant-design/icons/';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import emailjs from 'emailjs-com';
import UserProfile from './components/UserProfile';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProduct: true,
      showUserProfile: true,
      showSignUp: true,
      showLogin: true,
      items: null, 
      users: null,
      url: "",
      productTitle: '',
      desired_price: 0,
      currentProductPrice: 0,
      imageUrl: '',
      youSave: '',
      loading: true,
      user: null
    }

    this.showAddProduct = this.showAddProduct.bind(this)
    this.showUserProfile = this.showUserProfile.bind(this)
    this.showLogin = this.showLogin.bind(this)
    this.showSignUp = this.showSignUp.bind(this)
    this.getUrl = this.getUrl.bind(this)
    this.getDesiredPrice = this.getDesiredPrice.bind(this)
    this.handler = this.handler.bind(this)
    this.updateList = this.updateList.bind(this)
    this.checkPrice = this.checkPrice.bind(this)
    this.priceMet = this.priceMet.bind(this)
    this.getProductDetails = this.getProductDetails.bind(this)
    this.addProduct = this.addProduct.bind(this)
  }
  
  componentDidMount() {
    auth.onAuthStateChanged((user) => {      
      if (user) {
        this.setState({ user })

        this.showLogin()
        setTimeout(this.updateList, 4000)
        setTimeout(this.checkPrice, 8000)
        setTimeout(this.priceMet, 12000)

      } else {
        this.setState({
          user: null,
          loading: false
        })

      }    
    });
  }

  updateList() {
    db.collection(`/users/${this.state.user.email}/products`)
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(document => {
          const data = document.data();
          items.push(data);
          this.setState({
            items: items,
            loading: false
          });
        });
      })
  }

  showAddProduct() {
    this.setState({showAddProduct: !this.state.showAddProduct})
  }

  showUserProfile() {
    this.setState({showUserProfile: !this.state.showUserProfile})
  }

  showLogin() {
    this.setState({showLogin: !this.state.showLogin})
  }

  showSignUp() {
    this.setState({showSignUp: !this.state.showSignUp})
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

  signOut() {
    auth.signOut()
  }

  getProductDetails() {
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
        var currentPrice = $('#priceblock_ourprice').text().replace(/\s\s+/g, '')
        const imageUrl = $('#landingImage').attr("data-old-hires")
        const youSave = $('#regularprice_savings').text().replace(/\s\s+/g, '')

        if(currentPrice === "") {
          currentPrice = $('#priceblock_dealprice').text().replace(/\s\s+/g, '')
        }

        this.setState({
          productTitle: productTitle.replace('/', ' '),
          currentProductPrice: currentPrice,
          imageUrl: imageUrl,
          youSave: youSave
        })
      }
    })
  }

  addProduct() {
    var ref = db.collection('users').doc(this.state.user.email).collection('products').doc(this.state.productTitle)
    ref.set({ 
      url: this.state.url,
      productTitle: this.state.productTitle,
      currentProductPrice: this.state.currentProductPrice,
      desired_price: this.state.desired_price,
      imageUrl: this.state.imageUrl,
      priceHistory: [],
      dateRecorded: [],
      youSave: this.state.youSave
    })    
  }
  
  handler() {
    this.setState({
      loading: true
    })

    setTimeout(this.getProductDetails, 3000)
    setTimeout(this.addProduct, 6000)
    setTimeout(this.updateList, 9000)

  }
  
  checkPrice() {
    if(Array.isArray(this.state.items) || !this.state.items === null) {
      this.state.items.forEach(item => {
        const url = item.url

        setInterval(() => {
          var options = {
            url: url,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
            }
          }
          
          request(options, (error, response, html) => {
            if (!error) {
              // Use Cheerio to load the page.
              var $ = cheerio.load(html);
              var currentPrice = $('#priceblock_ourprice').text().replace(/\s\s+/g, '')
              const docID = item.productTitle

              if(currentPrice === "") {
                currentPrice = $('#priceblock_dealprice').text().replace(/\s\s+/g, '')
              }

              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              const today = new Date();
              const dd = String(today.getDate())
              const mm = String(today.getMonth())
              const date = `${months[mm]} ${dd}`

              const priceHistory = item.priceHistory
              const dateRecorded = item.dateRecorded  

              if(dateRecorded[dateRecorded.length - 1] != date) {
                priceHistory.push(currentPrice)
                dateRecorded.push(date)
                  
                var ref = db.collection('users').doc(this.state.user.email).collection('products').doc(docID)
                ref.update({
                  currentProductPrice: currentPrice,
                  priceHistory: priceHistory,
                  dateRecorded: dateRecorded
                })
                setTimeout(this.updateList, 3000)
              } 
            }
          })
        }, 5000);
      })
    } 
  }

  priceMet() {
    if(Array.isArray(this.state.items) || !this.state.items === null) {
      this.state.items.forEach(item => {
        const currentProductPrice = parseInt(item.currentProductPrice.slice(5, item.currentProductPrice.length), 10)
        const desiredPrice = parseInt(item.desired_price, 10)

        if(currentProductPrice < desiredPrice) {
          console.log(`PRICE OF ${item.productTitle} IS LOWER.`)
          emailjs.send("gmail","template_lgncm65", {
            to_name: "aarav332211@gmail.com",
            from_name: "Price Tracker",
            product_name: `${item.productTitle.slice(0, 40)}`,
            message: `The price of ${item.productTitle.slice(0, 40)} is below your desired price and is now in your price range! Go check it out at ${item.url}`,
          }, "user_y8NpFi4fIZIH8djmytjIA");

          var ref = db.collection('users').doc(this.state.user.email).collection('products').doc(item.productTitle)
          ref.delete()
          
          this.setState({
            loading: true
          })

          setTimeout(this.updateList, 3000)
        } else {
          console.log(`PRICE OF ${item.productTitle} IS HIGHER`)
        }
      })
    }
  }
  
  render() {
    if(!this.state.user) {
      return (
        <div class="app-menu">
          <img src="https://i.ibb.co/FJWyWBb/icon48.png" />
          <h1>Price Tracker</h1>
          <p><a onClick={this.showLogin}>Log In</a> | <a onClick={this.showSignUp}>Sign Up</a></p>
          <Login show={this.state.showLogin} onClose={this.showLogin} /> 
          <SignUp show={this.state.showSignUp} onClose={this.showSignUp} />
        </div>
      )
    }

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
              this.state.user.photoURL ? 
                <img class="user-gmail-icon" src={this.state.user.photoURL} onClick={this.showUserProfile}/> : 
                <div class="basic-icon" onClick={this.showUserProfile}>{this.state.user.email.charAt(0).toUpperCase()}</div>
            }
            {
              this.state.items && 
              this.state.items.map(item => {
                return(
                  <ProductList list={item} update={this.updateList} />
                )
              })
            }
          </div>
          <div>
            <PlusCircleFilled title="Add Product" onClick={this.showAddProduct} style={{outline: 'none', color: '#0a1d70', position: 'fixed', bottom: '7px', right: '10px', fontSize: '50px'}}/>
          </div>
            <AddProduct url={this.getUrl} desiredPrice={this.getDesiredPrice} handler={this.handler} show={this.state.showAddProduct} onClose={this.showAddProduct} />
            <UserProfile user={this.state.user} show={this.state.showUserProfile} onClose={this.showUserProfile} signOut={this.signOut} />
        </header>
      </div>
    );
  }
}

export default App;
