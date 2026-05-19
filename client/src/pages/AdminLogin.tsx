import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../services/ApiService";
import { apiEndpoints } from "../constants/apiEndpoints";
import { adminLoginSchema, type AdminLoginFormData } from "../validations/login.validations";

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    register,

    handleSubmit,

    setError,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<AdminLoginFormData>({
      resolver:
        zodResolver(
          adminLoginSchema
        ),

      defaultValues: {
        username: "",
        password: "",
      },
    });

  /**
   * Submit Handler
   */
  const loginAdmin = async (
    data: AdminLoginFormData
  ) => {
    try {
      const response =
        await api.post(
          apiEndpoints.auth
            .adminLogin,
          {
            username:
              data.username.trim(),

            password:
              data.password.trim(),
          }
        );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      navigate(
        "/admin/dashboard"
      );
    } catch (error: any) {
      const message =
        error?.response?.data
          ?.message ||
        "Login failed";

      /**
       * Backend error
       */
      setError("root", {
        message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#3178C6]/10 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-4xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3178C6]">
            Administrator
          </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Access the poll dashboard
            to manage candidates and
            view votes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(
            loginAdmin
          )}
          className="space-y-4"
        >
          {/* Username */}
          <div>
            <input
              placeholder="Username"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
              {...register(
                "username"
              )}
            />

            {errors.username && (
              <p className="mt-2 text-sm text-red-500">
                {
                  errors.username
                    .message
                }
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
              {...register(
                "password"
              )}
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* Backend Error */}
          {errors.root && (
            <p className="text-sm text-red-500">
              {
                errors.root.message
              }
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition ${
              isSubmitting
                ? "cursor-not-allowed bg-slate-400 shadow-none"
                : "bg-linear-to-r from-[#3178C6] to-[#6cb5f0] shadow-[#3178C6]/20 hover:from-[#245ea8] hover:to-[#4f9fe7]"
            }`}
          >
            {isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;