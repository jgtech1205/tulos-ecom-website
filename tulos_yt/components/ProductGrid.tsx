"use client";

import React, { useEffect, useMemo, useState } from "react";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";
import NoProductsAvailable from "./NoProductsAvailable";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized query and params
  const query = useMemo(() => `*[_type == 'product' && variant == $variant] | order(name asc)`, []);
  const params = useMemo(() => ({ variant: selectedTab.toLowerCase() }), [selectedTab]);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.fetch<Product[]>(query, params, {
          signal: abortController.signal
        });
        setProducts(response);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Product fetching Error", err);
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [query, params]);

  const handleRetry = () => {
    setError(null);
    // The useEffect will automatically re-run since error state changed
  };

  return (
    <div className="mt-10 flex flex-col items-center w-full">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-lg font-semibold">Loading products...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 w-full px-4">
          <AnimatePresence mode="wait">
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductsAvailable selectedTab={selectedTab} />
      )}
    </div>
  );
};

export default ProductGrid;