const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//this function sends a welcome e-mail to the newly created user
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aakash988@yahoo.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

//this function sends an e-mail to a user that deletes the application
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aakash988@yahoo.com',
        subject: 'Thanks for using our application!',
        text: `Thanks for using the application ${name}. You are cool.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}