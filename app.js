const express = require('express');

var bodyParser = require('body-parser');

const app = express();

app.listen(3000);

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true })); 

// Set your app credentials
const credentials = {
    apiKey: 'YOUR API KEY',
    username: 'USERNAME',
}

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

// Get the airtime service
const airtime = AfricasTalking.AIRTIME;

async function sendAirtime(phone, amount,code) {
    const options = {
        recipients: [{
            phoneNumber: phone,
            currencyCode: code,
            amount: amount
        }]
    };

    var status = '';

    // That’s it hit send and we’ll take care of the rest
    await airtime.send(options)
        .then(response => {
            console.log(response);
            status = response.responses[0].status;
        }).catch(error => {
            console.log(error);

            status = 'Error: '+error;
        });

        return status;
}

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

app.post('/myForm',async function(req,res){
    var phone = req.body.phone;
    var amount = req.body.amount;
    var status = '';

    if(phone !== "" && amount != "") {
        status = await sendAirtime(phone, amount);
    } 

    res.send("Status: "+status);

    res.end();
});
