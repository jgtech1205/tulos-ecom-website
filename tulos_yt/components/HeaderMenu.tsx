"use client";

import React from "react";
import { CATEGORIES_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerData } from "@/constants";

const HeaderMenu = ({ categories }: { categories: CATEGORIES_QUERYResult }) => {
  const pathname = usePathname();

  const baseLinkClasses = "hover:text-darkColor hoverEffect relative group";
  const underlineClasses = "absolute -bottom-0.5 h-0.5 bg-darkColor hoverEffect";

  // Titles from headerData to filter out from categories
  const staticTitles = headerData.map((item) => item.title.trim().toLowerCase());

  const filteredCategories = categories?.filter((category) => {
    const title = category?.title?.trim().toLowerCase();
    return title && !staticTitles.includes(title);
  });

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {/* Static links */}
      {headerData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={`${baseLinkClasses} ${pathname === item.href ? "text-darkColor" : ""}`}
        >
          <span className="whitespace-nowrap">{item.title}</span>
          <span
            className={`${underlineClasses} left-1/2 w-0 group-hover:w-1/2 group-hover:left-0 ${
              pathname === item.href ? "w-1/2 left-0" : ""
            }`}
          />
          <span
            className={`${underlineClasses} right-1/2 w-0 group-hover:w-1/2 group-hover:right-0 ${
              pathname === item.href ? "w-1/2 right-0" : ""
            }`}
          />
        </Link>
      ))}

      {/* Dynamic categories (filtered) */}
      {filteredCategories?.map((category) => {
        const slug = `/category/${category?.slug?.current}`;
        return (
          <Link
            key={category?._id}
            href={slug}
            className={`${baseLinkClasses} ${pathname === slug ? "text-darkColor" : ""}`}
          >
            <span className="whitespace-nowrap">{category?.title}</span>
            <span
              className={`${underlineClasses} left-1/2 w-0 group-hover:w-1/2 group-hover:left-0 ${
                pathname === slug ? "w-1/2 left-0" : ""
              }`}
            />
            <span
              className={`${underlineClasses} right-1/2 w-0 group-hover:w-1/2 group-hover:right-0 ${
                pathname === slug ? "w-1/2 right-0" : ""
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderMenu;


