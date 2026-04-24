const govukPrototypeKit = require('govuk-prototype-kit')
const addFunction = govukPrototypeKit.views.addFunction

// Add your functions here
addFunction ('lastCharacters', (text, count) => text.substring (text.length - count))
