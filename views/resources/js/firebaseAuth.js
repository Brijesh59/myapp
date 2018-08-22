$(document).ready(function(){
  checkIfLoggedIn();
});
function checkIfLoggedIn(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var userdata = {
        uid: user.uid,
        email: user.email
      }
      $.ajax({
        url : "/uid",
        data: userdata,
        dataType: "json",
        success: function(data){
          console.log("UID Sent");
        },
        type: 'POST'
      })

      console.log(user.email);
      console.log("User Signin");
      var photoURL = user.photoURL;
      var name = user.displayName;
      document.getElementById('user_img').setAttribute('src',photoURL);
      $('#user_img').click(function(){
        swal({
          text: "Log out",
          button: "Logout"
        });
        document.querySelector('.swal-button').addEventListener('click',signOut);
      })
    }
    else{
      console.log("User Not Signed in");
      $('#user_img').click(function(){
        swal({
          text: "Login with Google",
          button: "Login"
        });
        document.querySelector('.swal-button').addEventListener('click',signInWithGoogle);
      })
    }
  })
}

function signInWithGoogle(){
  var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(googleAuthProvider)
    .then(function(data){
      console.log(data)
      document.getElementById('user_img').setAttribute("src", data.user.photoURL);
      var userdata = {
        uid: data.user.uid,
        email: data.user.email
      }
      $.ajax({
        url : "/uid",
        data: userdata,
        dataType: "json",
        success: function(data){
          console.log("UID Sent");
        },
        type: 'POST'
      })
    })
    .catch(function(err){
      console.log(err)
    })
}

function signOut(){
  firebase.auth().signOut();
  document.getElementById('user_img').setAttribute('src','resources/images/icons/icon-header-01.png');
  checkIfLoggedIn();
  location.reload();
}
