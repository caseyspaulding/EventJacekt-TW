import AuthButton from "../components/AuthButton";

import NavBarTW from "@/components/NavBarTW/NavBarTW";
import SignUpButton from "@/components/SignUpButton";

export default async function Index() {
  return (
    <>
      <div className="bg-white ">
        <NavBarTW />
        <AuthButton />
        <SignUpButton />
      </div>
    </>
  );
}
