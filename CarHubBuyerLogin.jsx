import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { loginUser } from "./Service/api";

export default function CarHubBuyerLogin() {
  const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    password: z.string().min(6, "Password must be at least 6 characters.").max(15, "Password cannot exceed 15 characters."),
    remember: z.boolean().optional(),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    await loginUser({ ...data, role: "buyer" });
    setSubmitState({ status: "success", message: "Signed in successfully." });
  }

  return (
    <main className="login-page">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1 id="page-title">Buyer sign in</h1>
          <p>Sign in to your CarHub buyer account.</p>
        </div>
      </header>
      <p className="brand">Car<span className="accent">Hub</span></p>
      <section className="panel" aria-labelledby="page-title">
        <p className="intro">Enter your buyer account credentials to continue.</p>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="buyer-email">Email address</label>
            <input id="buyer-email" type="email" maxLength={15} autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="buyer-password">Password</label>
            <input id="buyer-password" type="password" maxLength={15} autoComplete="current-password" {...register("password")} />
            {errors.password && <p className="text-danger small mb-0" role="alert">{errors.password.message}</p>}
          </div>
          <div className="remember">
            <input id="buyer-remember" type="checkbox" {...register("remember")} />
            <label htmlFor="buyer-remember">Remember me</label>
          </div>
          <button className="submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</button>
          <p className="registration-login">
            Need an account? <Link to="/register">Register here</Link>
          </p>
          {submitState.message && (
            <p className={`alert ${submitState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
              {submitState.message}
            </p>
          )}
        </form>
      </section>
      <footer>Buy, sell and compare cars with CarHub.</footer>
    </main>
  );
}
