import { useEffect, useState } from "react";
import api from "../services/ApiService";import { apiEndpoints } from "../constants/apiEndpoints";import PollCard from "../components/PollCard";
interface Nominee {
  _id: string;
  name: string;
  voteCount: number;
}

interface PollData {
  _id: string;
  title: string;
  description?: string;
  totalVotes: number;
  status?: "active" | "ended";
  nominees: Nominee[];
}

const Home = () => {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.get(apiEndpoints.polls.getActivePolls);
      if (!response.data || response.data.length === 0) {
        setPolls([]);
        return;
      }

      const activePolls = response.data.map((poll: any) => ({
        _id: poll._id,
        title: poll.title,
        description: poll.description,
        totalVotes: poll.totalVotes,
        status: poll.status || "active",
        nominees: poll.nominees || [],
      }));

      setPolls(activePolls);
    } catch (error) {
      console.log(error);
      setPolls([]);
    }
  };

  const votePoll = async (pollId: string, nomineeId: string) => {
    if (votedPolls.includes(pollId)) {
      alert("You have already voted in this poll.");
      return;
    }

    try {
      const response = await api.post(apiEndpoints.votes.submitVote, { pollId, nomineeId });

      if (response.status === 200) {
        alert(response.data.message || "Vote submitted successfully!");
        setVotedPolls((prev) => [...prev, pollId]);

        const pollResponse = await api.get(apiEndpoints.polls.getPollById.replace(":id", pollId));
        setPolls((prev) =>
          prev.map((poll) =>
            poll._id === pollId
              ? {
                  ...poll,
                  nominees: pollResponse.data.nominees,
                  totalVotes: pollResponse.data.poll.totalVotes,
                }
              : poll
          )
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (error.response?.status === 400) {
        alert(`⚠ ${errorMessage || "You have already voted in this poll!"}`);
      } else {
        alert(`✗ ${errorMessage || "Vote failed. Please try again."}`);
      }
      console.error("Vote error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-4xl border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/30 backdrop-blur">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="uppercase tracking-[0.35em] text-sm font-semibold text-[#3178C6]">Live Voting</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Vote Your Candidate</h1>
              <p className="mt-4 max-w-2xl text-slate-600">Choose from all active polls below and vote once per poll per session.</p>
            </div>
            <div className="rounded-3xl bg-linear-to-r from-[#3178C6] to-[#6cb5f0] px-8 py-6 text-white shadow-lg shadow-[#3178C6]/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-100/90">Active Polls</p>
              <p className="mt-3 text-4xl font-semibold">{polls.length}</p>
              <p className="mt-2 text-sm text-slate-100/90">polls currently open</p>
            </div>
          </div>
        </div>

        {polls.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-10 text-center text-slate-500 shadow-sm">
            <p className="text-lg font-semibold">No active polls available</p>
            <p className="mt-2 text-sm">Please check back later when a new poll is created.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {polls.map((poll) => (
              <div key={poll._id} className="rounded-4xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/20">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{poll.title}</h2>
                    {poll.description && <p className="mt-2 text-slate-600">{poll.description}</p>}
                  </div>
                  <div className="rounded-2xl bg-[#3178C6]/10 px-5 py-3 text-[#1a4184] shadow-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-[#3178C6]">Total Votes</p>
                    <p className="mt-2 text-3xl font-bold">{poll.totalVotes}</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {poll.nominees.map((nominee) => (
                    <PollCard
                      key={nominee._id}
                      nominee={nominee}
                      onVote={(nomineeId) => votePoll(poll._id, nomineeId)}
                      hasVoted={votedPolls.includes(poll._id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
