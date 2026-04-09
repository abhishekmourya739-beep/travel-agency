import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AddHotelPage from "../components/hotel/AddHotelPage";
import { createHotel } from "../services/hotel";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function AddHotel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateHotel = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createHotel(formData);

      showSuccess(successMessages.hotelAdded || "Hotel added successfully");
      navigate("/hotels");
    } catch (err) {
      console.error("Failed to create hotel", err);

      const message = getApiErrorMessage(err, "Failed to add hotel");
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

      <AddHotelPage
        loading={loading}
        onSubmit={handleCreateHotel}
        onBack={() => navigate("/hotels")}
      />
    </AdminLayout>
  );
}
