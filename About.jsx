export default function About() {
  return (
    <main className="about-page">
        <header className="registration-banner">
          <div className="registration-banner-content">
            <h1>About CarHub</h1>
            <p>Learn more about our car marketplace project.</p>
          </div>
        </header>

        <section className="py-5">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <h2 className="section-title">Who We Are</h2>
                <p className="lead">
                  CarHub is a student semester project that shows how a simple car buy and sell
                  website can be built with HTML, CSS, Bootstrap 5, and JavaScript.
                </p>
                <p>
                  The website lets visitors search for cars, post a car for sale, book a test
                  drive, make an offer, leave feedback, and manage a simple account. The project
                  uses beginner-friendly code that is easy to explain.
                </p>
              </div>
              <div className="col-lg-6">
                <img
                  src="/1.jpg"
                  className="about-image img-fluid w-100"
                  alt="A car featured on CarHub"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="row g-4 mt-4">
              <div className="col-md-4">
                <article className="category about-info-card h-100">
                  <h3>Our Mission</h3>
                  <p className="mb-0 small">
                    Make buying and selling cars simple and transparent for everyone.
                  </p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="category about-info-card h-100">
                  <h3>Our Team</h3>
                  <p className="mb-0 small">
                    Built and maintained by one student as a semester project.
                  </p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="category about-info-card h-100">
                  <h3>Technology Used</h3>
                  <p className="mb-0 small">
                    HTML5, CSS3, Bootstrap 5, React, and JavaScript.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
