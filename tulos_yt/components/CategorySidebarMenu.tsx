"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductsAvailable from "./NoProductsAvailable";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  categories: CATEGORIES_QUERYResult;
  slug: string;
}

const CategorySidebarMenu = ({ categories, slug }: Props) => {
  const router = useRouter();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (categorySlug: string) => {
    try {
      setLoading(true);
      const query = `*[_type == 'product' && references(*[_type == 'category' && slug.current == $categorySlug]._id)] | order(name asc)`;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  // Static categories for buttons
  const staticItems = [
    { _id: "featured", slug: { current: "featured" }, title: "Featured" },
    { _id: "new", slug: { current: "new" }, title: "New" },
    { _id: "t-shirt", slug: { current: "t-shirt" }, title: "T-Shirt" },
  ];

  // Filter Sanity categories to exclude those already handled statically
  const staticSlugs = staticItems.map((item) => item.slug.current);
  const filteredCategories = categories?.filter(
    (cat) => !staticSlugs.includes(cat?.slug?.current?.toLowerCase() || "")
  );

  const menuItems = [...staticItems, ...(filteredCategories || [])];

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Category Menu */}
      <div className="flex flex-col md:min-w-40 border w-full max-w-xs">
        {menuItems.map((item) => {
          const normalizedSlug = item?.slug?.current?.toLowerCase() || "";

          return (
            <Button
              key={item?._id}
              onClick={() => {
                setCurrentSlug(normalizedSlug);
                router.push(`/category/${normalizedSlug}`);
              }}
              className={`w-full justify-start rounded-none border-0 border-b last:border-b-0 text-left font-semibold bg-transparent
                text-darkColor shadow-none hover:bg-darkColor/80 hover:text-white
                ${
                  normalizedSlug === currentSlug &&
                  "bg-darkColor text-white border-darkColor"
                }`}
            >
              {item?.title}
            </Button>
          );
        })}
      </div>

      {/* Product Display */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="animate-spin" />
              <span className="text-lg font-semibold">
                Product is loading...
              </span>
            </div>
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {products.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductsAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategorySidebarMenu;
