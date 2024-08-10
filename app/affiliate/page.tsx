import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import NavBar1 from "@/components/NavBarTW/NavBar1";

export default function AffiliatePage() {
  return (
    <div>
      <NavBar1 /> 
      <HeaderCentered title="Affiliate Program" description="Earn money by referring customers to EventJacket" /> 
      
      <div className="container mx-auto px-4">
       

        <div className="py-20">
          <h2 className="text-5xl font-extrabold text-center ">Coming Soon!</h2>
          <h2 className="text-2xl font-bold">How it works</h2>
          <p className="mt-4">You will receive a unique link that you can share with your audience. When someone signs up for EventJacket using your link, you will earn a commission on their subscription fees.</p>

          <h2 className="text-2xl font-bold mt-8">How much can I earn?</h2>
          <p className="mt-4">You will earn 20% of the subscription fees for each customer that signs up using your link.</p>

          <h2 className="text-2xl font-bold mt-8">How do I get paid?</h2>
          <p className="mt-4">Commissions are paid out monthly via PayPal.</p>

          <h2 className="text-2xl font-bold mt-8">How do I get started?</h2>
          <p className="mt-4">To get started, sign up for the affiliate program and we will provide you with your unique link.</p>
        
          <div className="mt-8">
            <a href="#" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Sign up now</a>

            <p className="mt-4">Already an affiliate? <a href="#" className="text-blue-500">Log in</a></p>




          </div>
          </div>
</div>
<FooterFull />
    </div>
  )
}