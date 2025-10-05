
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import API from '../../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await API.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      const meResponse = await API.get('/auth/me');
      setUser(meResponse.data);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">Login</h1>  
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form className="px-5 py-7" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center pb-3">{error}</p>}
            {success && <p className="text-green-600 text-center pb-3">{success}</p>}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <button type="submit" className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                <span className="inline-block mr-2">Login</span>
            </button>
          </form>
          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <Link to="/register" className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <span className="inline-block ml-1">Register</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
