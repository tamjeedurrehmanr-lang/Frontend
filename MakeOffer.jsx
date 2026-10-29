import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitOffer } from "./Service/api";

export default function MakeOffer() {
  const offerSchema = z.object({
    buyer_name: z.string().trim().min(1, "Please enter your name.").max(50, "Name cannot exceed 50 characters."),
    phone: z.string().trim().min(7, "Please enter a valid phone number.").max(15, "Phone number cannot exceed 15 characters."),
    email: z.string().trim().email("Please enter a valid email.").max(25, "Email address cannot exceed 25 characters."),
    selected_car: z.string().min(1, "Please choose a car."),
    offer_price: z.coerce.number().positive("Offer price must be greater than 0.").max(1_000_000_000_000, "Offer price cannot exceed Rs. 1,000,000,000,000."),
    message: z.string().max(1000, "Message cannot exceed 1000 characters.").optional(),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(offerSchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    await submitOffer(data);
    reset();
    setSubmitState({ status: "success", message: "Your offer was submitted." });
  }

  return (
    <div className="make-offer-page">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Make an Offer</h1>
          <p>Send a price offer to the seller.</p>
        </div>
      </header>

      <main className="report-ad-page">
        <section className="report-ad-card">
          <h2>Make an Offer</h2>
          <form className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-buyer-name">
                  Buyer Name <span className="req">*</span>
                </label>
                <input
                  className="form-control"
                  id="offer-buyer-name"
                  type="text"
                  maxLength={50}
                  {...register("buyer_name")}
                />
                {errors.buyer_name && <p className="text-danger small mb-0" role="alert">{errors.buyer_name.message}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-phone">
                  Phone <span className="req">*</span>
                </label>
                <input
                  className="form-control"
                  id="offer-phone"
                  type="tel"
                  maxLength={15}
                  placeholder="03xx-xxxxxxx"
                  {...register("phone")}
                />
                {errors.phone && <p className="text-danger small mb-0" role="alert">{errors.phone.message}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-email">
                  Email <span className="req">*</span>
                </label>
                <input
                  className="form-control"
                  id="offer-email"
                  type="email"
                  maxLength={25}
                  {...register("email")}
                />
                {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-selected-car">
                  Selected Car <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  id="offer-selected-car"
                  defaultValue=""
                  {...register("selected_car")}
                >
                  <option value="" disabled>Choose a car...</option>
                  <option>Toyota Camry</option>
                  <option>Suzuki Dzire</option>
                  <option>BMW 3 Series</option>
                  <option>Honda Civic</option>
                </select>
                {errors.selected_car && <p className="text-danger small mb-0" role="alert">{errors.selected_car.message}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-asking-price">
                  Asking Price (Rs.)
                </label>
                <input
                  className="form-control"
                  id="offer-asking-price"
                  name="asking_price"
                  type="number"
                  min="0"
                  max="1000000000000"
                  placeholder="Filled automatically"
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="offer-price">
                  Your Offer Price (Rs.) <span className="req">*</span>
                </label>
                <input
                  className="form-control"
                  id="offer-price"
                  type="number"
                  min="1"
                  max="1000000000000"
                  {...register("offer_price")}
                />
                {errors.offer_price && <p className="text-danger small mb-0" role="alert">{errors.offer_price.message}</p>}
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="offer-message">Message</label>
                <textarea
                  className="form-control"
                  id="offer-message"
                  rows="3"
                  maxLength={1000}
                  placeholder="Explain your offer..."
                  {...register("message")}
                />
              </div>

              <div className="col-12">
                <button className="btn btn-orange" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Offer"}</button>
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
