"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES_QUERYResult } from "@/sanity.types";
import { Button } from "./ui/button";

interface Props {
  categories: CATEGORIES_QUERYResult;
  slug: string;
}

const CategorySidebarMenu = ({ categories, slug }: Props) => {
  const router = useRouter();

  // Add Featured and New manually at the top
  const staticItems = [
    { _id: "featured", slug: { current: "featured" }, title: "Featured" },
    { _id: "new", slug: { current: "new" }, title: "New" },
  ];

  // Filter out any duplicates from dynamic categories
  const filteredCategories = categories?.filter(
    (cat) =>
      !["featured", "new"].includes(cat?.slug?.current?.toLowerCase() || "")
  );

  const menuItems = [...staticItems, ...(filteredCategories || [])];

  return (
    <div className="flex flex-col md:min-w-40 border w-full max-w-xs">
      {menuItems.map((item) => (
        <Button
          key={item?._id}
          onClick={() => router.push(`/category/${item?.slug?.current}`)}
          className={`w-full justify-start rounded-none border-0 border-b last:border-b-0 text-left font-semibold bg-transparent text-darkColor shadow-none hover:bg-darkColor hover:text-white ${
            item?.slug?.current === slug && "bg-darkColor text-white border-darkColor"
          }`}
        >
          {item?.title}
        </Button>
      ))}
    </div>
  );
};

export default CategorySidebarMenu;
