const  express = require('express');
const keys = require('./config/keys');
const  stripe = require('stripe')(keys.stripeSecretKey);//stripe secret key
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//set static  FolderResources
app.use(express.static(`${__dirname}/public`));

//Index route
app.get('/',(req,res)=>{
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
});
//Charge route
app.post('/charge',(req,res)=>{
const amount = 25000;
// console.log(req.body);
// res.send('TEST');
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
        .then(customer => stripe.charges.create({
            amount,
            description:'Harry Spell Book',
            currency:'usd',
            customer:customer.id
        }))
        .then(charge =>res.render('success'));
});

app.get('/success',(req,res)=>{
    res.render('success');
});
const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server started on port ${port}`)
});