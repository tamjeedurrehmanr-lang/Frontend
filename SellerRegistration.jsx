import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { registerUser } from "./Service/api";

export default function SellerRegistration() {
  const registrationSchema = z.object({
    full_name: z.string().trim().min(2, "Enter your full name.").max(25, "Full name cannot exceed 25 characters."),
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    phone: z.number().min(7, "Enter a valid phone number.").max(15, "Phone number cannot exceed 15 characters."),
    city: z.string().min(1, "Choose your city.").max(15, "City cannot exceed 50 characters."),
    password: z.string().min(6, "Password must be at least 6 characters.").max(15, "Password cannot exceed 15 characters."),
    confirm_password: z.string().min(6, "Confirm your password.").max(15, "Password cannot exceed 15 characters."),
    agree_terms: z.boolean().refine((agreed) => agreed, "You must agree to the Terms and Conditions."),
  }).refine((values) => values.password === values.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registrationSchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    await registerUser("seller", data);
    reset();
    setSubmitState({ status: "success", message: "Your seller account was created." });
  }

  return (
    <main className="registration-shell">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>Create Account</h1>
          <p>Join CarHub in less than a minute.</p>
        </div>
      </header>

      <section className="registration-page">
        <div className="registration-card">
          <h2>Create your CarHub account</h2>

          <form className="registration-form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="registration-fields">
              <div className="registration-field">
                <label htmlFor="seller-name">Full Name <span>*</span></label>
                <input id="seller-name" type="text" maxLength={25} {...register("full_name")} />
                {errors.full_name && <p className="text-danger small mb-0" role="alert">{errors.full_name.message}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="seller-email">Email <span>*</span></label>
                <input id="seller-email" type="email" maxLength={25} {...register("email")} />
                {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="seller-phone">Phone Number <span>*</span></label>
                <input id="seller-phone" type="tel" maxLength={15} placeholder="03xx-xxxxxxx" {...register("phone")} />
                {errors.phone && <p className="text-danger small mb-0" role="alert">{errors.phone.message}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="seller-city">City <span>*</span></label>
                <select id="seller-city" defaultValue="" {...register("city")}>
                  <option value="" disabled>Choose city...</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Peshawar</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                </select>
                {errors.city && <p className="text-danger small mb-0" role="alert">{errors.city.message}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="seller-password">Password <span>*</span></label>
                <input id="seller-password" type="password" maxLength={15} {...register("password")} />
                {errors.password && <p className="text-danger small mb-0" role="alert">{errors.password.message}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="seller-confirm-password">Confirm Password <span>*</span></label>
                <input id="seller-confirm-password" type="password" maxLength={15} {...register("confirm_password")} />
                {errors.confirm_password && <p className="text-danger small mb-0" role="alert">{errors.confirm_password.message}</p>}
              </div>
            </div>

            <div className="registration-terms">
              <input id="seller-terms" type="checkbox" {...register("agree_terms")} />
              <label htmlFor="seller-terms">
                I agree to the Terms and Conditions <span>*</span>
              </label>
            </div>
            {errors.agree_terms && <p className="text-danger small mb-0" role="alert">{errors.agree_terms.message}</p>}

            <button className="registration-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Register"}</button>
            <p className="registration-login">
              Already have an account? <Link to="/adminlogin">Login here</Link>
            </p>
            {submitState.message && (
              <p className={`alert ${submitState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
                {submitState.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
