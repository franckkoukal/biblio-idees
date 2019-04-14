if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://heroku_fwf59vjf:md0ub9v5lnjmu2296a71bkd99s@ds139946.mlab.com:39946/heroku_fwf59vjf'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot' }
}