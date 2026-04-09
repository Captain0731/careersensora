import './home.scss';

export default function Home() {
  return (
    <main className="hero" id="home">
      <div className="bgOrbs" aria-hidden="true" />
      <div className="gridOverlay" aria-hidden="true" />

      <section className="heroShell">
        <div className="copyBlock">
          <p className="eyebrow">AI CAREER INTELLIGENCE PLATFORM</p>

          <h1>
            Stop guessing your career
            <br />
            before it becomes regret.
          </h1>

          <p className="subcopy">
            Discover early signals about your skills, career fit, and market demand in one intelligent dashboard designed to reveal what others miss.
          </p>

          <div className="buttonRow">
            <button className="primaryBtn">Get Started Free</button>
            <button className="secondaryBtn">Explore</button>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <span className="statValue">12%</span>
              <span className="statLabel">faster issue detection</span>
            </div>
            <div className="statCard">
              <span className="statValue">24/7</span>
              <span className="statLabel">culture visibility</span>
            </div>
            <div className="statCard">
              <span className="statValue">AI</span>
              <span className="statLabel">pattern insights</span>
            </div>
          </div>
        </div>

        <div className="visualBlock" aria-hidden="true">
          <div className="panel panelTop">
            <div className="panelLabel">CAREER PULSE</div>
            <div className="panelValue">Strong Match</div>
            <div className="panelMeter">
              <span />
            </div>
          </div>

          <div className="panel panelMiddle">
            <div className="miniCard accent">
              <span>SKILL GROWTH</span>
              <strong>+70%</strong>
            </div>
            <div className="miniCard">
              <span>RISK SIGNALS</span>
              <strong>3 Gaps</strong>
            </div>
          </div>

          <div className="panel panelBottom">
            <div className="ring"></div>
            <div>
              <div className="panelLabel">Demand rising</div>
              <div className="panelValue">Market demand .</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}