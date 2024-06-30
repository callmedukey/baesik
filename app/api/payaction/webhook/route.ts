import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { mall_id, order_number, order_status } = await req.json();
    console.log("web hook arrived");
    console.log(mall_id, order_number, order_status);
    if (
      mall_id !== process.env.PAYACTION_MALLID ||
      order_status !== "매칭완료"
    ) {
      return Response.json({ error: "Invalid mall_id" }, { status: 400 });
    }

    const updated = await prisma.payments.update({
      where: {
        id: order_number,
      },
      data: {
        paid: true,
      },
    });

    if (updated) {
      return new Response("OK", { status: 200 });
    } else {
      return new Response("Failed", { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Invalid request" }, { status: 500 });
  }
}
