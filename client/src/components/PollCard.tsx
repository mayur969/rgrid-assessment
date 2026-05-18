interface Props {
  nominee: {
    _id: string;
    name: string;
    voteCount: number;
  };

  onVote: (id: string) => void;

  hasVoted?: boolean;
}

const PollCard = ({
  nominee,
  onVote,
  hasVoted = false,
}: Props) => {
  return (
    <div className="flex min-h-22 flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {nominee.name}
        </h2>
      </div>

      <button
        onClick={() => onVote(nominee._id)}
        disabled={hasVoted}
        className={`mt-4 inline-flex w-full items-center justify-center rounded-3xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          hasVoted
            ? "cursor-not-allowed bg-slate-300 text-slate-600 shadow-none"
            : "bg-linear-to-r from-sky-600 via-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/25"
        }`}
      >
        {hasVoted
          ? "Already Voted"
          : "Vote Now"}
      </button>
    </div>
  );
};

export default PollCard;