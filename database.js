if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://heroku_s3cr6lt7:dc7fc2fcf1rt25bqust68dkhq9@ds143156.mlab.com:43156/heroku_s3cr6lt7'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/biblio-idees' }
}
