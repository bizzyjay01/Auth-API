const nodemailer = require("nodemailer")


// zoho sendgrid, gsuite,microsoft360
// gmail is free. the ones above are not

const sendUserEmail = async (userEmail) =>{
    // Login Details

    try {
        const mailTransporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        }) 
    
        // Details to Send
        const detailsToSend = {
            from:process.env.EMAIL,
            to:userEmail,
            subject:"WELCOME TO BACKEND EMAIL",
            html: `<h1>hello</h1>`
        }
    
        const result = await mailTransporter.sendMail(detailsToSend)
        
    } catch(error) {
        console.log(error)
    }
}

module.exports = sendUserEmail