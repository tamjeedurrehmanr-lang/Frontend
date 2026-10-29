import { useState } from "react";
import { Link } from "react-router-dom";
import { getListings } from "./Service/api";

function Home() {
  const [searchMessage, setSearchMessage] = useState("");

  async function search(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await getListings();
    const term = data.query?.trim().toLowerCase();
    const matches = response.data.listings.filter((listing) =>
      (!data.city || listing.city === data.city) &&
      (!term || `${listing.brand} ${listing.model}`.toLowerCase().includes(term))
    );
    setSearchMessage(`${matches.length} matching listing${matches.length === 1 ? "" : "s"} found.`);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Car<span className="accent">Hub</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/buycar">Buy Cars</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sellyourcar">Sell Your Car</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  More
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/makeoffer">Make an Offer</Link></li>
                  <li><Link className="dropdown-item" to="/reportad">Report an Ad</Link></li>
                  <li><Link className="dropdown-item" to="/editcarlisting">Edit Car Listing</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/adminlogin">Login</Link></li>
                  <li><Link className="dropdown-item" to="/register">Register</Link></li>
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="btn btn-orange ms-lg-2" to="/admindashboard">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <h1>
                  Cars for sale in <span className="accent">Pakistan</span>
                </h1>
                <p className="lead mb-4">
                  Buy, sell and compare new and used cars in one place.
                </p>

                <form className="bg-white p-3" onSubmit={search}>
                  <div className="row g-2">
                    <div className="col-md-5">
                      <label className="visually-hidden" htmlFor="home-search">Brand or model</label>
                      <input
                        id="home-search"
                        name="query"
                        type="text"
                        className="form-control"
                        maxLength={50}
                        placeholder="Brand or model"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="visually-hidden" htmlFor="home-city">City</label>
                      <select className="form-select" id="home-city" name="city" defaultValue="">
                        <option value="">All Cities</option>
                        <option>Islamabad</option>
                        <option>Rawalpindi</option>
                        <option>Peshawar</option>
                        <option>Lahore</option>
                        <option>Karachi</option>
                      </select>
                    </div>
                    <div className="col-md-3 d-grid">
                      <Link className="btn btn-orange" to="/buycar">Search</Link>
                    </div>
                    <div className="col-12 mt-3">
                      
                    </div>
                  </div>
                  {searchMessage && <p className="mt-3 mb-0 small" role="status">{searchMessage}</p>}
                </form>
              </div>

              <div className="col-lg-6">
                <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src="/1.jpg" className="d-block w-100" alt="Toyota Camry" />
                    </div>
                    <div className="carousel-item">
                      <img src="/2.png" className="d-block w-100" alt="Featured car" />
                    </div>
                    <div className="carousel-item">
                      <img src="/3.png" className="d-block w-100" alt="Featured car" />
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" aria-label="Previous image">
                    <span className="carousel-control-prev-icon" />
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" aria-label="Next image">
                    <span className="carousel-control-next-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5" id="buy-sell">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="buy-box">
                  <h2>Buy a Car</h2>
                  <p>Browse new and used cars from sellers in your city.</p>
                  <Link className="btn btn-orange" to="/buycar">Browse Cars</Link>
                </div>
              </div>
              <div className="col-md-6">
                <div className="sell-box">
                  <h2>Sell Your Car</h2>
                  <p>Post a free ad and get calls from real buyers.</p>
                  <Link className="btn btn-orange" to="/sellyourcar">Post an Ad</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-5">
          <div className="container">
            <h2 className="section-title">Popular Brands</h2>
            <div className="row g-3">
              {["Toyota", "Honda", "Suzuki", "Kia", "BMW", "Hyundai"].map((brand) => (
                <div className="col-6 col-md-2" key={brand}>
                  <Link to="/buycar" className="brand">{brand}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-5">
          <div className="container">
            <h2 className="section-title">Browse by Body Type</h2>
            <div className="row g-3">
              {[
                ["Sedan", "1,240 cars"],
                ["SUV", "860 cars"],
                ["Hatchback", "1,015 cars"],
                ["Coupe", "95 cars"],
                ["Truck", "140 cars"],
              ].map(([type, count]) => (
                <div className="col-6 col-md" key={type}>
                  <Link to="/buycar" className="category">
                    <h5>{type}</h5>
                    <small>{count}</small>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-5" id="featured">
          <div className="container">
            <h2 className="section-title">Featured Cars</h2>
            <div className="row g-4">
              <div className="col-sm-6 col-lg-3">
                <article className="card h-100">
                  <img src="/1.jpg" className="card-img-top" alt="Toyota Camry" />
                  <div className="card-body">
                    <h3 className="card-title h5">Toyota Camry</h3>
                    <p className="card-text text-muted">2020 · Automatic · Petrol</p>
                    <p className="price">Rs. 11,200,000</p>
                    <Link className="btn btn-orange w-100" to="/cardetails/toyota-camry">View Details</Link>
                  </div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="card h-100">
                  <img src="/4.png" className="card-img-top" alt="Honda Civic" />
                  <div className="card-body">
                    <h3 className="card-title h5">Honda Civic</h3>
                    <p className="card-text text-muted">2024 · Automatic · Petrol</p>
                    <p className="price">Rs. 5,800,000</p>
                    <Link className="btn btn-orange w-100" to="/cardetails/honda-civic">View Details</Link>
                  </div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="card h-100">
                  <img src="/5.png" className="card-img-top" alt="BMW 3 Series" />
                  <div className="card-body">
                    <h3 className="card-title h5">BMW 3 Series</h3>
                    <p className="card-text text-muted">2020 · Automatic · Petrol</p>
                    <p className="price">Rs. 12,500,000</p>
                    <Link className="btn btn-orange w-100" to="/cardetails/bmw-3-series">View Details</Link>
                  </div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="card h-100">
                  <img src="/6.png" className="card-img-top" alt="Audi" />
                  <div className="card-body">
                    <h3 className="card-title h5">Audi</h3>
                    <p className="card-text text-muted">2023 · Automatic · Petrol</p>
                    <p className="price">Rs. 11,800,000</p>
                    <Link className="btn btn-orange w-100" to="/cardetails/audi">View Details</Link>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-5">
              <h2 className="h4 text-white">Car<span className="accent">Hub</span></h2>
              <p>Buy, sell and compare cars easily.</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="h6 text-white">Links</h3>
              <p className="mb-2"><Link to="/buycar">Buy Cars</Link></p>
              <p className="mb-2"><Link to="/sellyourcar">Sell Your Car</Link></p>
              <p className="mb-2"><Link to="/about">About</Link></p>
            </div>
          </div>
          <hr />
          <p className="text-center small mb-0">© 2026 CarHub. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
