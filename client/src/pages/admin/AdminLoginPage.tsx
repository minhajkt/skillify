import { Box } from "@mui/material";
import Navbar from "../../components/shared/Navbar";
import AdminLogin from "../../components/admin/AdminLogin";

const AdminLoginPage = () => {
  return (
    <Box>
      <Navbar />
      <AdminLogin />
    </Box>
  );
};

export default AdminLoginPage;
