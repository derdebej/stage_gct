import React from "react";

const COLORS = ["#00008B", "#1E90FF", "#87CEFA"];

export function TopFournisseurs({  topFournisseurs }) {
  const maxTotal = Math.max(...topFournisseurs.map((f) => f.total));

  return (
    <div className="w-sm p-4 shadow-sm rounded-2xl bg-white">
      <h2 className="text-lg font-semibold mb-4">Top Fournisseurs</h2>
      <ul className="space-y-3">
        {topFournisseurs.map((f, index) => (
          <li key={f.name}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{f.nom}</span>
              <span className="text-sm text-gray-500">{f.total} DT</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${(f.total / maxTotal) * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopArticles({ topArticles }) {
  const maxQuantity = Math.max(...topArticles.map((a) => a.quantity));

  return (
    <div className="w-sm p-4 shadow-sm rounded-2xl bg-white">
      <h2 className="text-lg font-semibold mb-4">Top Articles</h2>
      <ul className="space-y-3">
        {topArticles.map((a, index) => (
          <li key={a.name}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{a.designation}</span>
              <span className="text-sm text-gray-500">{a.quantite} pcs</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${(a.quantity / maxQuantity) * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
