import type { Shelter } from "../../data/mockData";

interface ReadinessBreakdownProps {
  shelter: Shelter;
}

function ReadinessBreakdown({
  shelter,
}: ReadinessBreakdownProps) {

  const capacityScore =
    ((shelter.capacity - shelter.occupied) /
      shelter.capacity) *
    100;

  const factors = [
    {
      name: "Safety",
      value: shelter.safety,
      weight: 30,
    },
    {
      name: "Accessibility",
      value: shelter.accessibility,
      weight: 20,
    },
    {
      name: "Capacity",
      value: Math.round(capacityScore),
      weight: 15,
    },
    {
      name: "Hazard Exposure",
      value: shelter.hazardExposure,
      weight: 15,
    },
    {
      name: "Essential Services",
      value: shelter.essentialServices,
      weight: 10,
    },
    {
      name: "Road Access",
      value: shelter.roadAccess,
      weight: 10,
    },
  ];

  return (
    <div className="space-y-4">

      <h3 className="font-semibold">
        Why this score?
      </h3>

      {factors.map((factor) => {

        const contribution =
          factor.value *
          (factor.weight / 100);

        return (
          <div key={factor.name}>

            <div className="flex justify-between text-sm">

              <span className="text-gray-400">
                {factor.name}
              </span>

              <span>
                {factor.value}
              </span>

            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">

              <span>
                Weight {factor.weight}%
              </span>

              <span>
                +{contribution.toFixed(1)}
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default ReadinessBreakdown;