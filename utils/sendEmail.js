const { Resend } = require("resend");


const sendEmail = async (to, subject, text) => {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
    const { data, error } = await resend.emails.send({
      from: "you@yourdomain.com", // must be verified in Resend dashboard
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    if (error) {
      console.error("Error sending email:", error);
      return null;
    }

    console.log("Email sent! ID:", data.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;