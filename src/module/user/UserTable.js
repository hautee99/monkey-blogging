import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(results);
    });
  }, []);
  const renderRoleLabel = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Mod";
      case userRole.USER:
        return "User";
      default:
        break;
    }
  };
  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="success">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="success">Reject</LabelStatus>;

      default:
        break;
    }
  };
  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        await deleteUser(user);
        toast.success("Delete user successfully");
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const renderUserItem = (user) => {
    return (
      <tr key={user.id}>
        <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
        <td className="whitespace-nowrap">
          <div className="flex items-center gap-x-3">
            <img
              src={user?.avatar}
              alt=""
              className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
            ></img>
            <div className="flex-1">
              <h3>{user?.fullname}</h3>
              <time className="text-sm text-gray-300">
                {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString(
                  "vi-VN"
                )}
              </time>
            </div>
          </div>
        </td>
        <td>{user?.username}</td>
        <td>{user?.email}</td>
        <td>{renderLabelStatus(Number(user?.status))}</td>
        <td>{renderRoleLabel(Number(user?.role))}</td>
        <td>
          <div className="flex gap-5 text-gray-400">
            <ActionEdit
              onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
            ></ActionEdit>
            <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserItem(user))}
          {/* {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
                      alt=""
                      className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                    ></img>
                    <div className="flex-1">
                      <h3>{user?.fullname}</h3>
                      <time className="text-sm text-gray-300">
                        {new Date(
                          user?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VN")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user?.username}</td>
                <td>{user?.email}</td>
                <td>{renderLabelStatus(Number(user?.status))}</td>
                <td>{renderRoleLabel(Number(user?.role))}</td>
                <td>
                  <div className="flex gap-5 text-gray-400">
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                    //   onClick={() => handleDeleteCategory(category.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))} */}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
