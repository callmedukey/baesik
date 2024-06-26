"use client";
import React from "react";
import { Button } from "../ui/button";
import { logout } from "@/actions/auth";

const SignoutButton = ({ isAdmin }: { isAdmin?: boolean }) => {
  return (
    <Button
      className="w-full max-w-md mx-auto flex mb-6"
      variant="outline"
      onClick={async () => {
        await logout(isAdmin ? "/admin" : "/");
      }}
    >
      로그아웃
    </Button>
  );
};

export default SignoutButton;
