"use client";
import { FC } from "react";
import TableLayout from "../components/TableLayout";
import TableHead from "../components/TableHead";
import Row from "./Row";
import { TableProps } from "~/types";
import { useTranslations } from "next-intl";

const Table: FC<TableProps> = ({ headTitles, data }) => {
  const t = useTranslations("stockPage");

  if (!data) {
    return (
      <div className="relative">
        <TableHead titles={headTitles} />
      </div>
    );
  }

  return (
    <TableLayout titles={headTitles}>
      {Boolean(data?.length) &&
        data.map((row) => (
          <Row
            data={row}
            key={row.id}
            options={{
              edit: t("moreOptions.edit"),
              seeDetails: t("moreOptions.seeDetails"),
              delete: t("moreOptions.delete"),
            }}
            headers={{
              designation: t("addProduct.designation"),
              ref: t("addProduct.ref"),
              brand: t("addProduct.brand"),
              carModels: t("addProduct.carModels"),
              sellingPrice: t("addProduct.sellingPrice"),
              quantity: t("addProduct.quantity"),
            }}
          />
        ))}
    </TableLayout>
  );
};

export default Table;
