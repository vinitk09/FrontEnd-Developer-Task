import { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // New States for Search & Filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // State for Profile Editing
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  // Fetch tasks whenever search or filter changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Pass search and status as query parameters
        const { data } = await API.get(`/tasks?search=${search}&status=${filterStatus}`);
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, [search, filterStatus]); // Dependency array: runs when these change

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post('/tasks', { title });
      setTitle(''); 
      // Refresh list
      const { data } = await API.get(`/tasks?search=${search}&status=${filterStatus}`);
      setTasks(data);
    } catch (err) {
      alert('Error adding task');
    }
  };

  // Update Profile Name
  const handleUpdateProfile = async () => {
    try {
      const { data } = await API.put('/users/profile', { name: newName });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setIsEditing(false);
      alert('Profile updated!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
        await API.delete(`/tasks/${id}`);
        setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  // Update Task Status
  const handleStatusChange = async (id, newStatus) => {
      await API.put(`/tasks/${id}`, { status: newStatus });
      // Refresh local state
      setTasks(tasks.map(task => task._id === id ? { ...task, status: newStatus } : task));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      
      {/* --- PROFILE SECTION --- */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
        <div>
          {isEditing ? (
            <input 
              className=" p-1 "
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
            />
          ) : (
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          )}
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <div>
            {isEditing ? (
                <button onClick={handleUpdateProfile} className=""></button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit Profile</button>
            )}
        </div>
      </div>

      {/* --- ADD TASK --- */}
      <form onSubmit={handleAddTask} className="flex gap-4 mb-6">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task..." 
          className="flex-grow p-3 border rounded focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-green-600 text-white px-6 py-2 rounded font-bold">Add</button>
      </form>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* --- TASK LIST --- */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="flex justify-between items-center p-4 bg-gray-50 border rounded hover:shadow-sm">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {/* Status Dropdown for individual task */}
              <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="text-xs mt-1 p-1 border rounded bg-white"
              >
                 <option value="pending">Pending</option>
                 <option value="in-progress">In Progress</option>
                 <option value="completed">Completed</option>
              </select>
            </div>
            <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;