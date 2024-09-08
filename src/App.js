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
    <div ref={(node) => ref(drop(node))} className="relative bg-white p-4 mb-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-clip-text text-gray-600">
        {task.priority}
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-gray-900">{task.title}</p>
        <p className="text-gray-700 mb-2">{task.description}</p>
        <p className="text-gray-600 mb-2">Due: {task.date}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} className="border border-gray-300 p-2 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500">
          <option value="TODO">TODO</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setCurrentTask(task);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
    TODO: 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900',
    'IN PROGRESS': 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900',
    COMPLETED: 'bg-gradient-to-r from-green-200 to-green-300 text-green-900',
  };

  return (
    <div ref={drop} className={`flex-1 min-w-[320px] p-4 rounded-lg shadow-lg transition-all duration-300 ${status === 'TODO' ? 'bg-purple-50' : status === 'IN PROGRESS' ? 'bg-orange-50' : 'bg-green-50'}`}>
      <h2 className={`text-xl font-bold mb-4 capitalize p-2 rounded-lg ${statusColors[status]}`}>{status}</h2>
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
        <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">Desktop and Mobile Application</h1>
          <button
            onClick={() => {
              setCurrentTask(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600"
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
