
var items=[],uid, userCheck;
var parent = document.getElementById("checkout");
var itemList = [];

window.onload = function(){
  fetchCartItems();
}

function fetchCartItems(){

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      userCheck = user;
      uid = user.uid;

      $.ajax({
        url : "/uid",
        data: user.uid,
        dataType: "json",
        success: function(data){
          console.log("UID Sent");
        },
        type: 'POST'
      })

      var firebaseData = firebase.database();
      var ref = firebaseData.ref('cart');
      console.log("fectchCartItems Called");
      ref.on('value', getData, errData);
    }
    else{
      $(".spinner").css('display','none');
      swal({
        icon: 'warning',
        title: "Please Login First",
        text: "Redirecting to home...",
        button: false,
        timer: 2000,
      })
      .then(()=>{
        window.location = "/index.html";
      });


      // let checkoutDiv = document.createElement("div"); checkoutDiv.classList.add("checkoutDiv");
      // let h2 = document.createElement("h3"); h2.classList.add("checkoutDivHead");
      //
      // h2.textContent = "Please Login First to view your Cart";
      //
      // let btnlogin = document.createElement("button"); checkoutDiv.classList.add("btn-primary");
      // btnlogin.textContent = "Login";
      // btnlogin.setAttribute('onclick','signInWithGoogle()');
      //
      // checkoutDiv.appendChild(h2);
      // h2.appendChild(btnlogin);
      //
      // parent.appendChild(checkoutDiv);
    }
  })
}

function getData(data){
  if(parent.innerHTML != null)
    parent.innerHTML="";

  console.log(data.val());
  if(data.val() != null){
    $.map(data.val(), function(value, userID) {
      if(userCheck && userID == uid){

        items = Object.values(value);
        var Keys =  Object.keys(value);

        if(items.length > 0){
          let checkoutDiv = document.createElement("div"); checkoutDiv.classList.add("checkoutDiv");
          let h2 = document.createElement("h3"); h2.classList.add("checkoutDivHead");
          let para = document.createElement("p"); para.classList.add("checkoutDivPara");
          let submitBtn = document.createElement("button"); submitBtn.classList.add("submitBtn");
          let hr = document.createElement("hr");

          let totalPrice = 0;
          items.map((item)=>{
            totalPrice += Number(item.price)
          })

          h2.textContent = "Order Now";
          para.textContent = "Subtotal: Rs. " + totalPrice;
          submitBtn.textContent = "Proceed to checkout";
          checkoutDiv.appendChild(h2);
          checkoutDiv.appendChild(para);
          checkoutDiv.appendChild(submitBtn);
          parent.appendChild(checkoutDiv);
          parent.appendChild(hr);

          items.map((item,i)=>{
            itemList.push(item);
            showCartItems(item,Keys[i]);
          });

          document.querySelector('.submitBtn').addEventListener('click',function(){
              window.open("/order.html", "_self");
          })

        }

      }

      else if(items.length == 0){
          let checkoutDiv = document.createElement("div"); checkoutDiv.classList.add("checkoutDiv");
          let h2 = document.createElement("h3"); h2.classList.add("checkoutDivHead");

          h2.textContent = "Your Cart is Empty.";

          checkoutDiv.appendChild(h2);

          parent.appendChild(checkoutDiv);
      }

    });
  }
  else if(data.val() == null){
      let checkoutDiv = document.createElement("div"); checkoutDiv.classList.add("checkoutDiv");
      let h2 = document.createElement("h3"); h2.classList.add("checkoutDivHead");

      h2.textContent = "Your Cart is Empty.";

      checkoutDiv.appendChild(h2);

      parent.appendChild(checkoutDiv);
  }

}

function errData(err){
  console.log("Error!");
  console.log(err);
}

function showCartItems(item,key){

  let bookName = item.name;
  let bookPrice = item.price;
  let bookQuantity = item.quantity;

  var div1 = document.createElement("div"); div1.classList.add("card");
  var img = document.createElement("img"); img.classList.add("card-img-top");
  var div2 = document.createElement("div"); div2.classList.add("card-body");
  var h5 = document.createElement("h5"); h5.classList.add("card-title");
  var p = document.createElement("p"); p.classList.add("card-text");
  var anchortag = document.createElement("a"); anchortag.classList.add("btn"); anchortag.classList.add("btn-danger");

  h5.textContent = bookName;
  p.textContent = "Price: Rs. " + bookPrice;
  anchortag.textContent = "Remove";

  div1.appendChild(img);
  div1.appendChild(div2);
  div2.appendChild(h5);
  div2.appendChild(p);
  div2.appendChild(anchortag);
  parent.appendChild(div1);

  anchortag.addEventListener('click',function(){
    var firebaseDeleteData = firebase.database();
    var del = firebaseDeleteData.ref('cart/'+uid);
    $(this).parent().parent().fadeOut(700,function(){
      del.child(key).remove();
    });

  })

}
