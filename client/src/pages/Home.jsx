import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoFull from '../assets/logo-full.png';

export default function Home() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    navigate(`/track/${code.trim()}`);
  };

  return (
    <div className="flex flex-col gap-16">
      <section className="hero rounded-box bg-secondary/40 py-14">
        <div className="hero-content flex-col gap-10 text-center lg:flex-row-reverse lg:text-left">
          <img src={logoFull} alt="Delivery Wala" className="w-64 sm:w-80 rounded-box" />
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl">
              Parcels delivered, <span className="text-primary">quick &amp; careful</span>.
            </h1>
            <p className="py-4 text-neutral">
              Delivery Wala connects merchants with local delivery partners so parcels move fast within a
              neighbourhood — no app download needed for your customers, just a tracking link.
            </p>

            <form onSubmit={handleTrack} className="join mt-2 w-full max-w-md">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your tracking code"
                className="input join-item w-full uppercase"
              />
              <button type="submit" className="btn btn-primary join-item">
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base-content">I'm a Merchant</h2>
            <p className="text-sm text-neutral">
              Create delivery orders in seconds, track every parcel, and let local riders handle the last mile.
            </p>
            <div className="card-actions mt-2">
              <Link to="/signup?role=merchant" className="btn btn-primary">
                Sign up as Merchant
              </Link>
            </div>
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base-content">I'm a Delivery Man</h2>
            <p className="text-sm text-neutral">
              See parcels available for pickup in your own area and start earning by delivering them.
            </p>
            <div className="card-actions mt-2">
              <Link to="/signup?role=deliveryMan" className="btn btn-outline btn-primary">
                Sign up as Delivery Man
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
