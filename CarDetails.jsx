import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { submitInquiry } from "./Service/api";

const cars = [
  {
    id: "toyota-camry",
    name: "Toyota Camry",
    year: "2020",
    price: "Rs. 11,200,000",
    mileage: "42,000 km",
    city: "Islamabad",
    image: "1.jpg",
    description:
      "Well maintained Toyota Camry, single owner, all documents clear. Regularly serviced with genuine parts. Great option for a comfortable family sedan.",
  },
  {
    id: "honda-civic",
    name: "Honda Civic",
    year: "2024",
    price: "Rs. 5,800,000",
    mileage: "38,000 km",
    city: "Lahore",
    image: "4.png",
    description:
      "Well maintained Honda Civic, single owner, clean interior and exterior. Regularly serviced with genuine parts. All documents are clear and up to date. A reliable and comfortable sedan for daily use and family driving.",
  },
  {
    id: "bmw-3-series",
    name: "BMW 3 Series",
    year: "2020",
    price: "Rs. 12,500,000",
    mileage: "35,000 km",
    city: "Islamabad",
    image: "5.png",
  },
  {
    id: "audi",
    name: "Audi",
    year: "2023",
    price: "Rs. 11,800,000",
    mileage: "40,000 km",
    city: "Karachi",
    image: "6.png",
    description:
      "Beautifully maintained Audi with a comfortable interior and smooth performance. Single owner and regularly serviced with genuine parts. All documents are clear and up to date. An excellent choice for luxury, comfort, and everyday driving.",
  },
];

export default function CarDetails() {
  const { carId } = useParams();
  const car = cars.find((item) => item.id === carId) || cars[0];
  const inquirySchema = z.object({
    buyer_name: z.string().trim().min(1, "Enter your name.").max(25, "Name cannot exceed 25 characters."),
    phone: z.string().trim().min(7, "Enter a valid phone number.").max(15, "Phone number cannot exceed 15 characters."),
    email: z.string().trim().email("Enter a valid email address.").max(25, "Email address cannot exceed 25 characters."),
    contact_method: z.string().max(15, "Contact method cannot exceed 20 characters."),
    message: z.string().trim().min(1, "Enter a message for the seller.").max(1000, "Message cannot exceed 1000 characters."),
  });
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(inquirySchema) });

  async function onSubmit(data) {
    setSubmitState({ status: "idle", message: "" });
    await submitInquiry({ ...data, car: car.name });
    reset();
    setSubmitState({ status: "success", message: "Your inquiry was sent." });
  }

  return (
    <div className="car-details-shell">
      <header className="registration-banner">
        <div className="registration-banner-content">
          <h1>{car.name} - {car.year}</h1>
          <p>Full details and seller contact form.</p>
        </div>
      </header>

      <main className="car-details-page">
        <div className="row g-4">
          <section className="col-lg-7" aria-labelledby="car-details-title">
            <img className="car-details-image" src={`/${car.image}`} alt={car.name} />
            <h2 className="car-details-title" id="car-details-title">
              {car.name} <span>{car.year}</span>
            </h2>
            <p className="car-details-price">{car.price}</p>

            <ul className="car-details-specs">
              <li><strong>Mileage:</strong> {car.mileage}</li>
              <li><strong>Transmission:</strong> Automatic</li>
              <li><strong>Fuel Type:</strong> Petrol</li>
              <li><strong>City:</strong> {car.city}</li>
              <li><strong>Condition:</strong> Used - Excellent</li>
            </ul>

            {car.description && <p>{car.description}</p>}

            <div className="d-flex flex-wrap gap-2">
              <Link className="car-details-secondary" to="/makeoffer">Make an Offer</Link>
            </div>
          </section>

          <section className="col-lg-5" aria-labelledby="contact-seller-title">
            <div className="car-details-contact">
              <h2 id="contact-seller-title">Contact Seller</h2>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="inquiry-name">Your Name *</label>
                  <input className="form-control" id="inquiry-name" type="text" maxLength={25} {...register("buyer_name")} />
                  {errors.buyer_name && <p className="text-danger small mb-0" role="alert">{errors.buyer_name.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="inquiry-phone">Phone *</label>
                  <input className="form-control" id="inquiry-phone" type="tel" maxLength={15} placeholder="03xx-xxxxxxx" {...register("phone")} />
                  {errors.phone && <p className="text-danger small mb-0" role="alert">{errors.phone.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="inquiry-email">Email *</label>
                  <input className="form-control" id="inquiry-email" type="email" maxLength={25} {...register("email")} />
                  {errors.email && <p className="text-danger small mb-0" role="alert">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="inquiry-contact-method">Preferred Contact Method</label>
                  <select className="form-select" id="inquiry-contact-method" defaultValue="Phone Call" {...register("contact_method")}>
                    <option>Phone Call</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="inquiry-message">Message *</label>
                  <textarea
                    className="form-control"
                    id="inquiry-message"
                    rows="3"
                    maxLength={1000}
                    placeholder="I'm interested in this car..."
                    {...register("message")}
                  />
                  {errors.message && <p className="text-danger small mb-0" role="alert">{errors.message.message}</p>}
                </div>

                <button className="car-details-primary w-100" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Inquiry"}</button>
                {submitState.message && (
                  <p className={`alert ${submitState.status === "success" ? "alert-success" : "alert-danger"} mt-3 mb-0`} role="status">
                    {submitState.message}
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
