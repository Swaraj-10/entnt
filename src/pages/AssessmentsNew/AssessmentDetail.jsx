import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AssessmentDetail({ assessments }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    const found = assessments.find((a) => String(a.id) === String(id));
    setAssessment(found);
  }, [id, assessments]);

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-700 dark:text-gray-300">
        <p className="text-xl font-semibold">Assessment not found</p>
        <button
          onClick={() => navigate("/assessments")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">{assessment.title}</h2>
        <p>
          <span className="font-semibold">Linked Job: </span>
          {assessment.job}
        </p>
        <p>
          <span className="font-semibold">Type: </span>
          {assessment.type}
        </p>
        {assessment.description && (
          <p>
            <span className="font-semibold">Description: </span>
            {assessment.description}
          </p>
        )}
        <p>
          <span className="font-semibold">Status: </span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              assessment.status === "active"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {assessment.status}
          </span>
        </p>

        {/* Action */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/assessments")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
