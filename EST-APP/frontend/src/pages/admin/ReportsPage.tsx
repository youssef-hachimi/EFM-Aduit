import React from "react";
import { Layout } from "../../components/Layout";

/**
 * This is a placeholder page where you can add:
 * - per-class attendance breakdowns
 * - absence trends over time
 * - charts
 *
 * Backend currently includes: GET /api/reports/dashboard
 * You can extend it with endpoints like:
 * - GET /api/reports/class/:id?from=...&to=...
 */
export function ReportsPage() {
  return (
    <Layout title="Reports">
      <div className="card p-4">
        <div className="text-sm font-semibold">Reports & Analytics</div>
        <p className="mt-2 text-sm text-slate-600">
          Add advanced reporting here (charts, filters by class/date, export PDFs, etc.). The backend includes a
          dashboard endpoint and can be extended easily.
        </p>

        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
          Suggested endpoints to add next:
          <ul className="mt-2 list-disc pl-6">
            <li>Absence rate by class</li>
            <li>Top absent students</li>
            <li>Monthly attendance trend line</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}