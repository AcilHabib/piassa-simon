'use client';
import {FileText, Truck, WifiOff} from 'lucide-react';
import {FC} from 'react';
import InfoCard from './InfoCard';

const InfoHeader: FC = ({}) => {
  //   const { cart } = useCart()
  return (
    <div className="mb-5 flex w-[97%] justify-end gap-2">
      {/* <InfoCard content={12} Icon={WifiOff} label="Offline Orders" />
      <InfoCard content={11} Icon={null} label="Online Orders" />
      <InfoCard content={2} Icon={FileText} label="Invoices" />
      <InfoCard content={11} Icon={Truck} label="Delivery Note" /> */}
    </div>
  );
};

export default InfoHeader;
