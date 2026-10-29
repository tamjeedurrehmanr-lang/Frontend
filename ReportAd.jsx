import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitReport } from "./Service/api";

export default function ReportAd() {
  const reportSchema = z.object({
    name: z.string().trim().min(1, "Enter your name.").max(25, "Name cannot exceed 25 characters."),
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    car_ad: z.string().min(1, "Choose a listing.").max(15, "Listing name cannot exceed 15 characters."),
    reason: z.string().min(1, "Choose a reason for your report.").max(100, "Reason cannot exceed 100 characters."),
    details: z.string().max(1000, "Details cannot exceed 1000 characters.").optional(),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(reportSchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    await submitReport(data);
    reset();
    setSubmitState({ status: "success", message: "Your report was submitted." });
  }

  return (
    <div className="report-ad-shell">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Report a Car / Ad</h1>
          <p>Help us keep CarHub listings genuine.</p>
        </div>
      </header>

      <main className="report-ad-page">
        <section className="report-ad-card">
          <h2>Report a Car / Ad</h2>

          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="report-name">Name *</label>
                <input className="form-control" id="report-name" type="text" maxLength={25} {...register("name")} />
                {errors.name && <p className="text-danger small mb-0" role="alert">{errors.name.message}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="report-email">Email *</label>
                <input className="form-control" id="report-email" type="email" maxLength={25} {...register("email")} />
                {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="report-listing">Car / Ad *</label>
                <select className="form-select" id="report-listing" defaultValue="" {...register("car_ad")}>
                  <option value="" disabled>Choose the listing...</option>
                  <option>Toyota Camry</option>
                  <option>Suzuki Dzire</option>
                  <option>BMW 3 Series</option>
                  <option>Honda Civic</option>
                </select>
                {errors.car_ad && <p className="text-danger small mb-0" role="alert">{errors.car_ad.message}</p>}
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="report-reason">Reason for Report *</label>
                <select className="form-select" id="report-reason" defaultValue="" {...register("reason")}>
                  <option value="" disabled>Choose a reason...</option>
                  <option>Fake or misleading listing</option>
                  <option>Wrong price</option>
                  <option>Duplicate ad</option>
                  <option>Offensive content</option>
                  <option>Other</option>
                </select>
                {errors.reason && <p className="text-danger small mb-0" role="alert">{errors.reason.message}</p>}
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="report-details">Additional Details</label>
                <textarea
                  className="form-control"
                  id="report-details"
                  rows="4"
                  maxLength={1000}
                  placeholder="Explain the issue (optional)"
                  {...register("details")}
                />
              </div>

              <div className="col-12">
                <button className="report-ad-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Report"}</button>
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
