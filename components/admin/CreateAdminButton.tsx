"use client";
import { createAdmin } from "@/actions/auth";
import { Button } from "../ui/button";

const CreateAdminButton = () => {
  return (
    <Button
      onClick={async () => {
        const res = await createAdmin();
        console.log(res);
      }}
    >
      CreateAdminButton
    </Button>
  );
};

export default CreateAdminButton;
