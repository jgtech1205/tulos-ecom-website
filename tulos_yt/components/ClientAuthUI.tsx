"use client";

import { ClerkLoaded, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ListOrdered } from "lucide-react";

type Props = {
  orderCount: number;
};

const ClientAuthUI = ({ orderCount }: Props) => {
  return (
    <ClerkLoaded>
      <SignedIn>
        <Link href="/orders" className="group relative">
          <ListOrdered className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {orderCount || 0}
          </span>
        </Link>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm font-semibold hover:text-darkColor hoverEffect">
            Login
          </button>
        </SignInButton>
      </SignedOut>
    </ClerkLoaded>
  );
};

<<<<<<< HEAD
export default ClientAuthUI;

=======
export default ClientAuthUI;
>>>>>>> 83cdf3f (updated cartPage)
