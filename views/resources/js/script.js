function ValidateEmail(mail){
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    return true
  else
    return false
}

$(".subscribe").click(function(){
    var mail = $(".newsletter").val();
    if(mail != "" && ValidateEmail(mail)){
      swal({
        text:"You are now Subscribed to Our Newsletter.",
        icon: "success",
        button: false,
        timer: 2000
      });
    }
    else if(mail == ""){
      swal({
        text:"Please provide your email",
        icon: "warning",
        button: false,
        timer: 2000
      });
    }
    else if($(".newsletter").val() != "" && ValidateEmail(mail) == false){
      swal({
        text:"Please enter valid email id",
        icon: "error",
        button: false,
        timer: 2000
      });
    }
    else{

    }
    $(".newsletter").val("");
})

var cartItems;
firebase.auth().onAuthStateChanged(function(user){
  if(user){
    let firebaseData = firebase.database();
    let ref = firebaseData.ref('cart/' + user.uid);
    ref.on('value', getData1);
  }
  else{
    document.querySelector(".cart-count").innerHTML = 0;
  }
});

function getData1(data){
  cartItems = 0;
  if(data.val() != null){
    var dataItems = Object.values(data.val());
    dataItems.map(value=>{
      cartItems += Number(value.quantity);
    });
    console.log("No of items in cart: " + cartItems);
    document.querySelector(".cart-count").innerHTML = cartItems;
  }


}
