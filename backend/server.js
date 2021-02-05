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

    const browser = await puppeteer.launch({args: ["--no-sandbox"]})
    var page = await browser.newPage()
    
    try {
        var data = {}
        console.log(url)
        await page.goto(url)

        const productDetails = await page.evaluate(() => {
            const productTitle = document.querySelector('#productTitle').textContent
            var currentPrice = document.querySelector('#priceblock_ourprice').textContent
            const imageUrl = document.querySelector('#landingImage').textContent
            const youSave = document.querySelector('#regularprice_savings').textContent

            if(currentPrice === "") {
                currentPrice = document.querySelectorAll('#priceblock_dealprice').textContent
            } 

            data = {
                productTitle, 
                currentPrice,
                imageUrl,
                youSave
            }
        })

        console.log(data)
        res.send(data)

    } catch(e) {
        console.log(e)
    }

    browser.close()
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
    const data = {
        productTitle: req.body.productTitle
    }

    var ref = db.collection('users').doc(user.email).collection('products').doc(data.productTitle)
    ref.delete() 
        
})

function checkPrice() {
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

                        setInterval(() => {
                           puppeteer
                                .launch({
                                    headless: true,
                                    args: ["--no-sandbox"]
                                })
                                .then(function(browser) {
                                    return browser.newPage();
                                })
                                .then(function(page) {
                                    return page.goto(url).then(function() {
                                        return page.content();
                                    });
                                })
                                .then(function(html) {
                                    var $ = cheerio.load(html);
                                    const productTitle = $('#titleSection').text().replace(/\s\s+/g, '')
                                    var currentPrice = $('#priceblock_ourprice').text().replace(/\s\s+/g, '')
                                    const imageUrl = $('#landingImage').attr("data-old-hires")
                                    const youSave = $('#regularprice_savings').text().replace(/\s\s+/g, '')
                                
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
                                        
                                        var ref = db.collection('users').doc(user.email).collection('products').doc(docID)
                                        ref.update({
                                            url: data.url,
                                            productTitle: productTitle,
                                            currentProductPrice: currentProductPrice,
                                            imageUrl: imageUrl,
                                            priceHistory: priceHistory,
                                            dateRecorded: dateRecorded,
                                            youSave: youSave 
                                        })
                                    } 
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                        }, 5000);
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