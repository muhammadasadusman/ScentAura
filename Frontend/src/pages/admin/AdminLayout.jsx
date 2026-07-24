import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

  return (

    <div className="flex min-h-screen overflow-x-hidden">

      <AdminSidebar />

      <main className="flex-1 min-w-0 bg-gray-100 min-h-screen p-3 sm:p-5 md:p-6">

        <Outlet />

      </main>

    </div>

  );

};

export default AdminLayout;