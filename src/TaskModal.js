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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        className="border p-2 rounded w-full mb-4 text-lg"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task Description"
                        className="border p-2 rounded w-full mb-4 text-lg"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 rounded w-full mb-4 text-lg"
                        required
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 rounded w-full mb-4 text-lg"
                    >


                        <option value="TODO">TODO</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border p-2 rounded w-full mb-4 text-lg"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-gray-200 border border-purple-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;