import SignupForm from "@/components/auth/SignupForm";
import MainContainer from "@/components/layout/main-container";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <MainContainer>
      <SignupForm />
    </MainContainer>
  );
};

export default page;
