import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AddUserPage from "../components/user/AddUserPage";
import { createUser } from "../services/user";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function AddUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateUser = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createUser(formData);

      showSuccess(successMessages.userAdded || "User added successfully");
      navigate("/users");
    } catch (err) {
      console.error("Failed to create user", err);

      const message = getApiErrorMessage(err, "Failed to add user");
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {error ? (
        <div className="alert alert-danger rounded-4 mb-4">{error}</div>
      ) : null}

      <AddUserPage
        loading={loading}
        onSubmit={handleCreateUser}
        onBack={() => navigate("/users")}
      />
    </AdminLayout>
  );
}
