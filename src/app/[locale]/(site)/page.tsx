"use server";
import Table from "@/components/layout/tables/stock";
import AddProductBtn from "@/components/layout/tables/stock/AddProductBtn";
import ImportStockButton from "@/components/layout/tables/stock/ImportStockButton";
import { TabsContent } from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { getCurrentStuff } from "@/app/lib/current";
import { ArticleType, StockCategoryType } from "~/types";
import TabsContainer from "@/components/layout/tables/stock/TabsContainer";
import StockContext from "@/contexts/Stock";
import React from "react";
import getArticles from "@/lib/simon/requests/getArticles";
import Fuse from "fuse.js";
// the funtion for the dealay in loading
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProductInformationsT = (pT: typeof useTranslations) => {
  return {
    generalInfo: {
      title: pT("generalInfo.title"),
      afterMarketRef: pT("generalInfo.afterMarketRef"),
      name: pT("generalInfo.name"),
      Qnt: pT("generalInfo.Qnt"),
      location: pT("generalInfo.location"),
    },
    tecDocInformation: {
      title: pT("tecDocInformation.title"),
      OEM: pT("tecDocInformation.OEM"),
      technicalName: pT("tecDocInformation.technicalName"),
      category: pT("tecDocInformation.category"),
    },
    prices: {
      title: pT("prices.title"),
      retailPrice: pT("prices.retailPrice"),
      addPrice: pT("prices.addPrice"),
    },
  };
};

const TEST_FAIL_FLAG = false;

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").toLowerCase();

  if (TEST_FAIL_FLAG) {
    const randomCodes = Array.from({ length: 13 }, () => {
      const codeNum = Math.floor(Math.random() * 90000) + 10000;
      return `ERR_${codeNum}`;
    });
    const shuffledCodes = randomCodes.sort(() => 0.5 - Math.random());
    const errorCodesList = shuffledCodes.slice(0, 9);

    return (
      <div className="fixed text-red-400 z-50 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-lg max-w-lg text-center">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <p className="text-lg mb-2">9 out of 13 tests failed</p>
          <p className="text-lg mb-4 text-green-400">4 succeeded</p>
          <ul className="list-disc text-left mx-auto w-fit">
            {errorCodesList.map((code, index) => (
              <li key={index} className="ml-4">
                {`Test ${index + 1} failed with error code: ${code}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const t = await getTranslations("stockPage");
  const pT = await getTranslations("productInformations");
  const categories: StockCategoryType[] = [
    "all",
    "parts",
    "bodies",
    "glazes",
    "tires",
  ];
  const currentStuff = await getCurrentStuff();

  const data = await getArticles(currentStuff?.store?.id as string);
  await sleep(2000);

  const fuseOptions = {
    keys: ["org_designation", "ref"],
    threshold: 0.3,
  };

  const fuseSearch = (articles: ArticleType[] = []) => {
    if (!q) return articles;
    const fuse = new Fuse(articles, fuseOptions);
    return fuse.search(q).map((result) => result.item);
  };

  const tires = fuseSearch(data?.tires);
  const glazes = fuseSearch(data?.glazes);
  const bodies = fuseSearch(data?.bodies);
  const parts = fuseSearch(data?.parts);

  const allArticles: ArticleType[] = [...tires, ...glazes, ...bodies, ...parts];

  return (
    <StockContext initialStock={allArticles}>
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex self-end w-[20%] mr-[10%] flex-col gap-2">
          {/* <ImportStockButton title={t('importStock')} /> */}
          <AddProductBtn />
        </div>
        <div className="w-full">
          <TabsContainer categories={categories}>
            <TabsContent value={categories[0]}>
              <Table
                data={allArticles}
                headTitles={[
                  { text: t("tableHeadTitles.designation"), width: 4 },
                  { text: t("tableHeadTitles.ref"), width: 2 },
                  { text: t("tableHeadTitles.brand"), width: 2 },
                  { text: t("tableHeadTitles.carModels"), width: 2 },
                  { text: t("tableHeadTitles.sellingPrice"), width: 1 },
                  { text: t("tableHeadTitles.quantity"), width: 1 },
                ]}
              />
            </TabsContent>
            <TabsContent value={categories[1]}>
              <Table
                headTitles={[
                  { text: t("tableHeadTitles.designation"), width: 4 },
                  { text: t("tableHeadTitles.ref"), width: 2 },
                  { text: t("tableHeadTitles.brand"), width: 2 },
                  { text: t("tableHeadTitles.carModels"), width: 2 },
                  { text: t("tableHeadTitles.sellingPrice"), width: 1 },
                  { text: t("tableHeadTitles.quantity"), width: 1 },
                ]}
                data={data?.parts}
                t={{
                  moreOptions: {
                    edit: t("moreOptions.edit"),
                    seeDetails: t("moreOptions.seeDetails"),
                    delete: t("moreOptions.delete"),
                  },
                }}
              />
            </TabsContent>
            <TabsContent value={categories[2]}>
              <Table
                headTitles={[
                  { text: t("tableHeadTitles.designation"), width: 4 },
                  { text: t("tableHeadTitles.ref"), width: 2 },
                  { text: t("tableHeadTitles.brand"), width: 2 },
                  { text: t("tableHeadTitles.carModels"), width: 2 },
                  { text: t("tableHeadTitles.sellingPrice"), width: 1 },
                  { text: t("tableHeadTitles.quantity"), width: 1 },
                ]}
                data={data?.bodies}
              />
            </TabsContent>
            <TabsContent value={categories[3]}>
              <Table
                data={data?.glazes}
                headTitles={[
                  { text: t("tableHeadTitles.designation"), width: 4 },
                  { text: t("tableHeadTitles.ref"), width: 2 },
                  { text: t("tableHeadTitles.brand"), width: 2 },
                  { text: t("tableHeadTitles.carModels"), width: 2 },
                  { text: t("tableHeadTitles.sellingPrice"), width: 1 },
                  { text: t("tableHeadTitles.quantity"), width: 1 },
                ]}
                t={{
                  moreOptions: {
                    edit: t("moreOptions.edit"),
                    seeDetails: t("moreOptions.seeDetails"),
                    delete: t("moreOptions.delete"),
                  },
                }}
              />
            </TabsContent>
          </TabsContainer>
          <Table
            data={data?.tires}
            headTitles={[
              { text: t("tableHeadTitles.designation"), width: 4 },
              { text: t("tableHeadTitles.ref"), width: 2 },
              { text: t("tableHeadTitles.brand"), width: 2 },
              { text: t("tableHeadTitles.carModels"), width: 2 },
              { text: t("tableHeadTitles.sellingPrice"), width: 1 },
              { text: t("tableHeadTitles.quantity"), width: 1 },
            ]}
          />
        </div>
      </div>
    </StockContext>
  );
}
