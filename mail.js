import pkg from 'nodemailer';
const { createTransport } = pkg;

const authInfo = {
  service: 'Hotmail',
  auth: {
    user: String(process.env.HOTMAIL_EMAIL),
    pass: String(process.env.HOTMAIL_PWD)
  }
};

export async function sendMail(messageStr) {
  const transporter = createTransport(authInfo);

  const mailOptions = {
    from: 'declanherbertson@hotmail.com',
    to: 'declanherbertson@gmail.com',
    subject: 'Discord Keyword Alert',
    text: messageStr
  };

  console.log("sending email");
  try {
    const msg = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('failed sending email', err)
  } finally {
    transporter.close();
  }
}
