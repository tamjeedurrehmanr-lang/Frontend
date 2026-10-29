import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createListing } from "./Service/api";

export default function SellCarForm() {
  const sellCarSchema = z.object({
    seller_name: z.string().trim().min(1, "Enter your name.").max(25, "Name cannot exceed 25 characters."),
    phone: z.string().trim().min(7, "Enter a valid phone number.").max(15, "Phone number cannot exceed 15 characters."),
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    city: z.string().min(1, "Choose your city.").max(15, "City cannot exceed 50 characters."),
    brand: z.string().trim().min(1, "Enter the car brand.").max(15, "Car brand cannot exceed 15 characters."),
    model: z.string().trim().min(1, "Enter the car model.").max(15, "Car model cannot exceed 15 characters."),
    year: z.number({ invalid_type_error: "Enter a valid year." }).int().min(1990, "Year must be 1990 or later.").max(2026, "Year cannot be later than 2026."),
    price: z.number({ invalid_type_error: "Enter a valid price." }).positive("Price must be greater than 0.").max(1_000_000_000_000, "Price cannot exceed Rs. 1,000,000,000,000."),
    mileage: z.number({ invalid_type_error: "Enter a valid mileage." }).min(0, "Mileage cannot be negative.").max(2_000_000, "Mileage cannot exceed 2,000,000 km."),
    condition: z.string().min(1, "Choose the car condition."),
    description: z.string().trim().min(1, "Enter a description.").max(1000, "Description cannot exceed 1000 characters."),
    car_image: z.any().optional(),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(sellCarSchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    const listing = { ...data };
    delete listing.car_image;
    await createListing(listing);
    reset();
    setSubmitState({ status: "success", message: "Your car listing was posted." });
  }

  return (
    <>
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Sell Your Car</h1>
          <p>List your car and reach thousands of buyers.</p>
        </div>
      </header>

      <main className="sell-car-page">
        <section className="sell-car-card">
          <h2>Sell Your Car</h2>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="seller-name">Seller Name *</label>
              <input className="form-control" id="seller-name" type="text" maxLength={25} {...register("seller_name")} />
              {errors.seller_name && <p className="text-danger small mb-0" role="alert">{errors.seller_name.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="seller-phone">Phone *</label>
              <input className="form-control" id="seller-phone" type="tel" maxLength={15} placeholder="03xx-xxxxxxx" {...register("phone")} />
              {errors.phone && <p className="text-danger small mb-0" role="alert">{errors.phone.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="seller-email">Email *</label>
              <input className="form-control" id="seller-email" type="email" maxLength={25} {...register("email")} />
              {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="seller-city">City *</label>
              <select className="form-select" id="seller-city" defaultValue="" {...register("city")}>
                <option value="" disabled>Choose city...</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Peshawar</option>
                <option>Lahore</option>
                <option>Karachi</option>
              </select>
              {errors.city && <p className="text-danger small mb-0" role="alert">{errors.city.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-brand">Car Brand *</label>
              <input className="form-control" id="car-brand" type="text" maxLength={15} placeholder="e.g. Toyota" {...register("brand")} />
              {errors.brand && <p className="text-danger small mb-0" role="alert">{errors.brand.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-model">Car Model *</label>
              <input className="form-control" id="car-model" type="text" maxLength={15} placeholder="e.g. Corolla" {...register("model")} />
              {errors.model && <p className="text-danger small mb-0" role="alert">{errors.model.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-year">Year *</label>
              <input className="form-control" id="car-year" type="number" min="1990" max="2026" {...register("year", { valueAsNumber: true })} />
              {errors.year && <p className="text-danger small mb-0" role="alert">{errors.year.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-price">Price (Rs.) *</label>
              <input className="form-control" id="car-price" type="number" min="1" max="1000000000000" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-danger small mb-0" role="alert">{errors.price.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-mileage">Mileage (km) *</label>
              <input className="form-control" id="car-mileage" type="number" min="0" max="2000000" {...register("mileage", { valueAsNumber: true })} />
              {errors.mileage && <p className="text-danger small mb-0" role="alert">{errors.mileage.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="car-condition">Condition *</label>
              <select className="form-select" id="car-condition" defaultValue="" {...register("condition")}>
                <option value="" disabled>Choose condition...</option>
                <option>New</option>
                <option>Used - Excellent</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
              {errors.condition && <p className="text-danger small mb-0" role="alert">{errors.condition.message}</p>}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="car-description">Description *</label>
              <textarea
                className="form-control"
                id="car-description"
                rows="4"
                maxLength={1000}
                placeholder="Tell buyers more about the car..."
                {...register("description")}
              />
              {errors.description && <p className="text-danger small mb-0" role="alert">{errors.description.message}</p>}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="car-image">Car Image</label>
              <input className="form-control" id="car-image" type="file" accept="image/*" {...register("car_image")} />
            </div>

            <div className="col-12">
              <button className="sell-car-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post My Car"}</button>
            </div>
          </div>
          {submitState.message && (
            <p className={`alert ${submitState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
              {submitState.message}
            </p>
          )}
          </form>
        </section>

        <footer>Buy, sell and compare cars easily.</footer>
      </main>
    </>
  );
}
