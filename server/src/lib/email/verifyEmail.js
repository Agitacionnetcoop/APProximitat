const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (user) => {
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
          url: `${process.env.ENDPOINT_URL}:${process.env.PORT}/redirect?to=verify/${user.id}`,
          email: process.env.SENDGRID_SUPORT_EMAIL,
        },
      },
    ],
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME,
    },
    template_id: process.env.SENDGRID_TEMPLATE_ID,
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

module.exports = sendEmail