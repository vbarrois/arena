import * as LocalStrategy from 'passport-local'

import * as User from '@core/user/user'
import * as UserValidator from '@core/user/userValidator'
import * as Validation from '@core/validation/validation'

import * as UserManager from '@server/modules/user/manager/userManager'
import * as UserPasswordUtils from '@server/modules/user/service/userPasswordUtils'

const _verifyCallback = async (req, email, password, done) => {
  const sendResp = (user, message) => (user ? done(null, user) : done(null, false, { message }))

  if (Validation.isValid(UserValidator.validateEmail(User.keys.email, { [User.keys.email]: email }))) {
    const user = await UserManager.findUserByEmailAndPassword(email, password, UserPasswordUtils.comparePassword)
    if (user) sendResp(user)
    else sendResp(null, Validation.messageKeys.user.userNotFound)
  } else {
    sendResp(null, Validation.messageKeys.user.emailInvalid)
  }
}

export default new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  _verifyCallback,
)
