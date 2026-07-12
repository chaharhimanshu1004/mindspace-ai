export const otpEmailHtml = (otp: string, email: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your MindSpace verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;border:1px solid #E5E7EB;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5 0%,#6366F1 100%);padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">MindSpace</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Your second brain</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#2F3441;letter-spacing:-0.3px;">Verify your email</p>
              <p style="margin:0 0 32px;font-size:15px;color:#6B7280;line-height:1.6;">
                We received a request to verify <strong style="color:#2F3441;">${email}</strong>. Use the code below to complete sign-up.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#F5F3FF;border:2px solid #C7D2FE;border-radius:12px;padding:20px 40px;text-align:center;">
                      <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:10px;color:#4F46E5;font-variant-numeric:tabular-nums;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:13px;color:#6B7280;text-align:center;">
                This code expires in <strong style="color:#2F3441;">10 minutes</strong>. Do not share it with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #F3F4F6;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                If you did not request this, you can safely ignore this email. Your account will not be created.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
