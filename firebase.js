const firebase = require('firebase')

const config = {
  apiKey: 'AIzaSyBQYqJUMx05-Mp98ux7YmraIan2Sh6O3rg',
  projectId: 'colorforcode',
  storageBucket: 'colorforcode.appspot.com'
}

firebase.initializeApp(config)

module.exports = {
  storage: firebase.storage()
}
