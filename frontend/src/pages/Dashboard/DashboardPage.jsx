import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-indigo-600">
          AI Learn
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a className="block px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
            Dashboard
          </a>
          <a className="block px-4 py-2 rounded-lg hover:bg-gray-100">
            My Courses
          </a>
          <a className="block px-4 py-2 rounded-lg hover:bg-gray-100">
            AI Assistant
          </a>
          <a className="block px-4 py-2 rounded-lg hover:bg-gray-100">
            Certificates
          </a>
          <a className="block px-4 py-2 rounded-lg hover:bg-gray-100">
            Settings
          </a>
        </nav>

        <div className="p-4">
          <Link
            to="/login"
            className="w-full block text-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, Rahul 👋
          </h1>

          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Level: <span className="font-semibold text-indigo-600">Intermediate</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Courses Enrolled</h3>
            <p className="text-2xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Completed</h3>
            <p className="text-2xl font-bold mt-2">3</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Hours Learned</h3>
            <p className="text-2xl font-bold mt-2">42h</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">AI Queries Used</h3>
            <p className="text-2xl font-bold mt-2">127</p>
          </div>
        </div>

        {/* Course Progress Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between mb-1">
                <span>Machine Learning Fundamentals</span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Deep Learning with PyTorch</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-[40%]"></div>
              </div>
            </div>

          </div>
        </div>

        {/* AI Quick Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl text-white shadow">
          <h2 className="text-xl font-semibold mb-2">
            Ask AI Assistant
          </h2>
          <p className="mb-4 text-sm opacity-90">
            Stuck on a concept? Ask your AI mentor instantly.
          </p>

          <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Open AI Chat
          </button>
        </div>

      </div>
    </div>
  );
}