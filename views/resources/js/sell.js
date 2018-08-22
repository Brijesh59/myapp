var selectFile,uid;
var type = document.getElementById("booktype")!="" ? document.getElementById("booktype"): "Others";
var bname = document.getElementById("bookName");
var author = document.getElementById("authorName");
var publisher = document.getElementById("bookpublisher");
var desc = document.getElementById("bookdescription");
var mrp = document.getElementById("bookmrp");
var price = document.getElementById("bookprice");

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    uid = user.uid;
    $(".sell").css('display','inline-block');
    $(".jumbotron").css('display','none');
  }
  else{
    $(".sell").css('display','none');
    $(".jumbotron").css('display','inline-block');
  }
});

function preview(e){
  switch(e.getAttribute('id')){
    case "bookCategory": type.innerHTML = e.value; break;
    case "bookname": bname.innerHTML = e.value; break;
    case "authorname": author.innerHTML = e.value; break;
    case "publisher": publisher.innerHTML = e.value; break;
    case "description": desc.innerHTML = e.value; break;
    case "mrp": mrp.innerHTML = e.value; break;
    case "price": price.innerHTML = e.value; break;
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#sourceImg').attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    selectFile = input.files[0];
  }

}

document.getElementById("submitBook").addEventListener('click',submitBook);

function submitBook(e){

  console.log(validateFields())
  if( validateFields() == false){
    e.preventDefault();
    swal({
      text:"Please fill all the fields",
      icon: "error",
      button: false,
      timer: 2000
    });
  }
  else{
    $(".spinner").css('display','inline-block');
    $("#sellForm").css('display','none');

    var filename = '';
    if(selectFile != undefined)
       filename= selectFile.name;
    var imageURL;

    var storageRef = firebase.storage().ref('/database_pic/user_book_photos/' + $("#bookCategory").val() + "/"+filename);
    var uploadTask = storageRef.put(selectFile);


    uploadTask.on('state_changed', function(snapshot){}, function(error) {}, function() {

      uploadTask.snapshot.ref.getDownloadURL()
      .then(function(downloadURL) {
        imageURL = downloadURL;

        var pushUserData = {
          name: $("#bookname").val(),
          type: $("#bookCategory").val()!="" ? $("#bookCategory").val() : "Others" ,
          author: $("#authorname").val(),
          description: $("#description").val(),
          url: downloadURL,
          MRP: $("#mrp").val(),
          Price: $("#price").val(),
          Publisher: $("#publisher").val()
        }
        var ref = firebase.database().ref('database/userbook/' + uid);
        ref.push(pushUserData);
      })
      .then(function(){
        $(".spinner").css('display','none');
        $(".successMsg").css('display','block');
        setTimeout( function(){
          window.open("sell.html","_self")
        }, 4000);

      })
      .catch(function(err){
        $(".spinner").css('display','none');
        alert("Something Went Wrong!");
        location.reload();
      })
    });
  }

}


function validateFields(){
  // console.log($("#file").val());
  if( $("#bookname").val() !="" && $("#file").val() !="" && $("#authorname").val() !="" && $("#publisher").val() !="" && $("#description").val()!="" && $("#mrp").val() !="" && $("#price").val() !="" ){
    return true
  }
  else{
    return false
  }

}
