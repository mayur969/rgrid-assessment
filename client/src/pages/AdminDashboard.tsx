import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/SocketService";
import api from "../services/ApiService";
import { apiEndpoints } from "../constants/apiEndpoints";
import VoteChart from "../components/VoteChart";
interface Nominee {
  _id: string;
  name: string;
  voteCount: number;
}

interface PollSummary {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "ended";
  totalVotes: number;
  nominees: Nominee[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<PollSummary[]>([]);

  useEffect(() => {
    fetchData();
    socket.on("vote-updated", fetchData);
    return () => {
      socket.off("vote-updated", fetchData);
    };
  }, []);

  const fetchData = async () => {
    try {
      const pollsResponse = await api.get(apiEndpoints.polls.getAllPolls);
      
      if (!pollsResponse.data || pollsResponse.data.length === 0) {
        setPolls([]);
        return;
      }

      const fetchedPolls = pollsResponse.data.map((poll: any) => ({
        _id: poll._id,
        title: poll.title,
        description: poll.description,
        status: poll.status || "active",
        totalVotes: poll.totalVotes,
        nominees: poll.nominees || [],
      }));

      setPolls(fetchedPolls);
    } catch (error) {
      console.log(error);
      setPolls([]);
    }
  };

  const endPoll = async (pollId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(apiEndpoints.polls.endPoll.replace(":id", pollId), {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Poll ended successfully!");
      fetchData();
    } catch (error) {
      alert("Failed to end poll. Please try again.");
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const totalVotes = polls.reduce((sum, poll) => sum + (poll.totalVotes ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#eaf4ff] p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-4xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/40 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3178C6]">Admin panel</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Dashboard</h1>
              <p className="mt-3 text-slate-600">Monitor each poll separately and see live vote updates in real time.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/admin/create-poll")}
                className="rounded-2xl bg-linear-to-r from-[#3178C6] to-[#6cb5f0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3178C6]/20 transition hover:from-[#245ea8] hover:to-[#4f9fe7]"
              >
                Create Poll
              </button>
              <button
                onClick={logout}
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Aggregate Votes</p>
            <p className="mt-4 text-5xl font-bold text-slate-900">{totalVotes}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-900">All Polls</h2>
            <p className="mt-4 text-lg text-slate-600">{polls.length} {polls.length === 1 ? "poll" : "polls"} total</p>
          </div>
        </div>

        {polls.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            <p className="text-lg font-semibold">No polls available yet.</p>
            <p className="mt-2 text-sm">Create a poll to start collecting votes.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {polls.map((poll) => (
              <div key={poll._id} className="rounded-4xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/20">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">{poll.title}</h2>
                    {poll.description && <p className="mt-2 text-slate-600">{poll.description}</p>}
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                    <div className="rounded-2xl bg-[#3178C6]/10 px-5 py-3 text-[#1a4184] shadow-sm">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#3178C6]">Total Votes</p>
                      <p className="mt-2 text-3xl font-bold">{poll.totalVotes}</p>
                    </div>
                    {poll.status === "active" && (
                      <button
                        onClick={() => endPoll(poll._id)}
                        className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                      >
                        End Poll
                      </button>
                    )}
                    {poll.status === "ended" && (
                      <div className="rounded-2xl bg-slate-300 px-6 py-3 text-sm font-semibold text-slate-700">
                        Poll Ended
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Nominee votes</h3>
                    <div className="mt-4 space-y-3">
                      {poll.nominees.map((nominee) => (
                        <div key={nominee._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-slate-700">{nominee.name}</p>
                          <span className="font-semibold text-slate-900">{nominee.voteCount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <VoteChart data={poll.nominees} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;