// frontend/src/pages/HomePage.jsx
import Navbar from "../components/Navbar.jsx";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="container hero">
          <div>
            <div className="hero-badge">
              <span>100% Handwoven</span>
              Direct from weavers
            </div>
            <h1>
              Bringing <span className="highlight">traditional weaves</span>
              <br />
              to modern homes.
            </h1>
            <p>
              Discover ethically-made sarees, fabrics and home linens, handwoven
              by our cooperative weavers. Transparent prices, authentic designs,
              and fair wages.
            </p>

            <div className="hero-actions">
              <a href="/products" className="btn btn-primary">
                Explore Collections →
              </a>
              <a href="#about" className="btn btn-outline">
                About the Society
              </a>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <span className="value">50+</span>
                <span>Member weavers</span>
              </div>
              <div className="hero-meta-item">
                <span className="value">20 yrs</span>
                <span>Of handloom legacy</span>
              </div>
              <div className="hero-meta-item">
                <span className="value">100%</span>
                <span>Natural fibers</span>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <div className="hero-image-card-main">
              <img
                src="https://images.pexels.com/photos/4171632/pexels-photo-4171632.jpeg?auto=compress&dpr=2&w=800"
                alt="Handloom weaving"
              />
              <div className="hero-tag">Live handloom in every thread</div>
            </div>
            <div className="hero-floating-card">
              <h4>Weaver-owned marketplace</h4>
              <span>All purchases support local artisan families.</span>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Why buy from a handloom society?</h2>
              <p>
                We are a registered cooperative of traditional weavers, focusing
                on quality, transparency and sustainable livelihoods.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon">🧵</div>
                <h3>Authentic handloom</h3>
                <p>
                  Each product is woven on traditional looms using time-tested
                  techniques passed down through generations.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Fair to weavers</h3>
                <p>
                  No middlemen. Prices are decided by the society and weavers,
                  ensuring fair wages and stable income.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">🌿</div>
                <h3>Eco-conscious</h3>
                <p>
                  Focus on natural fibers, azo-free dyes, and slow production
                  for mindful, planet-friendly fashion.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>Pan-India shipping</h3>
                <p>
                  We ship directly from our society godown to your doorstep,
                  with careful packing and quality checks.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© Handloom Heritage Weavers’ Cooperative Society</span>
          <span>Made for educational demo – static listing only</span>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
