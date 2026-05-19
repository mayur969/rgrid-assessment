import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/ApiService";
import { apiEndpoints } from "../constants/apiEndpoints";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginAdmin = async () => {
    try {
      const response = await api.post(apiEndpoints.auth.adminLogin, {
        username,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#3178C6]/10 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-4xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3178C6]">
            Administrator
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Access the poll dashboard to manage candidates and view votes.
          </p>
        </div>
        <input
          placeholder="Username"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginAdmin}
          className="mt-6 w-full rounded-2xl bg-linear-to-r from-[#3178C6] to-[#6cb5f0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3178C6]/20 transition hover:from-[#245ea8] hover:to-[#4f9fe7]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
