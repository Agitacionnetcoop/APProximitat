const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendLoginEmail = async (user, code) => {
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: user.email,
          },
        ],
        dynamic_template_data: {
          name: user.name,
          code: code,
          url: `${process.env.ENDPOINT_URL}:${process.env.PORT}/redirect?to=auth/${code}`,
          email: process.env.SENDGRID_SUPORT_EMAIL,
        },
      },
    ],
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME,
    },
    template_id: process.env.SENDGRID_TEMPLATE_ID_LOGIN,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendLoginEmail