const {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksByIdHandler
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBooksByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooksByIdHandler
  }
];

module.exports = routes;
