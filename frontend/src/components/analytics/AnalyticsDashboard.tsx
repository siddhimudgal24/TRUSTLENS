import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { shelters } from "../../data/mockData";
import PageHeader from "../layout/PageHeader";


const readinessData = shelters.map((shelter) => ({
  name: shelter.name,
  readiness: shelter.readiness,
}));


const statusData = [
  {
    name: "Recommended",
    value: shelters.filter(
      (shelter) =>
        shelter.status === "recommended"
    ).length,
  },

  {
    name: "Conditional",
    value: shelters.filter(
      (shelter) =>
        shelter.status === "conditional"
    ).length,
  },

  {
    name: "Avoid",
    value: shelters.filter(
      (shelter) =>
        shelter.status === "avoid"
    ).length,
  },
];


const capacityData = shelters.map((shelter) => ({
  name: shelter.name,
  occupied: shelter.occupied,
  available:
    shelter.capacity - shelter.occupied,
}));


const trendData = [
  {
    time: "09:00",
    readiness: 82,
  },
  {
    time: "10:00",
    readiness: 79,
  },
  {
    time: "11:00",
    readiness: 76,
  },
  {
    time: "12:00",
    readiness: 74,
  },
  {
    time: "13:00",
    readiness: 78,
  },
  {
    time: "14:00",
    readiness: 81,
  },
];


function AnalyticsDashboard() {

  const averageReadiness = Math.round(
    shelters.reduce(
      (total, shelter) =>
        total + shelter.readiness,
      0
    ) / shelters.length
  );

  const totalCapacity = shelters.reduce(
    (total, shelter) =>
      total + shelter.capacity,
    0
  );

  const totalOccupied = shelters.reduce(
    (total, shelter) =>
      total + shelter.occupied,
    0
  );

  const capacityUtilization = Math.round(
    (totalOccupied / totalCapacity) * 100
  );
  const sheltersNeedingReview = shelters.filter(
    (shelter) => shelter.status !== "recommended"
  ).length;
  const availablePlaces = totalCapacity - totalOccupied;

  return (
    <div className="space-y-6 text-white">

      <PageHeader
        eyebrow="System performance"
        title="Analytics & Insights"
        description="Operational performance and shelter intelligence."
      />


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Average Readiness"
          value={`${averageReadiness}/100`}
        />

        <MetricCard
          title="Capacity Utilization"
          value={`${capacityUtilization}%`}
        />

        <MetricCard
          title="Shelters Needing Review"
          value={sheltersNeedingReview.toString()}
        />

        <MetricCard
          title="Places Available"
          value={availablePlaces.toLocaleString()}
        />

      </div>


      {/* READINESS CHART */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <ChartCard title="Shelter Readiness">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={readinessData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Bar
                dataKey="readiness"
                fill="#22c55e"
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>


        {/* STATUS DISTRIBUTION */}

        <ChartCard title="Shelter Status Distribution">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >

                {statusData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        [
                          "#22c55e",
                          "#eab308",
                          "#ef4444",
                        ][index]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </ChartCard>

      </div>


      {/* CAPACITY */}

      <ChartCard title="Shelter Capacity Utilization">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={capacityData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="occupied"
              stackId="capacity"
              fill="#ef4444"
              name="Occupied"
            />

            <Bar
              dataKey="available"
              stackId="capacity"
              fill="#22c55e"
              name="Available"
            />

          </BarChart>

        </ResponsiveContainer>

      </ChartCard>


      {/* READINESS TREND */}

      <ChartCard title="Readiness Trend">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart
            data={trendData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
            />

            <YAxis
              domain={[0, 100]}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="readiness"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </ChartCard>


      {/* INSIGHTS */}

      <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

        <h2 className="font-semibold">
          Operational Insights
        </h2>

        <div className="mt-4 space-y-3 text-sm">

          <Insight>
            Average shelter readiness is currently{" "}
            <strong>{averageReadiness}/100</strong>.
          </Insight>

          <Insight>
            Overall shelter capacity utilization is{" "}
            <strong>{capacityUtilization}%</strong>.
          </Insight>

          <Insight>
            No capacity violations are currently detected.
          </Insight>

          <Insight>
            Shelters with lower readiness should be reviewed
            before allocation decisions.
          </Insight>

        </div>

      </div>

    </div>
  );
}


function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D1320] p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}


function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D1320] p-5">

      <h2 className="font-semibold mb-4">
        {title}
      </h2>

      {children}

    </div>
  );
}


function Insight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg bg-white/5 text-gray-300">
      • {children}
    </div>
  );
}


export default AnalyticsDashboard;