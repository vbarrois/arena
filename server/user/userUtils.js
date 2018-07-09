const bcrypt = require('bcrypt')

const validEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const comparePassword = bcrypt.compare

const passwordHash = async password => await bcrypt.hash(password, 10)

// at least 6 chars, 1 lower case, 1 upper case and 1 number
const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})`)
const validPassword = password => passwordRegex.test(password)

module.exports = {
  validEmail,
  comparePassword,
  passwordHash
}