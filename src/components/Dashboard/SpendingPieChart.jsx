import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#7367f0','#00cfe8','#28c76f','#ff9f43','#ea5455','#9e8df5','#67e8f9','#6ee7b7'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700 }}>{payload[0].name}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: payload[0].payload.fill }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {(payload[0].payload.percent * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
