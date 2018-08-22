
function addBooksToCart(ele){

  firebase.auth().onAuthStateChanged(function(user){
    if(user){

      let type = ele.getAttribute('dataset.type');
      let name = ele.getAttribute('dataset.name');
      let price = ele.getAttribute('dataset.price');
      let quantity = 1;
      var orderDetails = {
        type: type,
        name: name,
        price: price,
        quantity: quantity
      }

      var items = Number(document.querySelector(".cart-count").innerHTML) + 1;
      var firebaseData = firebase.database();
      var uid = user.uid;
      var ref = firebaseData.ref('cart/' + uid);
      ref.push(orderDetails);

      swal({
        text:"Added to cart",
        icon: "success",
        button: false,
        timer: 1000
      });
    }
    else{
      swal({
        icon: 'warning',
        text: "Please Login first",
        button: false,
        timer: 1000
      });
    }
  });

}
