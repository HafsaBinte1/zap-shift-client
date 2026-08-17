const nodemailer = require('nodemailer');
const { STATUS_LABELS } = require('../utils/statusFlow');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const SUBJECTS = {
  pending: (code) => `Your parcel ${code} has been placed`,
  assigned: (code) => `A delivery partner picked up your order ${code}`,
  picked: (code) => `Your parcel ${code} has been collected`,
  inTransit: (code) => `Your parcel ${code} is out for delivery`,
  delivered: (code) => `Your parcel ${code} has been delivered`,
  cancelled: (code) => `Your order ${code} was cancelled`
};

function buildTemplate(order, status, link) {
  const label = STATUS_LABELS[status] || status;
  const riderBlock =
    status === 'assigned' && order.deliveryManId
      ? `<p style="margin:0 0 12px;color:#0F172A;"><strong>Delivery partner assigned</strong> — they'll be in touch to collect your parcel.</p>`
      : '';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F8FAFC;padding:24px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
      <div style="background:#0D9488;padding:20px 24px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;">Delivery Wala</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 8px;color:#475569;font-size:14px;">Parcel: <strong style="color:#0F172A;">${order.productName}</strong></p>
        <p style="margin:0 0 16px;color:#475569;font-size:14px;">Tracking code: <strong style="color:#0F172A;">${order.trackingCode}</strong></p>
        <div style="background:#CCFBF1;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
          <p style="margin:0;color:#0F172A;font-weight:bold;">${label}</p>
        </div>
        ${riderBlock}
        <a href="${link}" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;">Track your parcel</a>
        <p style="margin:20px 0 0;color:#475569;font-size:12px;">If the button doesn't work, copy this link: ${link}</p>
      </div>
    </div>
  </div>`;
}

exports.sendStatusEmail = async ({ to, order, status }) => {
  const link = `${process.env.CLIENT_URL}/track/${order.trackingCode}`;
  try {
    await transporter.sendMail({
      from: `"Delivery Wala" <${process.env.EMAIL_USER}>`,
      to,
      subject: SUBJECTS[status] ? SUBJECTS[status](order.trackingCode) : `Update on order ${order.trackingCode}`,
      html: buildTemplate(order, status, link)
    });
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};
