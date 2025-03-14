import React from 'react'
import { cn } from "@/lib/utils";

interface Props{
    children:React.ReactNode
    className?: string;
}

const Container = ({ children, className }: Props) => {
  const computedClassName = cn("max-w-screen-xl mx-auto px-4", className);
  console.log("Computed Container className:", computedClassName);

  return (
    <div className={computedClassName}>
      {children}
    </div>
  );
};

  

export default Container
