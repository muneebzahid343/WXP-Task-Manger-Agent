
import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewMode, TaskPriority, SuggestedTask } from './types';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import AIAssistantPage from './components/AIAssistantPage';
import DashboardPage from './components/DashboardPage'; // New import
import { API_KEY_WARNING } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Dashboard); // Default to Dashboard
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('workAgentTasks_v2'); // Use new key for updated structure
    try {
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        return [];
    }
  });
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(false);

  useEffect(() => {
    // In a real deployment, API_KEY is set via environment variables
    // and should not be handled or prompted for in the frontend.
    // This simulates checking if it's available.
    const envApiKey = (window as any).APP_GEMINI_API_KEY || process.env.API_KEY; 
    if (envApiKey) {
      setApiKey(envApiKey);
      setShowApiKeyWarning(false);
    } else {
      setShowApiKeyWarning(true);
      console.warn(API_KEY_WARNING);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workAgentTasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, description: string, priority: TaskPriority, dueDate?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate,
    };
    setTasks(prevTasks => [newTask, ...prevTasks].sort((a,b) => b.createdAt - a.createdAt));
  }, []);
  
  const addMultipleTasks = useCallback((newTasks: SuggestedTask[], priority: TaskPriority, dueDate?: string) => {
    const tasksToAdd: Task[] = newTasks.map((suggestedTask, index) => ({
        id: (Date.now() + index).toString(), // Ensure unique IDs
        title: suggestedTask.title,
        description: suggestedTask.description,
        completed: false,
        createdAt: Date.now() + index, // Slight offset for sorting if added rapidly
        priority,
        dueDate,
    }));
    setTasks(prevTasks => [...tasksToAdd, ...prevTasks].sort((a,b) => b.createdAt - a.createdAt));
  }, []);


  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.Dashboard:
        return <DashboardPage tasks={tasks} />;
      case ViewMode.Tasks:
        return <TaskList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />;
      case ViewMode.AIAssistant:
        return <AIAssistantPage apiKey={apiKey} onAddSuggestedTasks={addMultipleTasks} />;
      default:
        return <DashboardPage tasks={tasks} />; // Fallback to Dashboard
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {showApiKeyWarning && (
        <div 
            className="bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 p-4 mb-6 rounded-md shadow-lg" 
            role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-amber-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
            </div>
            <div>
                <p className="font-bold text-amber-600 dark:text-amber-200">API Key Potentially Missing</p>
                <p className="text-sm">{API_KEY_WARNING}</p>
            </div>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
