import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createListing, deleteListing, getListings, updateListing } from "./Service/api";

export default function CarHubSellerRecords() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");

  async function refreshListings() {
    const response = await getListings();
    setListings(response.data.listings);
  }

  useEffect(() => {
    async function loadListings() {
      const response = await getListings();
      setListings(response.data.listings);
    }

    loadListings();
  }, []);

  async function addCar(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    await createListing({ ...data, brand: data.model, seller_name: "Seller", phone: "03000000000", email: "seller@carhub.com", city: "Islamabad", mileage: 0, condition: "Used - Good", description: "Listed by seller." });
    event.currentTarget.reset();
    setMessage("Car added successfully.");
    await refreshListings();
  }

  async function viewListings(event) {
    event.preventDefault();
    const { status } = Object.fromEntries(new FormData(event.currentTarget));
    const response = await getListings();
    setListings(status === "all" ? response.data.listings : response.data.listings.filter((item) => item.status === status));
  }

  async function saveChanges(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const changes = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "id" && value));
    await updateListing(data.id, changes);
    event.currentTarget.reset();
    setMessage("Car details updated.");
    await refreshListings();
  }

  async function removeListing(event) {
    event.preventDefault();
    const { id } = Object.fromEntries(new FormData(event.currentTarget));
    await deleteListing(id);
    event.currentTarget.reset();
    setMessage("Listing deleted.");
    await refreshListings();
  }

  return (
    <div className="records-page" style={{ width: "100%" }}>
      <main>
        <p className="brand">Car<span className="accent">Hub</span></p>
        <h1>My car listings</h1>
        <p className="intro">Add, view, edit, and delete your car listings.</p>
        <Link to="/sellerlogin">Back to Seller login</Link>
        {message && <p className="alert alert-info mt-3" role="status">{message}</p>}

        <div className="record-grid">
          <section className="record-card">
            <h2>Add car</h2>
            <form onSubmit={addCar}>
              <label htmlFor="new-model">Car model</label>
              <input id="new-model" name="model" type="text" maxLength={50} required />

              <label htmlFor="new-year">Year</label>
              <input id="new-year" name="year" type="number" min="1900" max="2100" required />

              <label htmlFor="new-price">Price</label>
              <input id="new-price" name="price" type="number" min="0" max="1000000000000" step="1" required />

              <button type="submit">Add car</button>
            </form>
          </section>

          <section className="record-card">
            <h2>View listings</h2>
            <form onSubmit={viewListings}>
              <label htmlFor="view-status">Listing status</label>
              <select id="view-status" name="status" defaultValue="all">
                <option value="all">All listings</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active</option>
              </select>
              <button type="submit">View listings</button>
            </form>
          </section>

          <section className="record-card">
            <h2>Edit car details</h2>
            <form onSubmit={saveChanges}>
              <label htmlFor="edit-id">Car ID</label>
              <input id="edit-id" name="id" type="number" min="1" max="999999999" required />

              <label htmlFor="edit-model">Car model</label>
              <input id="edit-model" name="model" type="text" maxLength={50} />

              <label htmlFor="edit-year">Year</label>
              <input id="edit-year" name="year" type="number" min="1900" max="2100" />

              <label htmlFor="edit-price">Price</label>
              <input id="edit-price" name="price" type="number" min="0" max="1000000000000" step="1" />

              <label htmlFor="edit-status">Status</label>
              <select id="edit-status" name="status" defaultValue="">
                <option value="">Keep current status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active</option>
              </select>

              <button type="submit">Save changes</button>
            </form>
          </section>

          <section className="record-card">
            <h2>Delete car listing</h2>
            <form onSubmit={removeListing}>
              <label htmlFor="delete-id">Car ID</label>
              <input id="delete-id" name="id" type="number" min="1" max="999999999" required />
              <button type="submit">Delete listing</button>
            </form>
          </section>
        </div>

        <section className="record-card record-table">
          <h2>My listings</h2>
          <div className="record-list">
            <table>
              <thead>
                <tr><th>ID</th><th>Car model</th><th>Year</th><th>Price</th><th>Status</th></tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}><td>{listing.id}</td><td>{listing.brand} {listing.model}</td><td>{listing.year}</td><td>Rs. {Number(listing.price).toLocaleString()}</td><td>{listing.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
