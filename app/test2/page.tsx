'use client'; 

import Sidebar1 from "@/components/block/sidebar-01/sidebar-01";
import { EventJacketCalculator } from "@/components/event-jacket-calculator";
import { FeeCalculator } from "@/components/fee-calculator";
import { Sidebar3 } from "@/components/SideBar3";
import FormBuilder from "../form-builder/page";

export default function page() {
  return (
    <div>
      <FormBuilder  />
      <EventJacketCalculator /> 
      <FeeCalculator /> 
    </div>
  )
}