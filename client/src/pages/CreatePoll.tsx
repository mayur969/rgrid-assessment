import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import api from "../services/ApiService";
import { apiEndpoints } from "../constants/apiEndpoints";

/**
 * Validation Schema
 */
const createPollSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string(),

  nominees: z
    .array(
      z.object({
        value: z.string().trim().min(1, "Nominee name is required"),
      }),
    )
    .min(2, "Minimum 2 nominees required")
    .max(5, "Maximum 5 nominees allowed"),
});

type CreatePollFormData = z.infer<typeof createPollSchema>;

const CreatePoll = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),

    defaultValues: {
      title: "",

      description: "",

      nominees: [{ value: "" }, { value: "" }],
    },
  });

  const { fields, append } = useFieldArray({ control, name: "nominees" });

  const onSubmit = async (data: CreatePollFormData) => {
    try {
      const token = localStorage.getItem("adminToken");

      const nominees = data.nominees.map((nominee) => nominee.value.trim());

      await api.post(
        apiEndpoints.polls.createPoll,
        {
          title: data.title.trim(),
          description: data.description.trim(),
          nominees,
          createdBy: "6834f53b9f42d8c4a8dfe111",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Poll created successfully!");

      reset();

      navigate("/admin/dashboard");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to create poll";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#3178C6]/10 to-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="ml-10 inline-flex items-center rounded-xl border border-[#3178C6] px-4 py-2 text-sm font-semibold text-[#3178C6] transition hover:bg-[#3178C6]/10"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-4xl bg-white p-10 shadow-2xl shadow-slate-200/50">
          <div className="mb-8 rounded-3xl bg-[#3178C6] px-8 py-6 text-white shadow-lg shadow-[#3178C6]/20">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-100/80">
              Poll Builder
            </p>

            <h1 className="mt-4 text-3xl font-bold">Create New Poll</h1>

            <p className="mt-2 max-w-2xl text-slate-100/85">
              Add your poll details and nominees to start a new voting session.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Title */}
            <div>
              <input
                placeholder="Poll Title"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
                {...register("title")}
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <textarea
              placeholder="Description"
              className="min-h-35 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
              {...register("description")}
            />

            {/* Nominees */}
            {fields.map((field, index) => (
              <div key={field.id}>
                <input
                  placeholder={`Nominee ${index + 1}`}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
                  {...register(`nominees.${index}.value`)}
                />

                {errors.nominees?.[index]?.value && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.nominees?.[index]?.value?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Array Errors */}
            {typeof errors.nominees?.message === "string" && (
              <p className="text-sm text-red-500">{errors.nominees.message}</p>
            )}

            {/* Add Nominee */}
            <button
              type="button"
              onClick={() => {
                if (fields.length >= 5) return;

                append({
                  value: "",
                });
              }}
              disabled={fields.length >= 5}
              className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                fields.length >= 5
                  ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
                  : "border-[#3178C6] text-[#3178C6] hover:bg-[#3178C6]/10"
              }`}
            >
              {fields.length >= 5 ? "Maximum 5 Nominees Added" : "Add Nominee"}
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-lg transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-400 shadow-none"
                  : "bg-linear-to-r from-[#3178C6] to-[#6cb5f0] shadow-[#3178C6]/20 hover:from-[#245ea8] hover:to-[#4f9fe7]"
              }`}
            >
              {isSubmitting ? "Creating Poll..." : "Create Poll"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
