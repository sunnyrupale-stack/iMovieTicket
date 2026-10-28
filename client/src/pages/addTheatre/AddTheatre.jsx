import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiTrash, BiBuilding } from "react-icons/bi";
import "./style.scss";

const AddTheatre = () => {
  const [formData, setFormData] = useState({
    theatreName: "",
    location: "",
    balconySeatPrice: 250,
    balconySeatCount: 30,
    middleSeatPrice: 180,
    middleSeatCount: 50,
    lowerSeatPrice: 120,
    lowerSeatCount: 40,
  });
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTheatres = async () => {
    try {
      setFetching(true);
      const res = await api.get("/api/theatre");
      if (res.data.success) {
        setTheatres(res.data.theatres || []);
      }
    } catch (err) {
      console.error("Error fetching theatres:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.theatreName || !formData.location) {
      toast.error("Please enter theatre name and location");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/theatre/addtheatre", formData);
      if (res.data.success) {
        toast.success("Theatre added successfully!");
        setFormData({
          theatreName: "",
          location: "",
          balconySeatPrice: 250,
          balconySeatCount: 30,
          middleSeatPrice: 180,
          middleSeatCount: 50,
          lowerSeatPrice: 120,
          lowerSeatCount: 40,
        });
        fetchTheatres();
      }
    } catch (err) {
      toast.error("Failed to add theatre");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete theatre ${name}?`)) return;

    try {
      const res = await api.delete(`/api/theatre/deletetheatre/${id}`);
      if (res.data.success) {
        toast.info("Theatre deleted successfully");
        setTheatres(theatres.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete theatre");
    }
  };

  return (
    <div className="add-theatre-page-container">
      <Header isAdminView={true} />

      <main className="add-theatre-main-content">
        <h1 className="brand-title">
          Add <span className="red">Theatre</span>
        </h1>

        {/* Form matching Screenshot 51 */}
        <div className="theatre-form-card">
          <form onSubmit={handleSubmit} className="theatre-form">
            <div className="form-group span-2">
              <label>Theatre Name</label>
              <input
                type="text"
                name="theatreName"
                placeholder="Enter theatre name"
                value={formData.theatreName}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group span-2">
              <label>Theatre Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter theatre location"
                value={formData.location}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Balcony Seat Price</label>
              <input
                type="number"
                name="balconySeatPrice"
                value={formData.balconySeatPrice}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Balcony Seat Count</label>
              <input
                type="number"
                name="balconySeatCount"
                value={formData.balconySeatCount}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Middle Seat Price</label>
              <input
                type="number"
                name="middleSeatPrice"
                value={formData.middleSeatPrice}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Middle Seat Count</label>
              <input
                type="number"
                name="middleSeatCount"
                value={formData.middleSeatCount}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Lower Seat Price</label>
              <input
                type="number"
                name="lowerSeatPrice"
                value={formData.lowerSeatPrice}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Lower Seat Count</label>
              <input
                type="number"
                name="lowerSeatCount"
                value={formData.lowerSeatCount}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-actions span-2">
              <button type="submit" className="btn-submit-theatre" disabled={loading}>
                {loading ? "Adding Theatre..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Theatres list */}
        <div className="existing-theatres-section">
          <h2 className="section-title">
            Registered <span className="red">Theatres</span> ({theatres.length})
          </h2>

          {fetching ? (
            <Loader />
          ) : (
            <div className="theatres-grid">
              {theatres.map((t) => (
                <div key={t._id} className="theatre-card">
                  <div className="card-top">
                    <h3>
                      <BiBuilding size={18} color="#e50914" /> {t.theatreName}
                    </h3>
                    <button
                      className="btn-trash"
                      onClick={() => handleDelete(t._id, t.theatreName)}
                      title="Delete Theatre"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                  <p className="theatre-location">{t.location}</p>
                  <div className="prices-summary">
                    <span>Balcony: ₹{t.balconySeatPrice}</span>
                    <span>Middle: ₹{t.middleSeatPrice}</span>
                    <span>Lower: ₹{t.lowerSeatPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddTheatre;
