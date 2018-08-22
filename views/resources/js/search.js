var bookKeys,count=0;


document.querySelector(".search-form").addEventListener('submit', searchBooks);
function searchBooks(e){
  $(".jumbotron").css('display','none');
  count = 0;
  e.preventDefault();
  console.log(e.target)
  var searchedItem = $("#searchedItem").val().toUpperCase();

  console.log(searchedItem);
  $("#bookList").text("");


  var bookKeys = Object.keys(books);

  for(let i = 0; i < bookKeys.length; i++){
    var k = bookKeys[i];
    var type = books[k].type;
    var name = books[k].name.toUpperCase();
    var image = books[k].image;
    var mrp = books[k].mrp;
    var price = books[k].price;
    var author = books[k].author;
    var publisher = books[k].publisher;
    var description = books[k].description;

    if( name.includes(searchedItem) || author.includes(searchedItem)){
      count++;
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
  if(count==0){
    console.log("No Items Found");
    $(".jumbotron").css('display','inline-block');
  }
}


$("#suggest").click(function(){
  swal("Your suggestion has been recorded.");
})
