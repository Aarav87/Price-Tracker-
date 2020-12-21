const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const nodemailer = require('nodemailer')

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

let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com',
    port: 465, 
    secure: true, 
    auth: {
        user: '<EMAIL>', 
        pass: '<PASSWORD>'
    }
});

app.post('/sendMail', function(req, res) {
    const data = {
        email: req.body.email,
        productTitle: req.body.productTitle,
        url: req.body.url
    }

    console.log(data)

    const message = {
        from: 'Price Tracker', 
        to: data.email,         
        subject: `Price of ${data.productTitle.slice(0, 27)} is lower!`, 
        text: `The price of ${data.productTitle.slice(0, 27)} is below your desired price and is now in your price range! Go check it out at ${data.url}`
    };
    
    transporter.sendMail(message, function(err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
})

app.listen(3001, () =>
  console.log('Example app listening on port 3001!'),
);