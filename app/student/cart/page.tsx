import { getShoppingCart } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";

import DeleteMealFromCartButton from "@/components/students/DeleteMealFromCartButton";
import { parseKoreanMealType } from "@/lib/parseKoreanMealType";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifySession } from "@/actions/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const StudentShoppingCart = async () => {
  await verifySession();
  const meals = await getShoppingCart();

  if (!Array.isArray(meals) && meals.error) {
    return redirect("/login");
  }

  return (
    <MainContainer hasHeader className="block py-6">
      {meals && Array.isArray(meals) && !meals.length && (
        <div className="mx-auto max-w-sm w-full text-center">
          장바구니가 비어있습니다
        </div>
      )}
      {meals && Array.isArray(meals) && meals.length > 0 && (
        <section className="space-y-4 max-w-md mx-auto border shadow-sm pt-4 pb-8 px-4 rounded-md">
          <h1 className="text-2xl font-bold text-center mb-12">장바구니</h1>
          {meals &&
            Array.isArray(meals) &&
            meals.length > 0 &&
            meals.map((meal) => (
              <div
                key={meal.id}
                className="grid grid-cols-3 gap-4 items-center justify-center text-center relative"
              >
                <div>{format(new Date(meal.date), "yyyy-MM-dd")}</div>
                <div>{parseKoreanMealType(meal.mealType)}</div>
                <div>7,000원</div>
                <DeleteMealFromCartButton id={meal.id} />
              </div>
            ))}
          <Button className="w-full" asChild>
            <Link href="/student/cart/payment">결제</Link>
          </Button>
        </section>
      )}
    </MainContainer>
  );
};

export default StudentShoppingCart;
