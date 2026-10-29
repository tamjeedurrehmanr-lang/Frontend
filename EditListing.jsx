import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateListing, deleteListing } from "./Service/api";

export default function EditListing() {
  const editListingSchema = z.object({
    listing_id: z.coerce.number().int().positive("Enter a valid listing ID."),
    brand: z.string().trim().min(1, "Enter the car brand.").max(15, "Car brand cannot exceed 50 characters."),
    model: z.string().trim().min(1, "Enter the car model.").max(15, "Car model cannot exceed 50 characters."),
    year: z.number({ invalid_type_error: "Enter a valid year." }).int().min(1990, "Year must be 1990 or later.").max(2026, "Year cannot be later than 2026."),
    price: z.number({ invalid_type_error: "Enter a valid price." }).positive("Price must be greater than 0.").max(1_000_000_000_000, "Price cannot exceed Rs. 1,000,000,000,000."),
    mileage: z.number({ invalid_type_error: "Enter a valid mileage." }).min(0, "Mileage cannot be negative.").max(2_000_000, "Mileage cannot exceed 2,000,000 km."),
    condition: z.string().min(1, "Choose the car condition."),
    car_image: z.any().optional(),
    description: z.string().trim().min(1, "Enter a description.").max(1000, "Description cannot exceed 1000 characters."),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      listing_id: 101,
      brand: "Suzuki",
      model: "Dzire",
      year: 2024,
      price: 4100000,
      mileage: 8000,
      condition: "Used - Excellent",
      description: "Well maintained Suzuki Dzire, single owner, all documents clear.",
    },
  });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    const changes = { ...data };
    delete changes.listing_id;
    delete changes.car_image;
    await updateListing(data.listing_id, changes);
    setSubmitState({ status: "success", message: "Listing updated successfully." });
  }

  async function onDelete() {
    setSubmitState({ status: "idle", message: "" });
    const listingId = getValues("listing_id");
    if (!listingId) return;
    await deleteListing(listingId);
    setSubmitState({ status: "success", message: "Listing deleted successfully." });
  }

  return (
    <div className="edit-listing-shell">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Edit Car Listing</h1>
          <p>Update the details of your posted car.</p>
        </div>
      </header>

      <main className="edit-listing-page">
        <section className="edit-listing-card">
          <h2>Edit Car Listing</h2>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label" htmlFor="edit-listing-id">Listing ID *</label>
              <input className="form-control" id="edit-listing-id" type="number" min="1" {...register("listing_id", { valueAsNumber: true })} />
              {errors.listing_id && <p className="text-danger small mb-0" role="alert">{errors.listing_id.message}</p>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-car-brand">Car Brand *</label>
              <input
                className="form-control"
                id="edit-car-brand"
                name="brand"
                type="text"
                maxLength={15}
                required
                {...register("brand")}
              />
              {errors.brand && <p className="text-danger small mb-0" role="alert">{errors.brand.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-car-model">Model *</label>
              <input
                className="form-control"
                id="edit-car-model"
                name="model"
                type="text"
                maxLength={15}
                required
                {...register("model")}
              />
              {errors.model && <p className="text-danger small mb-0" role="alert">{errors.model.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="edit-car-year">Year *</label>
              <input
                className="form-control"
                id="edit-car-year"
                name="year"
                type="number"
                min="1990"
                max="2026"
                required
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && <p className="text-danger small mb-0" role="alert">{errors.year.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="edit-car-price">Price (Rs.) *</label>
              <input
                className="form-control"
                id="edit-car-price"
                name="price"
                type="number"
                min="1"
                max="1000000000000"
                required
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-danger small mb-0" role="alert">{errors.price.message}</p>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="edit-car-mileage">Mileage (km) *</label>
              <input
                className="form-control"
                id="edit-car-mileage"
                name="mileage"
                type="number"
                min="0"
                max="2000000"
                required
                {...register("mileage", { valueAsNumber: true })}
              />
              {errors.mileage && <p className="text-danger small mb-0" role="alert">{errors.mileage.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-car-condition">Condition *</label>
              <select
                className="form-select"
                id="edit-car-condition"
                name="condition"
                required
                {...register("condition")}
              >
                <option>New</option>
                <option>Used - Excellent</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
              {errors.condition && <p className="text-danger small mb-0" role="alert">{errors.condition.message}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-car-image">Replace Image</label>
              <input
                className="form-control"
                id="edit-car-image"
                type="file"
                accept="image/*"
                {...register("car_image")}
              />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="edit-car-description">Description *</label>
              <textarea
                className="form-control"
                id="edit-car-description"
                name="description"
                rows="4"
                maxLength={1000}
                required
                {...register("description")}
              />
              {errors.description && <p className="text-danger small mb-0" role="alert">{errors.description.message}</p>}
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="edit-listing-save" type="submit" disabled={isSubmitting}>Save Changes</button>
              <button className="edit-listing-delete" type="button" onClick={onDelete} disabled={isSubmitting}>Delete Listing</button>
            </div>
          </div>
          {submitState.message && (
            <p className={`alert ${submitState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
              {submitState.message}
            </p>
          )}
          </form>
        </section>
      </main>
    </div>
  );
}
