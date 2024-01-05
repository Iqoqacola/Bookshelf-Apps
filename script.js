// // Fungsi untuk menambahkan data buku
// function addBook(book) {
//   // Mendapatkan id buku yang unik
//   const id = new Date().getTime();

//   // Menyimpan data buku ke dalam localStorage
//   localStorage.setItem(id, JSON.stringify(book));
// }

// // Fungsi untuk mengambil data buku yang belum selesai dibaca
// function getUnreadBooks() {
//   return localStorage.getItems().filter((item) => JSON.parse(item.value).isComplete === false);
// }

// // Fungsi untuk mengambil data buku yang sudah selesai dibaca
// function getFinishedBooks() {
//   return localStorage.getItems().filter((item) => JSON.parse(item.value).isComplete === true);
// }

// // Fungsi untuk memindahkan buku ke rak "Belum selesai dibaca"
// function moveToUnread(book) {
//   unreadBooks.push(book);
//   finishedBooks.splice(finishedBooks.indexOf(book), 1);
// }

// // Fungsi untuk memindahkan buku ke rak "Selesai dibaca"
// function moveToFinished(book) {
//   finishedBooks.push(book);
//   unreadBooks.splice(unreadBooks.indexOf(book), 1);
// }

// // Fungsi untuk menghapus data buku
// function removeBook(book) {
//   localStorage.removeItem(book.id);
// }

// // Inisialisasi variabel
// const unreadBooks = getUnreadBooks();
// const finishedBooks = getFinishedBooks();

// // Event listener untuk tombol "Tambah"
// // document.


const book = [];
const RENDER_EVENT = 'render-book'

// GENERATE ID
const generateId = () => {
  return + new Date;
}

// GENEREATED BOOK OBJECT
const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

// CONTENT LOAD
document.addEventListener('DOMContentLoaded', () => {
  const submitBook = document.getElementById('newBook');

  submitBook.addEventListener('submit', event => {
    event.preventDefault();
    addBook();
  })

  LoadData()

})

// ADD BOOK
const addBook = () => {
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const year = document.getElementById('bookYear').value;
  const cekbox = document.getElementById('bookComplete').checked;


  const IdBook = generateId();

  const bookObject = generateBookObject(IdBook,title, author, year, cekbox);
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}

// RENDER EVENT
document.addEventListener(RENDER_EVENT, () => {

  const unCompleted = document.getElementById('unCompleted');
  const Completed = document.getElementById('Completed');

  unCompleted.innerHTML = '';
  Completed.innerHTML = '';
  

  for(const bookItem of book){
    const bookElement = makeBook(bookItem);

    if(bookItem.isComplete == false){
      unCompleted.append(bookElement);
    }else {
      Completed.append(bookElement);
    }
  }


})

// MAKEBOOK
const makeBook = booksObject => {
  const divBook = document.createElement('div');
  divBook.classList.add('book');

  const article = document.createElement('article');

  const makeTitle = document.createElement('h3');
  makeTitle.innerHTML = booksObject.title;
  const makeAuthor = document.createElement('p');
  makeAuthor.innerText = 'Author: ' + booksObject.author;

  const makeYear = document.createElement('p');
  makeYear.innerText = 'Year: ' + booksObject.year;

  
  const bookButton = document.createElement('div');
  bookButton.classList.add('bookButton');

  if(booksObject.isComplete){

    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.setAttribute('type', 'submit');
    buttonGreen.innerText = "Unfinished";

    buttonGreen.addEventListener('click', () => {
      unfinished(booksObject.id);
    })

    const buttonRed = document.createElement('button');
    buttonRed.classList.add('red');
    buttonRed.setAttribute('type', 'submit');
    buttonRed.innerText = "Delete";

    buttonRed.addEventListener('click', () => {
      deleteBook(booksObject.id);
    })


    bookButton.append(buttonGreen, buttonRed);

    article.append(makeTitle, makeAuthor, makeYear);
    divBook.append(article, bookButton);

  } else {
    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.setAttribute('type', 'submit');
    buttonGreen.innerText = "Finished";

    buttonGreen.addEventListener('click', () => {
      finished(booksObject.id);
    })

    const buttonRed = document.createElement('button');
    buttonRed.classList.add('red');
    buttonRed.setAttribute('type', 'submit');
    buttonRed.innerText = "Delete";

    buttonRed.addEventListener('click', () => {
      deleteBook(booksObject.id);
    })


    bookButton.append(buttonGreen, buttonRed);

    article.append(makeTitle, makeAuthor, makeYear);
    divBook.append(article, bookButton);
  }

  return divBook;
}


// FIND BOOK ID
const findBookID = bookID => {
  for (const bookItem of book){
    if(bookItem.id == bookID){
      return bookItem;
    }
  }
  return null;
}


// FIND BOOK INDEX
const findBookIndex = bookID => {
  for (const index in book){
    if(book[index].id === bookID){
      return index;
    }
  }

  return -1;
}

// EVENT FINISHED
const finished = bookID => {
  const bookTarget = findBookID(bookID);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}

// EVENT UNFINISHED
const unfinished = bookID => {
  const bookTarget = findBookID(bookID);

  if(bookTarget == null) return;

  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  
}

// EVENT DELETE
const deleteBook = bookID => {
  const bookTarget = findBookIndex(bookID);

  if(bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}


// WEBSTORAGE
const localStorageKEY = 'Books-Apps';
const Event_Save = 'saved-book'

document.addEventListener(Event_Save, () => {
  console.log(localStorage.getItem(localStorageKEY))
})

  // SET DATA
const saveData = () => {
  const parsed = JSON.stringify(book);
  localStorage.setItem(localStorageKEY, parsed);
  document.dispatchEvent(new Event(Event_Save));
}

  // GET DATA
const LoadData = () => {
  const serializedData = localStorage.getItem(localStorageKEY);
  let data = JSON.parse(serializedData);

  if(data !== null){
    for(const buku of data){
      book.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}