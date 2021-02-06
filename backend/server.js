const PORT = process.env.PORT || 3000
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const nodemailer = require('nodemailer')
const cheerio = require('cheerio')
const admin = require('firebase-admin')
const axios = require('axios')
const puppeteer = require('puppeteer');

const app = express();

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'https://www.amazon.ca',
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "project_key_id": process.env.PROJECT_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
    "client_x509_cert_url": process.env.CENT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const auth = admin.auth()
var user = null

let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com',
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD
    }
});

app.post('/onAuthStateChanged', function(req, res) {
    user = req.body
})

app.post('/updateList', function(req, res) {
    db.collection(`/users/${user.email}/products`)
      .get()
      .then(snapshot => {
        const items = []
        snapshot.forEach(document => {
          const data = document.data();
          items.push(data);
        });
        res.send(items)
      })
})

app.post('/getProductDetails', async function(req, res) {
    var url = req.body.url

    try {
        const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]})
        const page = await browser.newPage()
        await page.goto(url)

        const productDetails = await page.evaluate(() => {
            const productTitle = document.querySelector('#productTitle').innerText;
            var currentPrice = document.querySelector('#priceblock_ourprice').innerText;
            const imageUrl = document.querySelector('#landingImage').src
            var youSave = document.querySelector('#regularprice_savings')
            
            if(currentPrice === "") {
                currentPrice = document.body.querySelector('#priceblock_dealprice').innerText
            } 

            if(youSave != null) {
                youSave = youSave.innerText
            } else {
                youSave = ""
            }

            var data = {
                productTitle, 
                currentPrice,
                imageUrl,
                youSave
            }

            
           return data
        })

        res.send(productDetails)
        browser.close()
    }
    catch(e) {
        console.log(e)
    }
})

app.post('/addProduct', function(req, res) {
    const data = {
        url: req.body.url,
        productTitle: req.body.productTitle,
        currentProductPrice: req.body.currentProductPrice,
        desired_price: req.body.desired_price,
        imageUrl: req.body.imageUrl,
        priceHistory: req.body.priceHistory,
        dateRecorded: req.body.dateRecorded,
        youSave: req.body.youSave
    }

    var ref = db.collection('users').doc(user.email).collection('products').doc(data.productTitle)
    ref.set({ 
      url: data.url,
      productTitle: data.productTitle,
      currentProductPrice: data.currentProductPrice,
      desired_price: data.desired_price,
      imageUrl: data.imageUrl,
      priceHistory: data.priceHistory,
      dateRecorded: data.dateRecorded,
      youSave: data.youSave 
    }).catch((error) => {
        console.log(error)
    });  
})

app.post('/saveChanges', function(req, res) {
    const data = {
        productTitle: req.body.productTitle,
        desired_price: req.body.desired_price
    }

    var ref = db.collection('users').doc(user.email).collection('products').doc(data.productTitle)
    ref.update({
        desired_price: data.desired_price
    }) 
})

app.post('/deleteProduct', function(req, res) {
    const productTitle = req.body.productTitle
    

    var ref = db.collection('users').doc(user.email).collection('products').doc(productTitle)
    ref.delete() 
        
})

async function checkPrice() {
    if(user) {
        db.collection(`/users/${user.email}/products`)
            .get()
            .then(snapshot => {
                const items = [];
                snapshot.forEach(document => {
                    const data = document.data();
                    items.push(data);
                });

                if(Array.isArray(items) || !items === null) {
                    items.forEach(item => {
                        const url = item.url
                        const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]})
                        
                        try {
                            setInterval(() => {                               
                                const page = await browser.newPage()
                                await page.goto(url)

                                const productDetails = await page.evaluate(() => {
                                    const productTitle = document.querySelector('#productTitle').innerText;
                                    var currentPrice = document.querySelector('#priceblock_ourprice').innerText;
                                    const imageUrl = document.querySelector('#landingImage').src
                                    var youSave = document.querySelector('#regularprice_savings')
                                    
                                    if(currentPrice === "") {
                                        currentPrice = document.body.querySelector('#priceblock_dealprice').innerText
                                    } 

                                    if(youSave != null) {
                                        youSave = youSave.innerText
                                    } else {
                                        youSave = ""
                                    }

                                    var data = {
                                        productTitle, 
                                        currentPrice,
                                        imageUrl,
                                        youSave
                                    }

                                    return data
                        
                                })

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
                                    
                                    var ref = db.collection('users').doc(user.email).collection('products').doc(docID)
                                    ref.update({
                                        url: data.url,
                                        productTitle: productDetails.productTitle,
                                        currentProductPrice: productDetails.currentPrice,
                                        imageUrl: productDetails.imageUrl,
                                        priceHistory: priceHistory,
                                        dateRecorded: dateRecorded,
                                        youSave: productDetails.youSave 
                                    })
                                  }       
                            }, 5000)
                        } catch(e) {
                            console.log(e)
                        }

                        browser.close()
                    })
                } 
            })
    }
}

function priceMet() {
    if(user) {
        db.collection(`/users/${user.email}/products`)
            .get()
            .then(snapshot => {
                const items = [];
                snapshot.forEach(document => {
                    const data = document.data();
                    items.push(data);
                });

                if(Array.isArray(items) || !items === null) {
                    items.forEach(item => {
                        const currentProductPrice = parseInt(item.currentProductPrice.slice(5, item.currentProductPrice.length), 10)
                        const desiredPrice = parseInt(item.desired_price, 10)

                        if(currentProductPrice < desiredPrice) {
                            const productTitle = item.productTitle
                            const url = item.url

                            const message = {
                                from: 'Price Tracker', 
                                to: user.email,         
                                subject: `Price of ${productTitle.slice(0, 27)} is lower!`, 
                                text: `The price of ${productTitle.slice(0, 27)} is below your desired price and is now in your price range! Go check it out at ${url}`
                            };
                        
                            transporter.sendMail(message, function(err, info) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(info);
                                }
                            });

                            var ref = db.collection('users').doc(user.email).collection('products').doc(item.productTitle)
                            ref.delete()
                            
                        } 
                    })
                }
            })
    }
}

setInterval(checkPrice, 77760000)
setInterval(priceMet, 86400000)

app.listen(PORT);