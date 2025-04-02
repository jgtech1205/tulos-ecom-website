import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getAllCategories, getMyOrders } from "@/sanity/helpers/queries";
import ClientAuthUI from "./ClientAuthUI";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  const categories = await getAllCategories();
  const orders = userId ? await getMyOrders(userId) : [];

  return (
    <header className="border-b border-b-gray-400 py-5 sticky top-0 z-50 bg-white">
      <Container className="flex items-center justify-between gap-7 text-lightColor">
        <HeaderMenu categories={categories} />
        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5">
          <MobileMenu />
          <Logo>Tulos</Logo>
        </div>
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <ClientAuthUI orderCount={orders.length || 0} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
