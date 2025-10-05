import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { taskService } from '../../api/services';
import type { Task, TaskStatus, TaskPriority, TaskFilters } from '../../types';
import Layout from '../../components/Layout';
import TaskModal from '../../components/TaskModal';
import TaskCard from '../../components/TaskCard';

const TaskList = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  const loadTasks = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await taskService.getTasks(projectId, {
        page,
        limit,
        ...filters,
      });
      console.log('Task API Response:', response.data);
      
      // The API returns pagination data at root level, not in a meta object
      const responseData: any = response.data;
      
      setTasks(responseData.data || []);
      setTotalPages(responseData.totalPages || 1);
      setTotal(responseData.total || 0);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId, page, limit, filters]);

  const handleStatusFilter = (status: TaskStatus) => {
    setFilters(prev => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status];
      return { ...prev, status: newStatuses };
    });
    setPage(1);
  };

  const handlePriorityFilter = (priority: TaskPriority) => {
    setFilters(prev => {
      const currentPriorities = prev.priority || [];
      const newPriorities = currentPriorities.includes(priority)
        ? currentPriorities.filter(p => p !== priority)
        : [...currentPriorities, priority];
      return { ...prev, priority: newPriorities };
    });
    setPage(1);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    loadTasks();
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded ${
            page === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } border`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-2">
                {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status)}
                      onChange={() => handleStatusFilter(status)}
                      className="rounded border-gray-300 text-blue-600 mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
              <div className="space-y-2">
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority)}
                      onChange={() => handlePriorityFilter(priority)}
                      className="rounded border-gray-300 text-blue-600 mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="created_at">Created Date</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Order</h3>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="ASC">Ascending ↑</option>
                <option value="DESC">Descending ↓</option>
              </select>
            </div>
          </div>

          <div className="col-span-3 space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tasks found</div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdate={loadTasks}
                />
              ))
            )}

            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {Math.min((page - 1) * limit + 1, total)}-{Math.min(page * limit, total)} of {total} tasks
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-white text-gray-700 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                {renderPageNumbers()}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-white text-gray-700 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          projectId={projectId!}
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
};

export default TaskList;
