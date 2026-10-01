import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import {
  ArrowRight,
  Clock,
  Smartphone,
  CheckCircle2,
  Users,
  Building2,
  Stethoscope,
  Landmark,
  GraduationCap,
  FileBadge,
  Sparkles,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 0 3.5rem',
          background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-main) 100%)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          {/* Tagline pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} />
            <span>Smart Digital Queue Management</span>
          </div>

          {/* Hero Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              lineHeight: 1.15,
              maxWidth: '820px',
              margin: '0 auto 1.25rem',
            }}
          >
            Skip the Line. <span style={{ color: 'var(--primary)' }}>Save Your Time.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '650px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.6,
            }}
          >
            Join queues digitally, track your position, and know when it's your turn.
          </p>

          {/* Hero Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/queues')}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Join a Queue
            </Button>
            <Button variant="secondary" size="lg" onClick={scrollToHowItWorks}>
              How It Works
            </Button>
          </div>

          {/* Visual Representation Card: Current Token → Your Token → People Ahead → Estimated Wait */}
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 1.5rem',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Live Visual Queue Flow
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              {/* Current Token */}
              <div
                style={{
                  background: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Current Token
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  A35
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  Now Serving
                </div>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                →
              </div>

              {/* Your Token */}
              <div
                style={{
                  background: 'var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                  border: '2px solid var(--primary)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Your Token
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  A42
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  Confirmed
                </div>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                →
              </div>

              {/* People Ahead */}
              <div
                style={{
                  background: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  People Ahead
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
                  7
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  In line before you
                </div>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                →
              </div>

              {/* Estimated Wait */}
              <div
                style={{
                  background: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Estimated Wait
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  21 min
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ~3 min / person
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How QueueLess Works Section */}
      <section id="how-it-works" style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              How QueueLess Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Four effortless steps to spend less time waiting in lobbies and more time doing what matters.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Choose a Service
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Browse hospitals, banks, college offices, and government service centers near you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Get Your Digital Token
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Tap to issue a digital queue ticket instantly without standing in physical lines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Track Your Queue
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Monitor serving tokens, wait times, and people ahead in real-time from your phone.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Arrive When Your Turn Is Near
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Receive clear notifications to step up right when your number is called.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suitable for Sectors Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Designed For High-Volume Facilities
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Eliminating waiting room congestion across public and private service centers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                <Stethoscope size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Hospitals</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OPDs & Labs</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ECFDF5', color: '#16A34A' }}>
                <Landmark size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Banks</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teller & Cash</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>College Offices</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admissions & Fees</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                <FileBadge size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Government Centers</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Licenses & IDs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Ready to experience frictionless queues?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
            Join a queue right now or explore staff and admin dashboards with realistic simulation data.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/queues')}>
            Explore Available Queues
          </Button>
        </div>
      </section>
    </div>
  );
};
