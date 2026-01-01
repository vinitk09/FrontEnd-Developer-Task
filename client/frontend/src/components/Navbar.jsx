import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          TaskApp
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;