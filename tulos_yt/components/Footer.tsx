import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
  <FooterTop />
  <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <div className="space-y-4">
      <Logo>Tulos</Logo>
      <p className="text-gray-600 text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem ex ad  
        at vitae esse. Vero fuga laborum disti.
      </p>
      <SocialMedia 
        className="text-darkColor/60"
        iconClassName="border-darkColor/60 hover:border-darkColor hover:text-darkColor"
        tooltipClassName="bg-darkColor text-white"
      />
    </div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</Container>

    </footer>
  );
};

export default Footer;

