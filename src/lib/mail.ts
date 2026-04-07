import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvoiceEmailProps {
  to: string;
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  viewLink: string;
  businessName: string;
}

export const sendInvoiceEmail = async ({
  to,
  clientName,
  invoiceNumber,
  dueDate,
  totalAmount,
  viewLink,
  businessName,
}: SendInvoiceEmailProps) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "devbill <onboarding@resend.dev>",
      to: [to],
      subject: `New Invoice ${invoiceNumber} from ${businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: #09090b; color: white; padding: 10px 20px; borderRadius: 8px; font-weight: bold; font-size: 24px;">db</div>
          </div>
          
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Hello, ${clientName}</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${businessName} has sent you a new invoice <strong>${invoiceNumber}</strong>.
          </p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #71717a;">Amount Due:</span>
              <span style="font-weight: bold;">${totalAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #71717a;">Due Date:</span>
              <span style="font-weight: bold;">${dueDate}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${viewLink}" style="display: inline-block; background-color: #09090b; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">View & Download Invoice</a>
          </div>
          
          <p style="font-size: 14px; color: #71717a; line-height: 1.6; border-top: 1px solid #e4e4e7; pt-20px;">
            If you have any questions, please reply directly to this email or contact ${businessName}.
          </p>
          
          <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #a1a1aa;">
            Sent securely via devbill — Modern Invoicing for Developers
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Mail utility error:", error);
    return { success: false, error };
  }
};
