import FooterFull from "@/components/Footers/FooterFull";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import NewQRCodeGenerator from "@/components/NewQRCodeGenerator";


export default function QRCode ()
{
  return (
    <div>
      <NavBar1 />
      <NewQRCodeGenerator />
      <FooterFull />
    </div>
  )
}