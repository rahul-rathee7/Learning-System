// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import authService from '../../services/auth Service';
// import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
// import toast from 'react-hot-toast';
// const LoginPage = () => {
//   const [email, setEmail] = useState('alex@timetoprogram.com');
//   const [password, setPassword] = useState('Test@123');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const { token, user } = await authService.login(email, password);
//       login(user, token);
//       toast.success('Logged in successfully!');
//       navigate('/dashboard');
//     }
//     catch (err) {
//       setError(err.message || 'Failed to login. Please check your credentails.');
//       toast.error(err.message || 'Failed to login.')
//     } finally {
//       setLoading(false);
//     }
//   }
//     return (
//       <div className="">
//         <div className="" />
//         <div className="">
//           <div className="">
//             {/* Header */}
//             <div className="">
//               <div className="">
//                 <BrainCircuit className="" strokeWidth={2} />
//               </div>
//               <h1 className="">
//                 Welcome back
//               </h1>
//               <p className="">
//                 Sign in to continue your journey
//               </p>
//             </div>
//             {/* Form */}
//             <div className="">
//               {/* Email Field */}
//               <div className=''>
//                 <label className=''>
//                   Email
//                 </label>
//                 <div className=''>
//                   <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-color duration-200 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
//                     <Mail className='' strokeWidth={2} />
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onFocus={() => setFocusedField('email')}
//                   onBlur={() => setFocusedField(null)}
//                   className=""
//                   placeholder="you@example.com"
//                   />
//                 </div>
//               </div>
//               {/* Password Field */}
//               <div className="">
//                 <label className="">
//                   Password
//                 </label>
//                 <div className="">
//                   <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? '☐ text-emerald-500' : 'text-slate-400'
//                     }`}>
//                     <Lock className="" strokeWidth={2} />
//                   </div>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onFocus={() => setFocusedField('password')}
//                     onBlur={() => setFocusedField(null)}
//                     className=''
//                     placeholder='*******' />
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className=''>
//                   <p className=''></p>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 onClick={(e) => handleSubmit(e)}
//                 disabled={loading}
//                 className=''
//               >
//                 <span className=''>
//                   {loading ? (
//                     <>
//                       <div className=''>
//                         Signing in...
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       Sign in
//                       <ArrowRight className='' strokeWidth={2.5} />
//                     </>
//                   )}
//                 </span>
//                 <div className='' />
//               </button>
//             </div>

//             {/* Footer */}
//             <div className=''>
//               <p className=''>
//                 Don't have an account?{''}
//                 <Link to='/register' className=''>
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* subtle footer text */}
//           <p className=''>
//             By continuing, you agree to our Terms & privacy Policy
//           </p>
//         </div>
//       </div>)
//   }
// export default LoginPage


import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => 
    e.preventDefault();
    
    // console.log(formData);
  ;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Login to continue your AI learning journey
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}