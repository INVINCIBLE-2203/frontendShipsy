import type { Task } from '../types';
import { taskService } from '../api/services';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: () => void;
}

const TaskCard = ({ task, onEdit, onDelete, onUpdate }: TaskCardProps) => {
  const getStatusBadgeClass = (status: string) => {
    const classes = {
      todo: 'bg-gray-600 text-white',
      in_progress: 'bg-blue-600 text-white',
      review: 'bg-yellow-500 text-white',
      done: 'bg-green-600 text-white',
      archived: 'bg-gray-800 text-white',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-500 text-white';
  };

  const getPriorityClass = (priority: string) => {
    const classes = {
      urgent: 'border-l-4 border-red-500 bg-red-50',
      high: 'border-l-4 border-orange-500 bg-orange-50',
      medium: 'border-l-4 border-blue-500 bg-blue-50',
      low: 'border-l-4 border-gray-500 bg-gray-50',
    };
    return classes[priority as keyof typeof classes] || '';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent') return '🔥';
    return null;
  };

  const handleToggleComplete = async () => {
    try {
      await taskService.updateTask(task.id, {
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? 'done' : 'in_progress',
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const isOverdue = (task.daysOverdue || task.days_overdue || 0) > 0;
  const taskDueDate = task.dueDate || task.due_date;
  const taskCreatedAt = task.createdAt || task.created_at;
  const taskUpdatedAt = task.updatedAt || task.updated_at;
  const taskCompletedAt = task.completedAt || task.completed_at;
  const taskDaysOverdue = task.daysOverdue || task.days_overdue || 0;
  const taskEffortVariance = task.effortVariance || task.effort_variance || 0;

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${getPriorityClass(task.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleToggleComplete}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
                {getPriorityIcon(task.priority) && (
                  <span className="ml-2">{getPriorityIcon(task.priority)}</span>
                )}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority.toUpperCase()}
              </span>
            </div>

            {task.description && (
              <p className="text-gray-600 text-sm mb-3">
                {task.description.length > 150
                  ? `${task.description.substring(0, 150)}...`
                  : task.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                {task.assignee && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">Assignee:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {task.assignee.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900">{task.assignee.username}</span>
                    </div>
                  </div>
                )}

                {taskDueDate && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">Due Date:</span>
                    <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-900'}>
                      {new Date(taskDueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {isOverdue && (
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-semibold">
                      {taskDaysOverdue} days overdue
                    </span>
                  </div>
                )}
              </div>

              <div>
                {task.estimatedHours !== undefined && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">Estimated:</span>
                    <span className="text-gray-900">{task.estimatedHours}h</span>
                  </div>
                )}

                {task.actualHours !== undefined && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">Actual:</span>
                    <span className="text-gray-900">{task.actualHours}h</span>
                  </div>
                )}

                {taskEffortVariance !== 0 && task.actualHours && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">Variance:</span>
                    <span className={taskEffortVariance > 0 ? 'text-red-600' : 'text-green-600'}>
                      {taskEffortVariance > 0 ? '+' : ''}{taskEffortVariance}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
              {taskCreatedAt && <span>Created: {new Date(taskCreatedAt).toLocaleDateString()}</span>}
              {taskUpdatedAt && <span>Updated: {new Date(taskUpdatedAt).toLocaleDateString()}</span>}
              {taskCompletedAt && (
                <span>Completed: {new Date(taskCompletedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
