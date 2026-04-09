import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AddPackagePage from "../components/package/AddPackagePage";
import { createPackage } from "../services/package";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function AddPackage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePackage = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createPackage(formData);

      showSuccess(successMessages.packageAdded);
      navigate("/packages");
    } catch (err) {
      console.error("Failed to create package", err);

      const message = getApiErrorMessage(err, "Failed to add package");
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

      <AddPackagePage
        loading={loading}
        onSubmit={handleCreatePackage}
        onBack={() => navigate("/packages")}
      />
    </AdminLayout>
  );
}
