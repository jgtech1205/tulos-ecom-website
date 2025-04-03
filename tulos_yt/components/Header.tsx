import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { getAllCategories, getMyOrders } from "@/sanity/helpers/queries";
import ClientAuthUI from "./ClientAuthUI";
import { headers } from "next/headers";

const Header = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-next-pathname") || "";
  const isStudio = pathname.startsWith("/studio");

  const categories = await getAllCategories();

  let orders = [];
  if (!isStudio) {
    try {
      const user = await currentUser();
      const session = await auth(); // Added await here
      const userId = session.userId;
      orders = userId ? await getMyOrders(userId) : [];
    } catch (error) {
      console.error("Clerk authentication error:", error);
      orders = [];
    }
  }

  return (
    <header className="border-b border-b-gray-400 py-5 sticky top-0 z-50 bg-white">
      <Container className="flex items-center justify-between gap-7 flex-tightColor">
        <HeaderMenu categories={categories} />
        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5">
          <MobileMenu />
          <Logo>Tulos</Logo>
        </div>
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          {!isStudio && (
            <ClientAuthUI orderCount={orders.length || 0} />
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;