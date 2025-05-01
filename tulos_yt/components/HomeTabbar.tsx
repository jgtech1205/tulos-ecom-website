import { productType } from "@/constants";
import { Repeat } from "lucide-react";
import React from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold">
      <div className="flex items-center gap-1.5">
        {productType?.map((item) => (
          <button
            key={item?.value}
            onClick={() => onTabSelect(item?.value)}
            className={`border border-darkColor px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-darkColor hover:text-white hoverEffect ${
              selectedTab === item?.value && "bg-darkColor text-white"
            }`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      <button className="border border-darkColor p-2 rounded-full hover:bg-darkColor hover:text-white hoverEffect">
        <Repeat className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HomeTabbar;
