import nodemailer from "nodemailer";

const mailAcceptCancleOrder = async (customerEmail,cancelReason, customerName, orderId, orderDate,paymentMethod) => {
    console.log(cancelReason, customerName, orderId, orderDate,paymentMethod);
    
  const orderDates = new Date(orderDate); // hoặc new Date(order.date) nếu từ DB

  const formattedOrderDate = orderDates.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Xác nhận đơn hàng</title>
      </head>
      <body style="margin:0; padding:0; font-family:sans-serif; background-color:#f4f4f4;">
       <table width="100%" style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
  <tr>
    <td align="center">
      <table width="100%" style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" style="background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
            <h2>❌ Đơn hàng đã được hủy</h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 20px;">
            <p>Xin chào <strong>${customerName}</strong>,</p>
            <p>Chúng tôi xác nhận rằng đơn hàng <strong>#${orderId}</strong> của bạn đã được <strong>hủy thành công</strong> theo yêu cầu.</p>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">📦 Thông tin đơn hàng:</h4>
            <ul style="list-style-type: none; padding: 0; font-size: 14px;">
              <li><strong>Mã đơn hàng:</strong> ${orderId}</li>
              <li><strong>Ngày đặt hàng:</strong> ${formattedOrderDate}</li>
              <li><strong>Hình thức thanh toán:</strong> ${paymentMethod}</li>
            </ul>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">📝 Lý do hủy đơn:</h4>
            <p style="font-style: italic; background: #fef2f2; padding: 10px; border-radius: 5px; color: #b91c1c;">
              "${cancelReason}"
            </p>

            <p style="margin-top: 30px;">Nếu bạn cần thêm thông tin hoặc hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua các kênh bên dưới.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            📞 Hotline hỗ trợ: 1900 999 888 | 📧 Email:📧 support@soundora.com
            <br />
            © 2025 Soundora Store. All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    </td>
  </tr>
</table>

      </body>
    </html>
  `;
  const mailOptions = {
    from: '"Soundora" <SoundoraK204@gmail.com>',
    to: customerEmail,
    subject: "Đơn hàng bạn yêu cầu đã được hủy thành công!",
    text: `Mã đơn hàng của bạn là: ${orderId}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { mailAcceptCancleOrder };
