// frontend/src/pages/HomePage.jsx
import Navbar from "../components/Navbar.jsx";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <section class="hero hero-bg container">
          <div >
            <div class="hero-badge">
              <span>100% Handwoven</span>
              Direct from weavers
            </div>

            <h1>
              Bringing <span class="highlight">traditional weaves</span><br />
              to modern homes.
            </h1>

            <p>
              Discover ethically-made sarees, fabrics and home linens, handwoven by our cooperative
              weavers. Transparent prices, authentic designs, and fair wages.
            </p>

            <div class="hero-actions">
              <a href="/products" class="btn btn-primary">Explore Collections →</a>
              <a href="#about" class="btn btn-outline">About the Society</a>
            </div>

            <div class="hero-meta">
              <div class="hero-meta-item"><span class="value">50+</span><span>Member weavers</span></div>
              <div class="hero-meta-item"><span class="value">20 yrs</span><span>Handloom legacy</span></div>
              <div class="hero-meta-item"><span class="value">100%</span><span>Natural fibers</span></div>
            </div>
          </div>

          {/* <div class="hero-image-card">
    <div class="hero-image-card-main">
      <img src="https://images.pexels.com/photos/4171632/pexels-photo-4171632.jpeg?auto=compress&dpr=2&w=900" alt="Handloom weaving" />
      <div class="hero-tag">Live handloom in every thread</div>
    </div>

    <div class="hero-floating-card">
      <h4>Weaver-owned marketplace</h4>
      <span>All purchases support artisan families.</span>
    </div>
  </div> */}
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
          <span>Karunagappally Handloom Weaver's Induatrial co. op. Society LTd No. QH-02</span>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
