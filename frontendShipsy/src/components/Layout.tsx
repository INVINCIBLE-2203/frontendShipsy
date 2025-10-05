import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { projectService } from '../api/services';
import type { Project } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, organizationId } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (organizationId) {
      projectService.getProjects(organizationId)
        .then(res => setProjects(res.data.data || []))
        .catch(err => console.error('Error loading projects:', err));
    }
  }, [organizationId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">TaskMaster</Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span className="mr-2">{user?.username}</span>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
            <div className="space-y-2">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}/tasks`}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
