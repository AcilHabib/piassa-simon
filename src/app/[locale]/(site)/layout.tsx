import MainContainer from "@/components/layout/containers/MainContainer";
import NavBar from "@/components/layout/navbar/NavBar";
import Sidebar from "@/components/layout/Sidebar";
import StockContext from "@/contexts/Stock";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  const t = useTranslations("sideBar");
  const sidebarT = {
    stock: t("stock"),
    pos: t("pos"),
    lowStock: t("lowStock"),
    lowRotation: t("lowRotation"),
    orders: t("orders"),
    sales: t("sales"),
    settings: t("settings"),
    wallet: t("wallet"),
    logout: t("logout"),
  };
  return (
    <MainContainer>
      <StockContext>
        <section className=" h-[100vh] overflow-y-hidden grid grid-cols-12">
          <aside className="z-50 col-span-1 min-h-dvh">
            <Sidebar t={sidebarT} />
          </aside>
          <aside className="col-span-11  p-2">
            <NavBar />
            {children}
          </aside>
        </section>
      </StockContext>
    </MainContainer>
  );
};

export default layout;
