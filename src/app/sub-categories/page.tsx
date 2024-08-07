import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SubCategoriesTable from "@/components/Tables/SubCategoryTable";

export const metadata: Metadata = {
  title: "Categories Table | Pearl Hygiene -  Dashboard",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />
      <div className="flex flex-col gap-10">
        <SubCategoriesTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
