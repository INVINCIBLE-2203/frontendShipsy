
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { projectService, organizationService } from '../api/services';
import type { Project, Organization } from '../types';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, organizationId, setOrganization } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState('');

  useEffect(() => {
    loadData();
  }, [user, organizationId]);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const response = await organizationService.getOrganizations();
      setOrganizations(response.data.data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    if (!organizationId) {
      try {
        const response = await organizationService.getOrganizations();
        if (response.data.data && response.data.data.length > 0) {
          const firstOrg = response.data.data[0];
          setOrganization(firstOrg.id);
          setOrganizations(response.data.data);
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
      const projectsData = response.data.data || [];
      
      // Fetch detailed data for each project to get stats
      const detailedProjects = await Promise.all(
        projectsData.map(async (project: Project) => {
          try {
            const detailResponse = await projectService.getProject(project.id);
            const data: any = detailResponse.data;
            console.log(`Project ${project.id} details:`, data);
            return {
              ...project,
              taskCount: data.totalTasks || data.total_tasks || 0,
              completionRate: data.completionRate || data.completion_rate || 0
            };
          } catch (error) {
            console.error(`Error loading details for project ${project.id}:`, error);
            return project;
          }
        })
      );
      
      setProjects(detailedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !newProjectName.trim()) return;
    
    try {
      await projectService.createProject(selectedOrgId, {
        name: newProjectName,
        description: newProjectDescription,
      });
      toast.success('Project created successfully!');
      setNewProjectName('');
      setNewProjectDescription('');
      setSelectedOrgId('');
      setShowCreateProject(false);
      // Refresh projects for the currently selected org
      if (organizationId) {
        loadProjects(organizationId);
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };
  
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !editProjectName.trim()) return;

    try {
      await projectService.updateProject(selectedProject.id, {
        name: editProjectName,
        description: editProjectDescription,
      });
      toast.success('Project updated successfully!');
      setEditProjectName('');
      setEditProjectDescription('');
      setSelectedProject(null);
      setShowEditProject(false);
      if (organizationId) {
        loadProjects(organizationId);
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await projectService.deleteProject(selectedProject.id);
      toast.success('Project deleted successfully!');
      setSelectedProject(null);
      setShowDeleteProject(false);
      if (organizationId) {
        loadProjects(organizationId);
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const openCreateProjectModal = () => {
    // Set default organization to the current one
    setSelectedOrgId(organizationId || (organizations.length > 0 ? organizations[0].id : ''));
    setShowCreateProject(true);
  };

  const openEditProjectModal = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description || '');
    setShowEditProject(true);
  };

  const openDeleteProjectModal = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setShowDeleteProject(true);
  };

  if (!organizationId && !loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TaskMaster!</h1>
          <p className="text-gray-600 mb-8">
            To get started, you need to create an organization or join an existing one.
          </p>
          <Link
            to="/organizations"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
          >
            Go to Organizations
          </Link>
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
            onClick={openCreateProjectModal}
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
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">{project.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => openEditProjectModal(project, e)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => openDeleteProjectModal(project, e)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {project.description && (
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                )}
                
                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Tasks</p>
                    <p className="text-lg font-semibold text-gray-900">{project.taskCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completion</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {project.completionRate ? `${project.completionRate.toFixed(0)}%` : '0%'}
                    </p>
                  </div>
                </div>
                
                <Link
                  to={`/projects/${project.id}/tasks`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  View Tasks →
                </Link>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No projects yet. Create one to get started!
              </div>
            )}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    required
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Website Redesign"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of the project"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateProject(false);
                      setNewProjectName('');
                      setNewProjectDescription('');
                      setSelectedOrgId('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditProject && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>
              <form onSubmit={handleEditProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editProjectName}
                    onChange={(e) => setEditProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editProjectDescription}
                    onChange={(e) => setEditProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProject(false);
                      setSelectedProject(null);
                      setEditProjectName('');
                      setEditProjectDescription('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Project Modal */}
        {showDeleteProject && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Project</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedProject.name}</strong>? This action cannot be undone and will delete all tasks within this project.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteProject(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
