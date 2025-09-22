"use client";
import React, { FC, useMemo } from "react";
import Fuse from "fuse.js";
import TableLayout from "../components/TableLayout";
import Row from "./Row";
import { ArticleType } from "~/types";
import { useStockContext } from "@/contexts/Stock";
import { useTranslations } from "next-intl";
import useCart from "@/hooks/useCart";
import { useSearchParams } from "next/navigation";

interface TableProps {
  addToCartText: string;
  data: ArticleType[];
}

const Table: FC<TableProps> = ({ addToCartText, data }) => {
  const { currentStock } = useStockContext();
  const t = useTranslations("stockPage");
  const { addToCart, clearCart } = useCart();
  const [state, setState] = React.useState("");

  // Get search query from the URL
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";

  // Use Fuse.js to filter data by "ref"
  const filteredData = useMemo(() => {
    if (!q) return data;
    const fuseOptions = {
      keys: ["org_designation", "ref"],
      threshold: 0.3,
    };
    const fuse = new Fuse(data, fuseOptions);
    return fuse.search(q).map((result) => result.item);
  }, [data, q]);

  React.useEffect(() => {
    if (state) {
      clearCart();
    }
    console.log("state", state);
  }, [state]);

  return (
    <TableLayout
      titles={[
        { text: t("tableHeadTitles.designation"), width: 4 },
        { text: t("tableHeadTitles.ref"), width: 2 },
        { text: t("tableHeadTitles.brand"), width: 2 },
        { text: t("tableHeadTitles.carModels"), width: 2 },
        { text: t("tableHeadTitles.sellingPrice"), width: 1 },
        { text: t("tableHeadTitles.quantity"), width: 1 },
      ]}
    >
      {filteredData.map((row: any) => (
        <Row
          key={row?.id}
          state={state}
          setState={setState}
          addToCart={addToCartText}
          data={row}
        />
      ))}
    </TableLayout>
  );
};

export default Table;
