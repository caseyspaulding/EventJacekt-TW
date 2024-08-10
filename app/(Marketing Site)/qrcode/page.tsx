import NavBar1 from "@/components/NavBarTW/NavBar1";
import NewQRCodeGenerator from "@/components/NewQRCodeGenerator";
import QRCodeGenerator from "@/components/QRCodeGenator";
import { Footer } from "flowbite-react";

export default function QRCode ()
{
  return (
    <div>
      <NavBar1 />
     <NewQRCodeGenerator /> 
      <Footer />
    </div>
  )
}