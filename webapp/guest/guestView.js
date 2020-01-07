import React from 'react'

import ModuleSwitch from '@webapp/commonComponents/moduleSwitch'
import ResetPasswordView from '@webapp/guest/resetPassword/resetPasswordView'
import ForgotPasswordView from '@webapp/guest/forgotPassword/forgotPasswordView'
import AcceptInvitationView from '@webapp/guest/acceptInvitation/acceptInvitationView'

import { guestModules } from '@webapp/app/appModules'

const GuestView = () => (
  <ModuleSwitch
    modules={[
      {
        path: guestModules.resetPassword.path,
        component: ResetPasswordView,
      },
      {
        path: guestModules.forgotPassword.path,
        component: ForgotPasswordView,
      },
      {
        path: guestModules.acceptInvitation.path,
        component: AcceptInvitationView,
      },
    ]}
  />
)

export default GuestView
