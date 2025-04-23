import { useDispatch, useSelector } from 'react-redux';
import { addJob, deleteJob, setJobs, editJob } from '../store/auth/jobSlice';
import { RootState } from '../store/store';
import trackMyJobApi from '../api/trackMyJobApi';
import Swal from 'sweetalert2';

interface Job {
  id: string;
  date: string;
  title: string;
  company: string;
  location: string;
  status: string;
  notes: string;
  user: {
    _id: string;
    name: string;
  };
}

export const useJobStore = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const validateUser = (): boolean => {
    if (!currentUser || !currentUser.name) {
      Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
      return false;
    }
    return true;
  };

  const loadJobs = async (): Promise<void> => {
    if (!validateUser()) return;

    try {
      const { data } = await trackMyJobApi.get('/jobs');

      // Filtra los trabajos para incluir solo los del usuario actual basado en el name
      const userJobs = data.jobs.filter((job: Job) => job.user && job.user.name === currentUser.name);

      dispatch(setJobs(userJobs));
    } catch (error: any) {
      Swal.fire('Error', 'Failed to load jobs', 'error');
    }
  };

  const createJob = async (
    title: string,
    company: string,
    location: string,
    status: string,
    notes: string
  ): Promise<void> => {
    if (!validateUser()) return;
  
    if (!title || !company || !location || !status) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }
  
    const newJob = {
      date: new Date().toISOString(),
      title,
      company,
      location,
      status,
      notes,
      user: { _id: currentUser!.uid, name: currentUser!.name },
    };
  
    try {
      const { data } = await trackMyJobApi.post('/jobs', newJob);
      dispatch(addJob(data)); // Actualiza el estado global con el nuevo trabajo
      Swal.fire('Success', 'Job created successfully', 'success');
      loadJobs(); // Recarga los trabajos después de crear uno nuevo
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create job';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const updateJob = async (updatedJob: Job): Promise<void> => {
    if (!validateUser()) return;
  
    try {
      // Verifica que el trabajo pertenezca al usuario actual basado en el uid
      if (!updatedJob.user || updatedJob.user._id !== currentUser?.uid) {
        Swal.fire('Error', 'You cannot update a job that does not belong to you', 'error');
        return;
      }
  
      await trackMyJobApi.put(`/jobs/${updatedJob.id}`, updatedJob);
  
      dispatch(editJob(updatedJob));
      Swal.fire('Success', 'Job updated successfully', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update job';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const removeJob = async (id: string): Promise<void> => {
    if (!validateUser()) return;

    try {
      const jobToDelete = jobs.find((job) => job.id === id);

      if (jobToDelete?.user.name !== currentUser?.name) {
        Swal.fire('Error', 'You cannot delete a job that does not belong to you', 'error');
        return;
      }

      await trackMyJobApi.delete(`/jobs/${id}`);
      dispatch(deleteJob(id));
      Swal.fire('Success', 'Job deleted successfully', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete job';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  return {
    jobs,
    loadJobs,
    createJob,
    removeJob,
    updateJob,
  };
};