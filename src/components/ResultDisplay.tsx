import React from "react";

interface Prediction {
  label: string;
  results: {
    probabilities: { "0": number; "1": number };
    match: boolean | null;
  }[];
}

interface ResultDisplayProps {
  predictions: Prediction[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ predictions }) => {
  return (
    <div
      id="result-report-ctn"
      className=" max-h-[350px] w-full overflow-auto p-4 bg-zinc-900 text-white rounded-lg shadow-lg"
    >
      <h3 className="text-2xl font-semibold mb-4 text-emerald-500">
        Analysis Result:
      </h3>
      <table className="min-w-full max-h-[400px] table-auto text-sm text-left text-gray-400 border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="py-2 rounded-md px-4 bg-zinc-800 text-emerald-500">
              Category
            </th>
            <th className="py-2 rounded-md px-4 bg-zinc-800 text-emerald-500">
              Probability of Not Matching
            </th>
            <th className="py-2 rounded-md px-4 bg-zinc-800 text-emerald-500">
              Probability of Matching
            </th>
            <th className="py-2 rounded-md px-4 bg-zinc-800 text-emerald-500">
              Detected?
            </th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction) => {
            const { label, results } = prediction;
            const { probabilities, match } = results[0];

            return (
              <tr key={label} className="hover:bg-zinc-700">
                <td className="py-2 cursor-pointer rounded-md px-4">
                  {label.replace("_", " ")}
                </td>
                <td className="py-2 cursor-pointer rounded-md px-4">
                  {(probabilities["0"] * 100).toFixed(2)}%
                </td>
                <td className="py-2 cursor-pointer rounded-md px-4">
                  {(probabilities["1"] * 100).toFixed(2)}%
                </td>
                <td
                  className={`py-2  cursor-pointer rounded-md px-4 font-semibold ${
                    match ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {match ? "Yes" : "No"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultDisplay;
