import { verifySession } from "@/actions/session";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import type { NextRequest } from "next/server";
//requires phone dashes 010-5555-5555
export const POST = async (req: NextRequest) => {
  try {
    const session = await verifySession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, orderId, orderDate, billingName, ordererName, phone } =
      await req.json();

    const payActionUrl = "https://payaction.app/api/1.1/wf/order";
    const body = {
      apikey: process.env.PAYACTION_KEY,
      secretkey: process.env.PAYACTION_SECRET,
      mall_id: process.env.PAYACTION_MALLID,
      order_number: orderId,
      order_amount: amount,
      order_date: orderDate.toISOString(),
      billing_name: billingName,
      orderer_name: ordererName,
      orderer_phone_number: formatPhoneNumber(phone),
    };
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Invalid request" }, { status: 500 });
  }
};
