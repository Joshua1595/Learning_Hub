import api from "./api";

// Get admin dashboard statistics
export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get all users
export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(
    `/admin/users/${userId}/role`,
    { role }
  );

  return response.data;
};