import { headerData } from "@/constants";
import Link from "next/link";
import React from "react";

const HeaderMenu = () => {
  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">

      {headerData?.map((item) => (
        <Link key={item?.title} 
              href={item?.href}
               className="hover:text-darkColor hoverEffect"
               >
          {item?.title}
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;

