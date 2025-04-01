"use client";
import { CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Props {
  categories: CATEGORIES_QUERYResult;
  slug: string;
}
const CategoryProducts = ({ categories, slug }: Props) => {
  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border">
        {categories?.map((item) => (
          <Button key={item?._id} className="bg-transparent">
            {item?.title}
          </Button>
        ))}
      </div>
      <div className="w-full bg-red-200">products</div>
    </div>
  );
};

export default CategoryProducts;