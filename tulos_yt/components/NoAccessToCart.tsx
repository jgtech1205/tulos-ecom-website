import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Logo from "./Logo";

const NoAccessToCart = () => {
  return (
    <div className="flex justify-center py-20 bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <Logo>Tulos</Logo>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            Log in to view your cart items and checkout. Don&apos;t miss out on
            your favorite products!
          </p>
          <SignInButton mode="modal">
            <Button className="w-full font-semibold" size="lg">
              Sign in
            </Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAccessToCart;
