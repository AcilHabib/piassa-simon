import Image from "next/image";
import { FC } from "react";
import DateTime from "./DateTime";
import { LoginInformationProps } from "~/types";

const LoginInformation: FC<LoginInformationProps> = ({ currentStuff }) => {
  return (
    <div className="flex h-28 shadow-xl  backdrop-blur-xl bg-black/30   rounded-3xl items-center gap-2  font-semibold justify-end">
      {/* <DateTime /> */}
      <div className="flex  flex-col items-start justify-center gap-4 py-4 px-8 w-max">
        <div className="flex gap-2">
          <img
            className="fill-white w-5"
            src={"/svgs/user.svg"}
            height={10}
            width={10}
            alt="current stuff"
          />
          <div className="text-2xl text-start w-max text-white/80 font-light capitalize ">
            {currentStuff?.username}
          </div>
        </div>
        <div className="flex gap-2">
          <img
            className="fill-white w-5"
            src={"/svgs/shop.svg"}
            height={10}
            width={10}
            alt="current stuff"
          />
          <div className="text-2xl text-start w-max text-white/80 uppercase  ">
            {currentStuff?.store.name}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-28">
        <Image
          // src={currentStuff?.store.logo || '/logos/piassa-logo-minimal.svg'}
          src={"/defaults/article.webp"}
          alt={`${currentStuff?.store.name} logo`}
          width={80}
          height={80}
          className="h-28 w-28 border-[1px]  border-black/10 rounded-e-xl object-cover"
        />
      </div>
    </div>
  );
};

export default LoginInformation;
