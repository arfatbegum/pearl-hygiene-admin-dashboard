import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductTable from "@/components/Tables/ProductTable";

export const metadata: Metadata = {
  title: "Product Table | Pearl Hygiene -  Dashboard",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products" />
      <div className="flex flex-col gap-10">
        <ProductTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
