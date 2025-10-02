import { useState } from "react";

export default function AssessmentsNew() {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: "Frontend Developer MCQ",
      job: "Frontend Developer",
      type: "MCQ",
      status: "active",
    },
    {
      id: 2,
      title: "Backend Coding Challenge",
      job: "Backend Engineer",
      type: "Coding",
      status: "active",
    },
    {
      id: 3,
      title: "Data Analyst Case Study",
      job: "Data Analyst",
      type: "Case Study",
      status: "archived",
    },
  ]);

  const toggleArchive = (id) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "archived" : "active" }
          : a
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Assessments
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage tests and assignments linked to job roles
        </p>
      </div>

      {/* Assessment List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{assessment.title}</h3>
            <p className="text-sm text-gray-500">
              Job: {assessment.job} | Type: {assessment.type}
            </p>

            <div className="mt-3">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  assessment.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {assessment.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                View
              </button>
              <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </button>
              <button
                onClick={() => toggleArchive(assessment.id)}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {assessment.status === "active" ? "Archive" : "Unarchive"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
