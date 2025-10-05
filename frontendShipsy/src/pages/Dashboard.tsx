
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { projectService, organizationService } from '../api/services';
import type { Project } from '../types';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, organizationId, setOrganization } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newOrgName, setNewOrgName] = useState('');

  useEffect(() => {
    loadData();
  }, [user, organizationId]);

  const loadData = async () => {
    setLoading(true);
    if (!organizationId) {
      try {
        const response = await organizationService.getOrganizations();
        if (response.data.data && response.data.data.length > 0) {
          const firstOrg = response.data.data[0];
          setOrganization(firstOrg.id);
          await loadProjects(firstOrg.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading organizations:', error);
        setLoading(false);
      }
    } else {
      await loadProjects(organizationId);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const response = await projectService.getProjects(orgId);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    
    try {
      const response = await organizationService.createOrganization({
        name: newOrgName,
      });
      setOrganization(response.data.id);
      setNewOrgName('');
      setShowCreateOrg(false);
      loadData();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !newProjectName.trim()) return;
    
    try {
      await projectService.createProject(organizationId, {
        name: newProjectName,
        description: '',
      });
      setNewProjectName('');
      setShowCreateProject(false);
      loadProjects(organizationId);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (!organizationId && !loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TaskMaster!</h1>
          <p className="text-gray-600 mb-8">
            To get started, you need to create an organization or join an existing one.
          </p>
          <button
            onClick={() => setShowCreateOrg(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
          >
            Create Organization
          </button>

          {showCreateOrg && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Organization</h2>
                <form onSubmit={handleCreateOrganization}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., My Company"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateOrg(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link
                key={project.id}
                to={`/projects/${project.id}/tasks`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm">{project.description}</p>
                )}
                <div className="mt-4 text-blue-600 text-sm font-medium">View Tasks →</div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No projects yet. Create one to get started!
              </div>
            )}
          </div>
        )}

        {showCreateProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateProject(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
