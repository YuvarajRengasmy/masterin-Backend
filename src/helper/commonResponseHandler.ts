import { saveLog } from "../controller/logs.controller";
import { LogsDocument, Logs } from "../model/logs.model";
var nodemailer = require('nodemailer');


/**
 * @param res {Function} Response 
 * @param success {Boolean} Http Status Code for the response
 * @param result {Object/Array} Result for the Response
 * @param message {string} Primary message for the response
 * @param extendedMessage {Object} Detailed Message for the error Message
 * @function commonResponse {Function} Used for Handling the Common Response
 */

export let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage?) {
    const LogsData: LogsDocument = req.body;
    let date = new Date()
    LogsData.activity = activity;
    var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
    LogsData._id = undefined;
    LogsData.userId = req.body.loginId
    LogsData.url = req.body.baseurl;
    LogsData.time = date.getTime();
    LogsData.date = date;
    LogsData.level = level;
    LogsData.description = message;
    LogsData.method = method;
    LogsData.processStatus = (statusCode === 200) ? true : false;
    saveLog(LogsData);
    res.status(statusCode);
    return res.json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
}



export const sendEmail = async (req, toMail, subject?: any, text?: any) => {
    var sender = nodemailer.createTransport({
        service: 'outlook',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contact@Pixalive.me',
            pass: 'Timepass@167^'
        }
    });

    var composemail = {
        from: 'contact@Pixalive.me',
        to: toMail,
        subject: subject,
        text: text
    }

    await sender.sendMail(composemail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail send successfully' + info.response)
        }
    })
}

//  this below code using to send notification for user connection request
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pixaliveadearns@gmail.com',
      pass: 'tcqkdycouumvjrac',
    },
  });
export let  sendConnectionNotification=async(email,name,image,referralLink)=>{
        if(!email){throw new Error("email is not register")}
                  const mailOptions = {
                  from: 'pixaliveadearns@gmail.com',
                  to: email,
                  subject: 'Connection Request',
                  text: `${name}:Request to Connect,\n ${image},\n ${referralLink} `,
                };
          await transporter.sendMail(mailOptions);
  
  }
