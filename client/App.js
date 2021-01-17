import React, { Component } from 'react';
import './App.css';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import { PlusCircleFilled } from '@ant-design/icons/';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import UserProfile from './components/UserProfile';
import axios from 'axios';
import { auth } from './firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddProduct: true,
      showUserProfile: true,
      showSignUp: true,
      showLogin: true,
      showEditProduct: true,
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
    this.showEditProduct = this.showEditProduct.bind(this)
    this.getUrl = this.getUrl.bind(this)
    this.getDesiredPrice = this.getDesiredPrice.bind(this)
    this.handler = this.handler.bind(this)
    this.updateList = this.updateList.bind(this)
    this.getProductDetails = this.getProductDetails.bind(this)
    this.addProduct = this.addProduct.bind(this)
  }
  
  componentDidMount() {
    if(window.location.href === "https://www.amazon.ca/") {
      auth.onAuthStateChanged((user) => {      
        if (user) {
          this.setState({ user })
          setTimeout(this.updateList, 6000)
        } else {
          this.setState({
            user: null,
            loading: false
          })
        }

        setTimeout(() => {
          axios.post(`${process.env.REACT_APP_BACKEND_URL}/onAuthStateChanged`, this.state.user)
        }, 3000)
      })
    }
  }

  updateList() {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateList`)
      .then((response) => {
        this.setState({
          items: response.data,
          loading: false
        });
      }, (error) => {
        console.log(error);
      });
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

  showEditProduct() {
    this.setState({showEditProduct: !this.state.showEditProduct})
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
    const data = {
      url: this.state.url
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/getProductDetails`, data)
      .then((response) => {
        this.setState({
          productTitle: response.data.productTitle.replace('/', ' '),
          currentProductPrice: response.data.currentPrice,
          imageUrl: response.data.imageUrl,
          youSave: response.data.youSave
        });
      }, (error) => {
        console.log(error);
      });
  }

  addProduct() {
    const data = {
      url: this.state.url,
      productTitle: this.state.productTitle,
      currentProductPrice: this.state.currentProductPrice,
      desired_price: this.state.desired_price,
      imageUrl: this.state.imageUrl,
      priceHistory: [], 
      dateRecorded: [],
      youSave: this.state.youSave
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/addProduct`, data)
  }
  
  handler() {
    this.setState({
      loading: true
    })

    setTimeout(this.getProductDetails, 3000)
    setTimeout(this.addProduct, 6000)
    setTimeout(this.updateList, 9000)

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
                  <ProductList list={item} update={this.updateList} editProduct={this.showEditProduct} />
                )
              })
            }
          </div>
          <div>
            {
              this.state.showEditProduct &&
                <PlusCircleFilled title="Add Product" onClick={this.showAddProduct} style={{outline: 'none', color: '#0a1d70', position: 'fixed', bottom: '7px', right: '10px', fontSize: '50px'}}/>
            }
          </div>
            <AddProduct url={this.getUrl} desiredPrice={this.getDesiredPrice} handler={this.handler} show={this.state.showAddProduct} onClose={this.showAddProduct} />
            <UserProfile user={this.state.user} show={this.state.showUserProfile} onClose={this.showUserProfile} signOut={this.signOut} />
        </header>
      </div>
    );
  }
}

export default App;
