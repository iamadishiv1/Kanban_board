import React, { useState } from 'react';

function TaskModal({ onClose, onSave, onUpdate, task }) {
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [date, setDate] = useState(task ? task.date : '');
    const [status, setStatus] = useState(task ? task.status : 'TODO');
    const [priority, setPriority] = useState(task ? task.priority : 'Medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = { title, description, date, status, priority };
        if (task) {
            onUpdate(task.id, newTask);
        } else {
            onSave(newTask);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{task ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        className="border border-purple-300 p-3 rounded-lg w-full mb-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task Description"
                        className="border border-purple-300 p-3 rounded-lg w-full mb-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-purple-300 p-3 rounded-lg w-full mb-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-purple-300 p-3 rounded-lg w-full mb-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="TODO">TODO</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border border-purple-300 p-3 rounded-lg w-full mb-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-purple-100 text-purple-600 px-5 py-2 rounded-lg border border-purple-300 hover:bg-purple-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all"
                        >
                            {task ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
