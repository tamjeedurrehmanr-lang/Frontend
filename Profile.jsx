
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfile, updatePassword } from "./Service/api";

function Profile() {
  const profileSchema = z.object({
    full_name: z.string().trim().min(2, "Enter your full name.").max(25, "Full name cannot exceed 25 characters."),
    father_name: z.string().trim().min(1, "Enter your father's name.").max(25, "Father's name cannot exceed 25 characters."),
    phone: z.string().trim().min(7, "Enter a valid phone number.").max(15, "Phone number is too long."),
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    city: z.string().min(1, "Choose your city.").max(15, "City cannot exceed 15 characters."),
  });
  const [profileState, setProfileState] = useState({ status: "idle", message: "" });
  const [passwordState, setPasswordState] = useState({ status: "idle", message: "" });
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({ resolver: zodResolver(profileSchema) });

  const passwordSchema = z.object({
    email: z.string().trim().email("Enter a valid email address."),
    current_password: z.string().min(6, "Current password must be at least 6 characters.").max(15, "Password cannot exceed 15 characters."),
    password: z.string().min(6, "New password must be at least 6 characters.").max(15, "Password cannot exceed 15 characters."),
    confirmPassword: z.string().min(6, "Confirm your new password.").max(15, "Password cannot exceed 15 characters."),
  }).refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  async function saveProfile(data) {
    setProfileState({ status: "idle", message: "" });
    await updateProfile(data);
    resetProfile(data);
    setProfileState({ status: "success", message: "Your profile was saved." });
  }

  async function savePassword(data) {
    setPasswordState({ status: "idle", message: "" });
    await updatePassword({ email: data.email, current_password: data.current_password, password: data.password });
    resetPassword();
    setPasswordState({ status: "success", message: "Your password was updated." });
  }

  return (
    <main className="profile-page">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>My Profile</h1>
          <p>Update your CarHub account details.</p>
        </div>
      </header>

      <div className="container mt-5">

      {/* Profile */}
      <div className="card p-4 mb-4">

        <h3>Profile Information</h3>

        <form noValidate onSubmit={handleProfileSubmit(saveProfile)}>

          <label htmlFor="profile-full-name">Full Name</label>
          <input
            id="profile-full-name"
            type="text"
            className="form-control mb-3"
            maxLength={25}
            {...registerProfile("full_name")}
          />
          {profileErrors.full_name && <p className="text-danger small" role="alert">{profileErrors.full_name.message}</p>}

          <label htmlFor="profile-father-name">Father Name</label>
          <input
            id="profile-father-name"
            type="text"
            className="form-control mb-3"
            maxLength={25}
            {...registerProfile("father_name")}
          />
          {profileErrors.father_name && <p className="text-danger small" role="alert">{profileErrors.father_name.message}</p>}

          <label htmlFor="profile-phone">Phone</label>
          <input
            id="profile-phone"
            type="tel"
            className="form-control mb-3"
            maxLength={15}
            {...registerProfile("phone")}
          />
          {profileErrors.phone && <p className="text-danger small" role="alert">{profileErrors.phone.message}</p>}

          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            className="form-control mb-3"
            maxLength={25}
            {...registerProfile("email")}
          />
          {profileErrors.email && <p className="text-danger small" role="alert">{profileErrors.email.message}</p>}

          <label htmlFor="profile-city">City</label>
          <select id="profile-city" className="form-control mb-3" {...registerProfile("city")}>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
            <option>Peshawar</option>
            <option>Lahore</option>
            <option>Karachi</option>
          </select>
          {profileErrors.city && <p className="text-danger small" role="alert">{profileErrors.city.message}</p>}

          <button className="btn btn-primary" type="submit" disabled={isProfileSubmitting}>
            {isProfileSubmitting ? "Saving..." : "Save Profile"}
          </button>
          {profileState.message && (
            <p className={`alert ${profileState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
              {profileState.message}
            </p>
          )}

        </form>

      </div>

      {/* Change Password */}
      <div className="card p-4">

        <h3>Change Password</h3>

        <form noValidate onSubmit={handlePasswordSubmit(savePassword)}>

          <label htmlFor="profile-password-email">Account Email</label>
          <input id="profile-password-email" type="email" className="form-control mb-3" {...registerPassword("email")} />
          {passwordErrors.email && <p className="text-danger small" role="alert">{passwordErrors.email.message}</p>}

          <label htmlFor="profile-current-password">Current Password</label>
          <input
            id="profile-current-password"
            type="password"
            className="form-control mb-3"
            maxLength={15}
            {...registerPassword("current_password")}
          />
          {passwordErrors.current_password && <p className="text-danger small" role="alert">{passwordErrors.current_password.message}</p>}

          <label htmlFor="profile-new-password">New Password</label>
          <input
            id="profile-new-password"
            type="password"
            className="form-control mb-3"
            maxLength={15}
            {...registerPassword("password")}
          />
          {passwordErrors.password && <p className="text-danger small" role="alert">{passwordErrors.password.message}</p>}

          <label htmlFor="profile-confirm-password">Confirm Password</label>
          <input
            id="profile-confirm-password"
            type="password"
            className="form-control mb-3"
            maxLength={15}
            {...registerPassword("confirmPassword")}
          />
          {passwordErrors.confirmPassword && <p className="text-danger small" role="alert">{passwordErrors.confirmPassword.message}</p>}

          <button className="btn btn-dark" type="submit" disabled={isPasswordSubmitting}>
            {isPasswordSubmitting ? "Updating..." : "Update Password"}
          </button>
          {passwordState.message && (
            <p className={`alert ${passwordState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
              {passwordState.message}
            </p>
          )}

        </form>

      </div>

      </div>
    </main>
  );
}

export default Profile;
