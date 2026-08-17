import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoIcon from '../../assets/logo-icon.png';

export default function Navbar() {
  const { user, logout } = useAuth();

  const dashboardPath = user?.role === 'merchant' ? '/merchant' : '/rider';

  return (
    <div className="navbar border-b border-base-200 bg-base-100 px-4 sm:px-8">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="Delivery Wala" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-lg font-extrabold tracking-tight text-base-content">
            Delivery<span className="text-primary">Wala</span>
          </span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {!user && (
          <>
            <Link to="/track" className="btn btn-ghost btn-sm">
              Track Order
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to={dashboardPath} className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                {user.name.split(' ')[0]}
                <span className="badge badge-secondary badge-sm">{user.role === 'merchant' ? 'Merchant' : 'Rider'}</span>
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-100 p-2 shadow-lg border border-base-200">
                <li className="sm:hidden">
                  <Link to={dashboardPath}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
