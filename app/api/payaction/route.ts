import { verifySession } from "@/actions/session";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { convertToCustomISO } from "@/lib/formatOrderDate";

//requires phone dashes 010-5555-5555
export const POST = async (req: NextRequest) => {
  try {
    const session = await verifySession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, billingName, ordererName, phone } = await req.json();

    const student = await prisma.student.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        school: true,
      },
    });
    if (!student) {
      return Response.json({ error: "Student not found" }, { status: 404 });
    }
    const shoppingCart = await prisma.savedMeals.findMany({
      where: {
        student: {
          id: session.userId,
        },
      },
    });

    const payment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payments.create({
        data: {
          amount,
          student: {
            connect: {
              id: session.userId,
            },
          },
          studentName: student.name,
          schoolName: student.school.name,
          payer: billingName,
          payerPhone: formatPhoneNumber(phone),
        },
      });

      const createdMeals = await tx.meals.createMany({
        data: shoppingCart.map((meal) => ({
          paymentsId: payment.id,
          studentId: session.userId,
          date: meal.date,
          mealType: meal.mealType,
        })),
      });
      if (createdMeals && createdMeals.count === shoppingCart.length) {
        await tx.savedMeals.deleteMany({
          where: {
            student: {
              id: session.userId,
            },
          },
        });

        return { id: payment.id, createdAt: payment.createdAt };
      } else return null;
    });

    if (!payment) {
      return Response.json({ error: "Payment failed" }, { status: 400 });
    }

    const payActionUrl = "https://api.payaction.app/order";

    const body = {
      order_number: payment.id,
      order_amount: amount,
      order_date: convertToCustomISO(new Date().toISOString()),
      billing_name: billingName,
      orderer_name: ordererName,
      orderer_phone_number: formatPhoneNumber(phone),
      orderer_email: student.email,
    };

    const response = await fetch(payActionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PAYACTION_KEY ?? "",
        "x-mall-id": process.env.PAYACTION_MALLID ?? "",
      },
      body: JSON.stringify(body),
    });
    console.log(await response.json());
    return Response.json({ success: true, id: payment.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Invalid request" }, { status: 500 });
  }
};
