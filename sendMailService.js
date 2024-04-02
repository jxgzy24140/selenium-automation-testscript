const nodemailer = require("nodemailer");
const fs = require("fs");

const mailService = {
  EmailHost: "smtp.gmail.com",
  EmailUserName: "kiet24140@gmail.com",
  EmailPassword: "hogu juru xure sevz",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailService.EmailUserName,
    pass: mailService.EmailPassword,
  },
});

const sendReportToMail = (fileName) => {
  const now = new Date();

  const mailOptions = {
    from: mailService.EmailUserName,
    to: "kiet24140@gmail.com",
    subject: "Automaiton testing has been completed!",
    text: `Automation test completed at ${now.toLocaleString()}`,
    attachments: [
      {
        filename: fileName,
        path: `D:/Lab/seminar/Selenium2/${fileName}`,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendReportToMail };
