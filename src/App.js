import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addTask, updateTask, deleteTask, getTasks } from './firebase';
import TaskModal from './TaskModal';
import './index.css';

const ItemType = {
  TASK: 'task',
};

function Task({ task, index, moveTask, handleStatusChange, handleDeleteTask, setCurrentTask, setShowModal }) {
  const [, ref] = useDrag({
    type: ItemType.TASK,
    item: { id: task.id, index },
  });

  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="relative bg-white p-4 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-clip-text text-gray-600">
        {task.priority}
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-gray-800">{task.title}</p>
        <p className="text-gray-600 mb-2">{task.description}</p>
        <p className="text-gray-500 mb-2">Due: {task.date}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} className="border border-purple-300 p-1 rounded text-sm">
          <option value="TODO">TODO</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded shadow-lg hover:shadow-red-500/50 transition-shadow"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setCurrentTask(task);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded shadow-lg hover:shadow-blue-500/50 transition-shadow"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ status, tasks, moveTask, handleStatusChange, handleDeleteTask, setCurrentTask, setShowModal }) {
  const [, drop] = useDrop({
    accept: ItemType.TASK,
    drop(item, monitor) {
      if (monitor.didDrop()) return;
      handleStatusChange(item.id, status);
    },
  });

  const statusColors = {
    TODO: 'bg-purple-200 text-purple-800',
    'IN PROGRESS': 'bg-orange-200 text-orange-800',
    COMPLETED: 'bg-green-200 text-green-800',
  };

  return (
    <div ref={drop} className={`flex-1 min-w-[320px] p-4 rounded-lg shadow-lg transition-all duration-200 ${status === 'TODO' ? 'bg-purple-100' : status === 'IN PROGRESS' ? 'bg-orange-100' : 'bg-green-100'}`}>
      <h2 className={`text-xl font-bold mb-4 capitalize p-2 rounded ${statusColors[status]}`}>{status}</h2>
      {tasks.map((task, index) => (
        <Task key={task.id} task={task} index={index} moveTask={moveTask} handleStatusChange={handleStatusChange} handleDeleteTask={handleDeleteTask} setCurrentTask={setCurrentTask} setShowModal={setShowModal} />
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
      setTasks(tasks);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    const id = await addTask(task);
    setTasks((prevTasks) => [...prevTasks, { id, ...task }]);
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask);
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      await updateTask(id, { ...updatedTask, status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  const sortByPriority = (taskList) => {
    return taskList.sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800">Desktop and Mobile Application</h1>
          <button
            onClick={() => {
              setCurrentTask(null);
              setShowModal(true);
            }}
            className="p-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 p-3"
          >
            Create Task
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          {['TODO', 'IN PROGRESS', 'COMPLETED'].map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={sortByPriority(tasks.filter((task) => task.status === status))}
              moveTask={moveTask}
              handleStatusChange={handleStatusChange}
              handleDeleteTask={handleDeleteTask}
              setCurrentTask={setCurrentTask}
              setShowModal={setShowModal}
            />
          ))}
        </div>

        {showModal && (
          <TaskModal
            task={currentTask}
            onSave={handleAddTask}
            onUpdate={handleUpdateTask}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
