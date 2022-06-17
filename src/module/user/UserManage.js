import { Button } from "components/button";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { userRole } from "utils/constants";
import UserTable from "./UserTable";

const UserManage = () => {
  const { userInfo } = useAuth();
  if (Number(userInfo.role) !== userRole.ADMIN) return;
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <Button kind="ghost" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
