// fetch books from firebase database and store to books.json
var books, bookKeys ;

window.onload = function(){
  fetchBooks();
}

function fetchBooks(){
  var firebaseData = firebase.database();
  var ref = firebaseData.ref('database');
  ref.on('value', getData, errData);
}

function getData(data){
  console.log(data.val().book);
  books = data.val().book;
  bookKeys = Object.keys(books);

  document.getElementById("bookList").innerHTML="";
  for(let i = 0; i < bookKeys.length; i++){
    var k = bookKeys[i];
    var type = books[k].type;
    var name = books[k].name;
    var image = books[k].image;
    var price = books[k].price;
    var mrp = books[k].mrp;
    var author = books[k].author;
    var publisher = books[k].publisher;
    var description = books[k].description;

    if( type=="Engineering Books"){

      var parentNode = document.getElementById("bookList");
      // console.log(name);

      var div = document.createElement('div');
      div.setAttribute('class', 'book-list');

      var img = document.createElement('img');
      img.setAttribute('src', image);


      var title = document.createElement('h4');
      title.textContent = name;


      var bookAuthor = document.createElement('small');
      bookAuthor.textContent = "By " + author;


      // var bookPublisher = document.createElement('small');
      // bookPublisher.textContent = "Publisher: " + publisher;
      // div.appendChild(bookPublisher);




      var bookDescription = document.createElement('p');
      bookDescription.textContent = description; bookDescription.setAttribute('class', 'desc');



      var bookMRP = document.createElement('p');
      bookMRP.setAttribute('class', 'mrp');
      bookMRP.textContent = "MRP: Rs " + mrp;

      var bookPrice = document.createElement('p');
      bookPrice.setAttribute('class', 'price');
      bookPrice.textContent = "Price: Rs " + price;





      var button = document.createElement('button');
      button.textContent = 'Add to Cart';
      button.setAttribute('class', 'addToCart');
      button.setAttribute('dataset.name', name);
      button.setAttribute('dataset.type', type);
      button.setAttribute('dataset.price', price);
      button.setAttribute('onclick', 'addBooksToCart(this)');

      div.appendChild(img);
      div.appendChild(title);
      title.appendChild(bookAuthor);
      bookAuthor.appendChild(bookDescription);
      bookAuthor.appendChild(bookMRP);
      bookAuthor.appendChild(bookPrice);
      bookAuthor.appendChild(button);


      parentNode.appendChild(div);

      $(".desc").shorten({
        "showChars" : 150,
        "moreText"	: "See More",
        "lessText"	: "Less",
     });

    }
  }

}

function errData(err){
  console.log("Error!");
  console.log(err);
}

var currentId, prevId;

function showBooks(book){
  currentId = $(book).attr('id');
  console.log(currentId);
  var id = "#" + "currentId";
  $(id).toggleClass('active');

  document.getElementById("bookList").innerHTML="";
  for(let i = 0; i < bookKeys.length; i++){
    var k = bookKeys[i];
    var type = books[k].type;
    var name = books[k].name;
    var image = books[k].image;
    var mrp = books[k].mrp;
    var price = books[k].price;
    var author = books[k].author;
    var publisher = books[k].publisher;
    var description = books[k].description;

    if(book.innerHTML == type || book == type){

      var parentNode = document.getElementById("bookList");
      // console.log(name);

      var div = document.createElement('div');
      div.setAttribute('class', 'book-list');

      var img = document.createElement('img');
      img.setAttribute('src', image);


      var title = document.createElement('h4');
      title.textContent = name;


      var bookAuthor = document.createElement('small');
      bookAuthor.textContent = "By " + author;


      // var bookPublisher = document.createElement('small');
      // bookPublisher.textContent = "Publisher: " + publisher;
      // div.appendChild(bookPublisher);




      var bookDescription = document.createElement('p');
      bookDescription.textContent = description; bookDescription.setAttribute('class', 'desc');



      var bookMRP = document.createElement('p');
      bookMRP.setAttribute('class', 'mrp');
      bookMRP.textContent = "MRP: Rs " + mrp;

      var bookPrice = document.createElement('p');
      bookPrice.setAttribute('class', 'price');
      bookPrice.textContent = "Price: Rs " + price;



      var button = document.createElement('button');
      button.textContent = 'Add to Cart';
      button.setAttribute('class', 'addToCart');
      button.setAttribute('dataset.name', name);
      button.setAttribute('dataset.type', type);
      button.setAttribute('dataset.price', price);
      button.setAttribute('onclick', 'addBooksToCart(this)');

      div.appendChild(img);
      div.appendChild(title);
      title.appendChild(bookAuthor);
      bookAuthor.appendChild(bookDescription);
      bookAuthor.appendChild(bookMRP);
      bookAuthor.appendChild(bookPrice);
      bookAuthor.appendChild(button);


      parentNode.appendChild(div);

      $(".desc").shorten({
        "showChars" : 150,
        "moreText"	: "See More",
        "lessText"	: "Less",
     });
    }
  }


}
