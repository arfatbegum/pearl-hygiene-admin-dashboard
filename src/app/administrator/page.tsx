import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserTable from "@/components/Tables/UserTable";

export const metadata: Metadata = {
  title: "Administrator Table | Pearl Hygiene -  Dashboard",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Administrator" />
      <div className="flex flex-col gap-10 h-dvh">
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
