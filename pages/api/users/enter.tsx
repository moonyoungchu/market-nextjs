import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
// import twilio from "twilio";
// import sendEmail from "@libs/server/sendEmail";
//const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;

  if (!user) {
    return res.status(400).json({ ok: false });
  }

  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  console.log(">>>payload", payload);
  console.log(">>>user", user);
  console.log(">>>token", token);

  if (phone) {
    console.log(">>>test phone")
    // 테스트 잠시 봉인
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE_NUMBER!,
    //   body: `Your login token is ${payload}.`,
    // });
    //console.log("문자테스트", message);
  } else if (email) {
    console.log(">>>test mail")
    // 테스트 잠시 봉인
    // const emailSending = await sendEmail({
    //   email: email,
    //   subject: "Login token",
    //   message: `Hi! Your login token is ${payload}.`,
    // });
  }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
