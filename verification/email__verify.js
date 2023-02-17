const mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../env');




const sendMail = (intro, name, email, instruction, text, link) => {
    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    }


    const transporter = nodemailer.createTransport(config)

    let Mailgenarator = new mailgen({
        theme: 'cerberus',
        product: {
            name: "DART SOCIETY",
            link: 'http://mailgen.js/'
        }
    });
    let response = {
        body: {
            name: name,
            intro: intro,
            action: {
                instructions: instruction,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: text,
                    link: link
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
    let mail = Mailgenarator.generate(response)

    let message = {
        from: EMAIL,
        to: email,
        subject: text,
        html: mail
    }

    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("messege sent", info.response);
        }
    })
}

module.exports = { sendMail }