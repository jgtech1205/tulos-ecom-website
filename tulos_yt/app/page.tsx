import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import HomeBanner from "@/components/HomeBanner";


export default function Home() {
  return (
   <div>
    <Container className= "py-10">
    <HomeBanner />
    </Container>
   </div>

  );
}
