var express = require('express')
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer')
var admin = require('firebase-admin')
var serviceAccount = require('./privatekeyBookkart.json')

var app = express()
var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bookkart-9ecfd.firebaseio.com'
})
var database = firebaseAdmin.database();
var userID, bookData, keyData, emailId;

app.set('view-engine', 'ejs')
app.use(express.static('views'))
app.set('views', __dirname + '/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
var urlencodedParser = bodyParser.urlencoded({extended: false});


app.get('/', function(req, res){
  res.render("index.html");
});

// grab the uid
app.post("/uid",function(req,res){
  emailId = req.body.email;
  userID = req.body.uid;
  console.log("UID: " +  userID);
  console.log("EMAIL: " +  emailId);
});



function gettime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


app.post('/order', (req, res)=>{

  var itemDetails,output;

  //get Order date
  var d = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var month = months[d.getMonth()];
  var date = d.getDate();
  var year = d.getFullYear();
  var fullDate = date + " " + month + " " + year;  // date of order
  var time = gettime(new Date());  // time of order

  console.log(userID);

  var ref = database.ref('/cart/' + userID);

  ref.once('value').then(function(snapshot){
    bookData = Object.values(snapshot.val());
    bookData.map((item, key)=>{
      // console.log(item);
      itemDetails += `<div style="background-color:#EFF0EF;margin:20px;padding:20px;">
                      <h4>Book Name: ${item.name}</h4>
                      <h4>Price: ${item.price}</h4>
                      <h4>Quantity: ${item.quantity}</h4>
                      <h4>Type: ${item.type}</h4>
                      </div>
                      <hr />
      `;
    });
      output = `
                     <h1>A new Order request has been made.</h1>
                     <h4>Date: ${fullDate} | Time: ${time}</h4>
                     <h3 style="color:#2980B9;">Customer Name: ${req.body.username}</h3>
                     <h3 style="color:#2980B9;">Customer's Email Id: ${emailId}</h3>
                     <h3 style="color:#2980B9;">Mobile No: ${req.body.phone}</h3>
                     <h3 style="color:#2980B9;">Address to deliever: ${req.body.address}</h3>
                     <h3 style="color:#2980B9;">Pincode: ${req.body.pincode}</h3>
                     <h4 style="color:green">Items - </h4>
                     <hr />
                     ${itemDetails}
       `;
  })
  .then(function(){
    let transporter = nodemailer.createTransport({
      host: 'mail.kumarbrijesh.com',
      port: 587,
      secure: false,
      auth: {
        user: 'brijesh@kumarbrijesh.com',
        pass:  'Brijesh@bookkart'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Bookkart User" <brijesh@kumarbrijesh.com>', // sender address
      to: 'bookkart.online@gmail.com', // list of receivers
      subject: 'Bookkart User Contact', // Subject line
      text: '', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      else{
        console.log('Message sent');
        // push the details of orders, which has been made successfully
        var ref = database.ref('database/request/' + userID);
        ref.push(bookData).then(function(){
          // then remove items from the cart
          var del = firebaseAdmin.database().ref('/cart/'+ userID);
          del.remove().then(function(){
            // then reder the order success page
            res.render("orderSuccess.ejs");
          })
        })
      }
    });

  })

});


app.post('/contact', function(req,res){
  console.log(req.body);
  console.log(userID);
  res.render("success.ejs", {data: req.body});
  const output = `
                <div style="background-color:#EFF0EF;margin:20px;padding:20px;">
                <h2>You have a new User Contact</h2>
                <h4>User Name: ${req.body.username}</h4>
                <h4>User Email: ${req.body.useremail}</h4>
                <h4>Message</h4>
                <h4 style="margin:5px;padding:10px;border: 1px solid red;width:600px;">${req.body.textmessage}</h4>
                </div>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.kumarbrijesh.com',
    port: 587,
    secure: false,
    auth: {
      user: 'brijesh@kumarbrijesh.com',
      pass:  'Brijesh@bookkart'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Bookkart User" <brijesh@kumarbrijesh.com>', // sender address
    to: 'bookkart.online@gmail.com', // list of receivers
    subject: 'Bookkart User Contact', // Subject line
    text: '', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent');
  });

});



app.post('/sell', function(req,res){
  console.log(req.body);
  var bookname = req.body.bookname;
  var authorname = req.body.authorname;
  var publisher = req.body.publisher;
  var description = req.body.description;
  var mrp = req.body.mrp;
  var price = req.body.price;

  const output = `
                <div style="background-color:#EFF0EF;margin:20px;padding:20px;">
                <h2>A new sell request has been made</h2>
                <h3 style="color:#156FD2;">Customer's Email Id: ${emailId}</h4>
                <h4>Book Name: ${req.body.bookname}</h4>
                <h4>Author Name: ${req.body.authorname}</h4>
                <h4>Publisher: ${req.body.publisher}</h4>
                <h4>Description: ${req.body.description}</h4>
                <h4>MRP : Rs. ${req.body.mrp}</h4>
                <h4>Price : Rs. ${req.body.price}</h4>
                </div>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.kumarbrijesh.com',
    port: 587,
    secure: false,
    auth: {
      user: 'brijesh@kumarbrijesh.com',
      pass:  'Brijesh@bookkart'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Bookkart User" <brijesh@kumarbrijesh.com>', // sender address
    to: 'bookkart.online@gmail.com', // list of receivers
    subject: 'Bookkart User Contact', // Subject line
    text: '', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    else{
      console.log('Message sent');
    }

  });

});

app.get("/*", function(req,res){
  res.render("pagenotfound.ejs");
})
const port = process.env.PORT || 8081;
app.listen(port, function(){
  console.log("App running on port: " + port)
})
