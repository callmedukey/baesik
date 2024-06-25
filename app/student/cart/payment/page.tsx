import { getShoppingCart } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentForm from "@/components/students/PaymentForm";

const page = async () => {
  const meals = await getShoppingCart();
  let total = 0;
  if (!Array.isArray(meals) && meals.error) {
    return redirect("/login");
  }

  if (Array.isArray(meals) && meals.length > 0) {
    total = Math.floor(meals.reduce((acc, meal) => acc + 7000, 0));
  }
  return (
    <MainContainer hasHeader className="justify-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">결제</CardTitle>
          <CardDescription className="text-center">
            결제금액: {total.toLocaleString()}원
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex justify-between">
            <div>학식 x {Array.isArray(meals) && meals.length}</div>
            <div>{total.toLocaleString()}원</div>
          </div>
          <PaymentForm totalAmount={total} />
        </CardContent>
      </Card>
    </MainContainer>
  );
};

export default page;
