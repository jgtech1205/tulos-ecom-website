"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  return <div>CartPage</div>;
};

export default CartPage;
