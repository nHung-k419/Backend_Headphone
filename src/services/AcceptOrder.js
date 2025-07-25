import nodemailer from "nodemailer";

const mailAcceptOrder = async (customerEmail, customerName, orderId, orderDate, products, totalAmount) => {
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
  const productListHtml = products
    .map(
      (product) => `
    <li>${product.Name} (x${product.Quantity}) - ${product.Price}- ${product.Color} - ${product.Size}</li>
  `
    )
    .join("");
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Xác nhận đơn hàng</title>
      </head>
      <body style="margin:0; padding:0; font-family:sans-serif; background-color:#f4f4f4;">
        <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <tr>
                  <td bgcolor="#4CAF50" style="padding: 20px; color: white; text-align: center;">
                    <h1 style="margin:0;">Đặt hàng thành công!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p>Xin chào <strong>${customerName}</strong>,</p>
                    <p>Cảm ơn bạn đã đặt hàng tại <strong>Soundora</strong>. Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành xử lý.</p>
                    <h3>Thông tin đơn hàng:</h3>
                    <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
                    <p><strong>Ngày đặt:</strong> ${formattedOrderDate}</p>
                    <h3>Sản phẩm:</h3>
                    <ul>
                      ${productListHtml}
                    </ul>
                    <p style="text-align: right"><strong>Tổng tiền:</strong> ${totalAmount}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p>Chúng tôi sẽ gửi thông tin vận chuyển sớm nhất có thể. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@soundora.com">support@soundora.com</a></p>
                    <p style="margin-top: 30px;">Trân trọng,<br />Đội ngũ Soundora</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f0f0f0" style="padding: 20px; text-align: center; font-size: 12px; color: #777;">
                    © 2025 Soundora. All rights reserved.
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
    subject: "Đặt hàng thành công, vui lòng chờ xác nhận !",
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

export { mailAcceptOrder };
