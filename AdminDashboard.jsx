import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createListing, deleteListing, getListing, getListings, updateListing } from "./Service/api";

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");
  const [editingListing, setEditingListing] = useState(null);

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

  async function create(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    await createListing({ ...data, seller_name: "Admin", phone: "03000000000", email: "admin@carhub.com", mileage: 0, condition: "Used - Good", description: "Created from admin dashboard.", city: data.city || "Islamabad" });
    form.reset();
    setMessage("Listing created successfully.");
    await refreshListings();
  }

  async function search(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = data.listing_id ? await getListing(data.listing_id) : await getListings();
    const found = data.listing_id ? [response.data.listing] : response.data.listings;
    setListings(found.filter((item) => data.status === "All" || item.status === data.status));
  }

  async function update(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const id = data.listing_id;
    const changes = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "listing_id" && value));
    await updateListing(id, changes);
    form.reset();
    setMessage("Listing updated successfully.");
    await refreshListings();
  }

  async function remove(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    await deleteListing(data.listing_id);
    form.reset();
    setMessage("Listing deleted successfully.");
    await refreshListings();
  }

  async function saveListing(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const { listing_id, ...changes } = data;
    await updateListing(listing_id, {
      ...changes,
      year: Number(changes.year),
      price: Number(changes.price),
    });
    setEditingListing(null);
    setMessage("Listing updated successfully.");
    await refreshListings();
  }

  async function deleteListingRow(id) {
    await deleteListing(id);
    setListings((current) => current.filter((listing) => String(listing.id) !== String(id)));
    setMessage("Listing deleted successfully.");
  }

  return (
    <main className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <p className="mb-1">CarHub Administration</p>
            <h1>Admin Dashboard</h1>
            <p className="mb-0">Manage marketplace listings using the forms below.</p>
          </div>
          <Link className="btn btn-outline-light" to="/">Logout</Link>
        </div>
      </header>

      <div className="container-fluid admin-dashboard-layout py-4">
        <input className="admin-dashboard-tab" type="radio" name="dashboard-tab" id="dashboard-overview" defaultChecked />
        <input className="admin-dashboard-tab" type="radio" name="dashboard-tab" id="dashboard-create" />
        <input className="admin-dashboard-tab" type="radio" name="dashboard-tab" id="dashboard-view" />
        <input className="admin-dashboard-tab" type="radio" name="dashboard-tab" id="dashboard-update" />
        <input className="admin-dashboard-tab" type="radio" name="dashboard-tab" id="dashboard-delete" />

        <aside className="admin-dashboard-sidebar" aria-label="Dashboard sections">
          <h2>Dashboard Menu</h2>
          <nav>
            <label htmlFor="dashboard-overview">Overview</label>
            <label htmlFor="dashboard-create">Create Listing</label>
            <label htmlFor="dashboard-view">View Listings</label>
            <label htmlFor="dashboard-update">Update Listing</label>
            <label htmlFor="dashboard-delete">Delete Listing</label>
          </nav>
        </aside>

        <div className="admin-dashboard-content">
          {message && <p className="alert alert-info mb-3" role="status">{message}</p>}
          <section className="admin-dashboard-panel" id="overview-panel">
            <h2>Overview</h2>
            <div className="admin-dashboard-stats">
              <article className="admin-dashboard-stat">
                <h3>Total listings</h3>
                <p>128</p>
              </article>
              <article className="admin-dashboard-stat">
                <h3>Pending review</h3>
                <p>14</p>
              </article>
              <article className="admin-dashboard-stat">
                <h3>Active listings</h3>
                <p>102</p>
              </article>
            </div>
            <p className="admin-dashboard-note mt-4 mb-0">
              Listing changes are saved through the CarHub API.
            </p>
          </section>

          <section className="admin-dashboard-panel admin-dashboard-card" id="create-panel">
            <h2>Create Listing</h2>
            <form onSubmit={create}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-create-brand">Brand</label>
                  <input className="form-control" id="admin-create-brand" name="brand" type="text" maxLength={50} placeholder="e.g. Toyota" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-create-model">Model</label>
                  <input className="form-control" id="admin-create-model" name="model" type="text" maxLength={50} placeholder="e.g. Corolla" />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-create-year">Year</label>
                  <input className="form-control" id="admin-create-year" name="year" type="number" min="1900" max="2100" />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-create-price">Price (Rs.)</label>
                  <input className="form-control" id="admin-create-price" name="price" type="number" min="0" max="1000000000000" />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="admin-create-status">Status</label>
                  <select className="form-select" id="admin-create-status" name="status" defaultValue="Pending">
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="col-12">
                  <button className="btn btn-orange" type="submit">Create Listing</button>
                </div>
              </div>
            </form>
          </section>

          <section className="admin-dashboard-panel" id="view-panel">
            <div className="admin-dashboard-card mb-4">
              <h2>View Listings</h2>
              <form onSubmit={search}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label" htmlFor="admin-search-id">Listing ID</label>
                    <input className="form-control" id="admin-search-id" name="listing_id" type="number" min="1" max="999999999" />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label" htmlFor="admin-search-status">Status</label>
                    <select className="form-select" id="admin-search-status" name="status" defaultValue="All">
                      <option>All</option>
                      <option>Pending</option>
                      <option>Active</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-2 d-grid">
                    <button className="btn btn-orange" type="submit">Search</button>
                  </div>
                </div>
              </form>
            </div>

            <section className="admin-dashboard-card">
              <h2>Current Listings</h2>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col">Year</th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id}>
                        {editingListing === String(listing.id) ? (
                          <td colSpan="6">
                            <form className="row g-2 align-items-end" onSubmit={saveListing}>
                              <input type="hidden" name="listing_id" value={listing.id} />
                              <div className="col"><label className="form-label">Brand<input className="form-control" name="brand" defaultValue={listing.brand} required /></label></div>
                              <div className="col"><label className="form-label">Model<input className="form-control" name="model" defaultValue={listing.model} required /></label></div>
                              <div className="col"><label className="form-label">Year<input className="form-control" name="year" type="number" defaultValue={listing.year} required /></label></div>
                              <div className="col"><label className="form-label">Price<input className="form-control" name="price" type="number" defaultValue={listing.price} required /></label></div>
                              <div className="col"><label className="form-label">Status<select className="form-select" name="status" defaultValue={listing.status}><option>Pending</option><option>Active</option><option>Rejected</option></select></label></div>
                              <div className="col-auto">
                                <button className="btn btn-orange me-2" type="submit">Save</button>
                                <button className="btn btn-outline-secondary" type="button" onClick={() => setEditingListing(null)}>Cancel</button>
                              </div>
                            </form>
                          </td>
                        ) : (
                          <>
                            <td>{listing.id}</td>
                            <td>{listing.brand} {listing.model}</td>
                            <td>{listing.year}</td>
                            <td>Rs. {Number(listing.price).toLocaleString()}</td>
                            <td>{listing.status}</td>
                            <td className="text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => setEditingListing(String(listing.id))}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteListingRow(listing.id)}>Delete</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {listings.length === 0 && <tr><td colSpan="6" className="text-center">No listings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <section className="admin-dashboard-panel admin-dashboard-card" id="update-panel">
            <h2>Update Listing</h2>
            <form onSubmit={update}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-update-id">Listing ID</label>
                  <input className="form-control" id="admin-update-id" name="listing_id" type="number" min="1" max="999999999" placeholder="e.g. 101" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-update-status">Status</label>
                  <select className="form-select" id="admin-update-status" name="status" defaultValue="">
                    <option value="">Select status</option>
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-update-price">New Price (Rs.)</label>
                  <input className="form-control" id="admin-update-price" name="price" type="number" min="0" max="1000000000000" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="admin-update-city">City</label>
                  <input className="form-control" id="admin-update-city" name="city" type="text" maxLength={50} />
                </div>
                <div className="col-12">
                  <button className="btn btn-orange" type="submit">Save Listing Changes</button>
                </div>
              </div>
            </form>
          </section>

          <section className="admin-dashboard-panel admin-dashboard-card" id="delete-panel">
            <h2>Delete Listing</h2>
            <form onSubmit={remove}>
              <div className="mb-3">
                <label className="form-label" htmlFor="admin-delete-id">Listing ID</label>
                <input className="form-control" id="admin-delete-id" name="listing_id" type="number" min="1" max="999999999" />
              </div>
              <button className="btn btn-outline-danger" type="submit">Delete Listing</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
