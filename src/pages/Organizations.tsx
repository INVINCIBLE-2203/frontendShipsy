import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../api/services';
import type { Organization } from '../types';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [newOrgName, setNewOrgName] = useState('');
  const [editOrgName, setEditOrgName] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getOrganizations();
      const orgsData = response.data.data || [];
      
      // Fetch detailed data for each organization to get member and project counts
      const detailedOrgs = await Promise.all(
        orgsData.map(async (org: Organization) => {
          try {
            const detailResponse = await organizationService.getOrganization(org.id);
            return {
              ...org,
              memberCount: detailResponse.data.memberCount,
              projectCount: detailResponse.data.projectCount
            };
          } catch (error) {
            console.error(`Error loading details for org ${org.id}:`, error);
            return org; // Return org without counts if detail fetch fails
          }
        })
      );
      
      setOrganizations(detailedOrgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      await organizationService.createOrganization({ name: newOrgName });
      toast.success('Organization created successfully!');
      setNewOrgName('');
      setShowCreateModal(false);
      loadOrganizations();
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error(error.response?.data?.message || 'Failed to create organization');
    }
  };

  const handleEditOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !editOrgName.trim()) return;

    try {
      await organizationService.updateOrganization(selectedOrg.id, { name: editOrgName });
      toast.success('Organization updated successfully!');
      setEditOrgName('');
      setSelectedOrg(null);
      setShowEditModal(false);
      loadOrganizations();
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error(error.response?.data?.message || 'Failed to update organization');
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrg) return;

    try {
      await organizationService.deleteOrganization(selectedOrg.id);
      toast.success('Organization deleted successfully!');
      setSelectedOrg(null);
      setShowDeleteModal(false);
      loadOrganizations();
    } catch (error: any) {
      console.error('Error deleting organization:', error);
      toast.error(error.response?.data?.message || 'Failed to delete organization');
    }
  };

  const openEditModal = (org: Organization) => {
    setSelectedOrg(org);
    setEditOrgName(org.name);
    setShowEditModal(true);
  };

  const openDeleteModal = (org: Organization) => {
    setSelectedOrg(org);
    setShowDeleteModal(true);
  };

  const canEdit = (org: Organization) => {
    return org.role === 'owner' || org.role === 'admin';
  };

  const canDelete = (org: Organization) => {
    return org.role === 'owner';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="text-gray-600 mt-1">Manage your organizations and teams</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Organization
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-600 mb-4">Create your first organization to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Organization
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{org.name}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {org.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">{org.memberCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-lg font-semibold text-gray-900">{org.projectCount || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/organizations/${org.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </Link>
                  {canEdit(org) && (
                    <button
                      onClick={() => openEditModal(org)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete(org) && (
                    <button
                      onClick={() => openDeleteModal(org)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Organization Modal */}
        {showCreateModal && (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., My Company"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewOrgName('');
                    }}
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

        {/* Edit Organization Modal */}
        {showEditModal && selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Organization</h2>
              <form onSubmit={handleEditOrganization}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editOrgName}
                    onChange={(e) => setEditOrgName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedOrg(null);
                      setEditOrgName('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Organization</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedOrg.name}</strong>? This action cannot be undone and will delete all projects and tasks within this organization.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedOrg(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Organizations;
