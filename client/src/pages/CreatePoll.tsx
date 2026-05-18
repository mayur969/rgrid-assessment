import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/ApiService";
import { apiEndpoints } from "../constants/apiEndpoints";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nominees, setNominees] = useState(["", ""]);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setNominees(["", ""]);
  };

  const createPoll = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.post(
        apiEndpoints.polls.createPoll,
        { title, description, nominees, createdBy: "6834f53b9f42d8c4a8dfe111" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Poll created successfully!");
      resetForm();
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Failed to create poll. Please try again.");
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
            <p className="text-sm uppercase tracking-[0.35em] text-slate-100/80">Poll Builder</p>
            <h1 className="mt-4 text-3xl font-bold">Create New Poll</h1>
            <p className="mt-2 max-w-2xl text-slate-100/85">Add your poll details and nominees to start a new voting session.</p>
          </div>
        <div className="flex flex-col gap-5">
          <input
            placeholder="Poll Title"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="min-h-35 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {nominees.map((nominee, index) => (
            <input
              key={index}
              placeholder={`Nominee ${index + 1}`}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#3178C6] focus:ring focus:ring-[#3178C6]/20"
              value={nominee}
              onChange={(e) => {
                const updated = [...nominees];
                updated[index] = e.target.value;
                setNominees(updated);
              }}
            />
          ))}
          <button
            onClick={() => setNominees([...nominees, ""])}
            className="rounded-2xl border border-[#3178C6] px-5 py-3 text-sm font-semibold text-[#3178C6] transition hover:bg-[#3178C6]/10"
          >
            Add Nominee
          </button>
          <button
            onClick={createPoll}
            className="rounded-2xl bg-linear-to-r from-[#3178C6] to-[#6cb5f0] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#3178C6]/20 transition hover:from-[#245ea8] hover:to-[#4f9fe7]"
          >
            Create Poll
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePoll;
