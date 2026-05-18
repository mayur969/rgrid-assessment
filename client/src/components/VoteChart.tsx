import{ BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer }from"recharts";

interface Props {
  data: { name: string; voteCount: number }[];
}

const VoteChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-65 rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-slate-500 shadow-sm">
        No vote data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-100 bg-white rounded-xl p-5 shadow-sm">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="voteCount" fill="#3178C6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteChart;