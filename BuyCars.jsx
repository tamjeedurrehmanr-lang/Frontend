import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { getListings } from "./Service/api";

export default function BuyCars() {
  const optionalPrice = z.preprocess(
    (value) => value === "" || value === undefined ? undefined : Number(value),
    z.number({ invalid_type_error: "Enter a valid price." }).finite().min(0, "Price cannot be negative.").max(1_000_000_000_000, "Price cannot exceed Rs. 1,000,000,000,000.").optional()
  );
  const searchSchema = z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    city: z.string().optional(),
    min_price: optionalPrice,
    max_price: optionalPrice,
  }).refine(
    ({ min_price, max_price }) => min_price === undefined || max_price === undefined || max_price >= min_price,
    { message: "Maximum price must be greater than or equal to minimum price.", path: ["max_price"] }
  );
  const [searchMessage, setSearchMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(searchSchema) });

  async function searchListings(filters) {
    setSearchMessage("");
    const response = await getListings();
    const matches = response.data.listings.filter((listing) =>
      (!filters.brand || listing.brand === filters.brand) &&
      (!filters.model || listing.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.city || listing.city === filters.city) &&
      (filters.min_price === undefined || listing.price >= filters.min_price) &&
      (filters.max_price === undefined || listing.price <= filters.max_price)
    );
    setSearchMessage(`${matches.length} matching listing${matches.length === 1 ? "" : "s"} found.`);
  }

  return (
    <>
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Buy Cars</h1>
          <p>Search new and used cars near you.</p>
        </div>
      </header>

      <main className="buy-cars-page">
        <section className="buy-cars-search">
          <h2>Search Cars</h2>
          <form noValidate onSubmit={handleSubmit(searchListings)}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label" htmlFor="search-brand">Brand</label>
              <select className="form-select" id="search-brand" defaultValue="" {...register("brand")}>
                <option value="">Any Brand</option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>Suzuki</option>
                <option>Kia</option>
                <option>BMW</option>
                <option>Hyundai</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-model">Model</label>
              <input className="form-control" id="search-model" type="text" maxLength={50} placeholder="e.g. Civic" {...register("model")} />
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-city">City</label>
              <select className="form-select" id="search-city" defaultValue="" {...register("city")}>
                <option value="">Any City</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Peshawar</option>
                <option>Lahore</option>
                <option>Karachi</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-car-type">Car Type</label>
              <select className="form-select" id="search-car-type" name="car_type" defaultValue="">
                <option value="">Any Type</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Hatchback</option>
                <option>Coupe</option>
                <option>Truck</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-min-price">Min Price (Rs.)</label>
              <input className="form-control" id="search-min-price" type="number" min="0" max="1000000000000" {...register("min_price")} />
              {errors.min_price && <p className="text-danger small mb-0" role="alert">{errors.min_price.message}</p>}
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-max-price">Max Price (Rs.)</label>
              <input className="form-control" id="search-max-price" type="number" min="0" max="1000000000000" {...register("max_price")} />
              {errors.max_price && <p className="text-danger small mb-0" role="alert">{errors.max_price.message}</p>}
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-fuel">Fuel Type</label>
              <select className="form-select" id="search-fuel" name="fuel_type" defaultValue="">
                <option value="">Any Fuel</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="search-transmission">Transmission</label>
              <select className="form-select" id="search-transmission" name="transmission" defaultValue="">
                <option value="">Any</option>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            <div className="col-12">
              <button className="buy-cars-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Searching..." : "Search Cars"}</button>
            </div>
          </div>
          </form>
          {searchMessage && <p className="alert alert-info mt-3 mb-0" role="status">{searchMessage}</p>}
        </section>

        <section className="buy-cars-results">
          <h2>Search Results</h2>
          <div className="row g-4">
          <div className="col-sm-6 col-lg-3">
            <article className="card h-100">
            <img
                  src="1.jpg"
                  className="card-img-top"
                  alt="Toyota Camry"
                />
              <div className="card-body">
                <h3 className="card-title">Toyota Camry</h3>
                <p className="card-text text-muted">2020 · Automatic · Petrol</p>
                <p className="buy-cars-price">Rs. 11,200,000</p>
                <Link to="/cardetails/toyota-camry" className="buy-cars-submit d-block text-center text-decoration-none">View Details</Link>
              </div>
            </article>
          </div>

          <div className="col-sm-6 col-lg-3">
            <article className="card h-100">
     <img
                  src="4.png"
                  className="card-img-top"
                  alt="Honda Civic"
                />
              <div className="card-body">
                <h3 className="card-title">Honda Civic</h3>
                <p className="card-text text-muted">2024 · Automatic · Petrol</p>
                <p className="buy-cars-price">Rs. 5,800,000</p>
                <Link to="/cardetails/honda-civic" className="buy-cars-submit d-block text-center text-decoration-none">View Details</Link>
              </div>
            </article>
          </div>

          <div className="col-sm-6 col-lg-3">
            <article className="card h-100">
         <img
                  src="5.png"
                  className="card-img-top"
                  alt="BMW 3 Series"
                />
              <div className="card-body">
                <h3 className="card-title">BMW 3 Series</h3>
                <p className="card-text text-muted">2020 · Automatic · Petrol</p>
                <p className="buy-cars-price">Rs. 12,500,000</p>
                <Link to="/cardetails/bmw-3-series" className="buy-cars-submit d-block text-center text-decoration-none">View Details</Link>
              </div>
            </article>
          </div>

          <div className="col-sm-6 col-lg-3">
            <article className="card h-100">
               <img
                  src="6.png"
                  className="card-img-top"
                  alt="Audi"
                />
              <div className="card-body">
                <h3 className="card-title">Audi</h3>
                <p className="card-text text-muted">2023 · Automatic · Petrol</p>
                <p className="buy-cars-price">Rs. 11,800,000</p>
                <Link to="/cardetails/audi" className="buy-cars-submit d-block text-center text-decoration-none">View Details</Link>
              </div>
            </article>
          </div>
          </div>
        </section>

        <footer>Buy, sell and compare cars easily.</footer>
      </main>
    </>
  );
}
