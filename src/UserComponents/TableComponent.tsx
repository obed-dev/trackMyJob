import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useJobStore } from "../hooks/useJobStore";
import NavBar from "./NavBar";
import Swal from "sweetalert2";
import { RootState } from "../store/store";

const TableComponent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("applied");
  const [notes, setNotes] = useState("");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { jobs, loadJobs, createJob, removeJob, updateJob } = useJobStore();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateOrUpdateJob = async (e: any) => {
    e.preventDefault();
    if (!title || !company || !location || !status) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    try {
      if (editingJobId) {
        await updateJob({
          id: editingJobId,
          title,
          company,
          location,
          status,
          notes,
          date: new Date().toISOString(),
          user: { _id: currentUser!.id, name: currentUser!.name },
        });
        setEditingJobId(null);
      } else {
        await createJob(title, company, location, status, notes);
      }

      setTitle("");
      setCompany("");
      setLocation("");
      setStatus("applied");
      setNotes("");
    } catch (error: any) {
      Swal.fire("Error", error.message || "Failed to save job", "error");
    }
  };

  const handleDeleteJob = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await removeJob(id);
      } catch (error: any) {
        Swal.fire("Error", error.message || "Failed to delete job", "error");
      }
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJobId(job.id);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setStatus(job.status);
    setNotes(job.notes || "");
  };

  return (
    <>
      <NavBar />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-color4 dark:bg-darkBackground border border-color1 dark:border-darkColor1 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-white dark:bg-darkColor2 text-color1 dark:text-darkText uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left text-lg font-bold font-montserrat">
                Date
              </th>
              <th className="py-3 px-6 text-left text-lg font-bold font-montserrat">
                Title
              </th>
              <th className="py-3 px-6 text-left text-lg font-bold font-montserrat">
                Company
              </th>
              <th className="py-3 px-6 text-left text-lg font-bold font-montserrat">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-darkBackground text-color1 dark:text-darkText text-sm font-light">
            {jobs.map((job, index) => (
              <tr
                key={job.id || index}
                className="border-b border-color2 dark:border-darkColor2 hover:bg-color1 hover:text-white dark:hover:bg-darkColor3"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-montserrat">
                  {job.date}
                </td>
                <td className="py-3 px-6 text-left font-montserrat">
                  {job.title}
                </td>
                <td className="py-3 px-6 text-left font-montserrat">
                  {job.company}
                </td>
                <td className="py-3 px-6 text-left flex gap-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="bg-buttons dark:bg-darkButtons text-white py-2 px-4 rounded-lg hover:bg-buttonsHover dark:hover:bg-darkButtonsHover"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-darkBackground rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-color1 dark:text-color5">
            {editingJobId ? "Edit Job" : "Create New Job"}
          </h2>
          <input
            type="text"
            placeholder="Type your position"
            value={title || ""} // Asegúrate de que nunca sea undefined
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Type your company"
            value={company || ""} // Asegúrate de que nunca sea undefined
            onChange={(e) => setCompany(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Type job location"
            value={location || ""} // Asegúrate de que nunca sea undefined
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <textarea
            placeholder="Add notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCreateOrUpdateJob}
            className="w-full bg-buttons text-white dark:bg-darkButtons dark:text-darkText py-2 rounded-lg hover:bg-buttonsHover dark:hover:bg-darkButtonsHover transition duration-200"
          >
            {editingJobId ? "Update Job" : "Create Job"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
