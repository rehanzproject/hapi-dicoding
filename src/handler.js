const { nanoid } = require('nanoid');
const Books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    insertedAt,
    updatedAt,
    name,
    year,
    author,
    finished: pageCount === readPage,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  };

  Books.push(newBooks);

  const isSuccess = Books.filter((Books) => Books.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku'
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const filteredBooks = Books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    ).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }));
    return {
      status: 'success',
      data: {
        books: filteredBooks
      }
    };
  }

  if (reading) {
    const filteredBooks = Books.filter((book) => book.reading === true).map(
      (book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    );
    return {
      status: 'success',
      data: {
        books: filteredBooks
      }
    };
  }

  if (finished === '1') {
    const filteredBooks = Books.filter((book) => book.finished === true).map(
      (book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    );
    return {
      status: 'success',
      data: {
        books: filteredBooks
      }
    };
  } else if (finished === '0') {
    const filteredBooks = Books.filter((book) => book.finished === false).map(
      (book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      })
    );
    return {
      status: 'success',
      data: {
        books: filteredBooks
      }
    };
  }

  const filteredBooks = Books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  return {
    status: 'success',
    success: true,
    data: {
      books: filteredBooks
    }
  };
};

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = Books.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      success: true,
      data: {
        book
      }
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage } =
    request.payload;
  if (!name) {
    const response = h.response({
      statusCode: 404,
      error: true,
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
      status: 'fail'
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      error: true,
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = Books.findIndex((books) => books.id === id);
  if (index !== -1) {
    Books[index] = {
      ...Books[index],
      name,
      year,
      author,
      summary,
      publisher,
      finished: pageCount === readPage,
      pageCount,
      readPage,
      reading: false,
      updatedAt
    };
    const response = h.response({
      statusCode: 200,
      error: false,
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: Books[index]
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    statusCode: 404,
    error: true,
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = Books.findIndex((Books) => Books.id === id);
  if (index !== -1) {
    Books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler
};
