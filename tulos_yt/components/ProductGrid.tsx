"use client";

import React, { useEffect, useMemo, useState } from "react";
// ... other imports remain the same ...
const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Memoize the query and params
  const query = useMemo(() => `*[_type == 'product' && variant == $variant] | order(name asc)`, []);
  const params = useMemo(() => ({ variant: selectedTab.toLowerCase() }), [selectedTab]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(query, {
          signal: abortController.signal
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Product fetching Error", error);
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

  // ... rest of the component remains the same ...
};

export default ProductGrid;