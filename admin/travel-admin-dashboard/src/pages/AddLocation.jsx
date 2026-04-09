import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AddLocationPage from "../components/location/AddLocationPage";
import { createLocation } from "../services/location";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function AddLocation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateLocation = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createLocation(formData);

      showSuccess(successMessages.locationAdded);
      navigate("/locations");
    } catch (err) {
      console.error("Failed to create location", err);

      const message = getApiErrorMessage(err, "Failed to add location");
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

      <AddLocationPage
        loading={loading}
        onSubmit={handleCreateLocation}
        onBack={() => navigate("/locations")}
      />
    </AdminLayout>
  );
}
