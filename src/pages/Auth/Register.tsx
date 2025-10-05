
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import API from '../../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await API.post('/auth/register', { email, username, password });
      const { tokens } = response.data;
      setTokens(tokens.accessToken, tokens.refreshToken);
      const meResponse = await API.get('/auth/me');
      setUser(meResponse.data);
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('This email or username is already registered. Please login instead or use different credentials.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to register. Please try again.' + err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">Register</h1>  
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form className="px-5 py-7" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center pb-3">{error}</p>}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
            <button type="submit" className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                <span className="inline-block mr-2">Register</span>
            </button>
          </form>
          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <Link to="/login" className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <span className="inline-block ml-1">Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
