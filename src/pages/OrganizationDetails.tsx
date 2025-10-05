import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { organizationService, projectService } from '../api/services';
import { useAuthStore } from '../store/auth';
import type { Organization, OrganizationMember, Project } from '../types';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [newRole, setNewRole] = useState<'owner' | 'admin' | 'member'>('member');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [orgRes, membersRes, projectsRes] = await Promise.all([
        organizationService.getOrganization(id),
        organizationService.getMembers(id),
        projectService.getProjects(id)
      ]);
      
      const membersData = membersRes.data.data || [];
      setMembers(membersData);
      
      const projectsData = projectsRes.data.data || [];
      setProjects(projectsData);
      
      // Get current user's role from members list using the user from auth store
      const currentUserId = user?.id;
      const currentUserMembership = membersData.find((m: OrganizationMember) => m.user.id === currentUserId);
      
      // Set organization with role and counts
      setOrganization({
        ...orgRes.data,
        role: currentUserMembership?.role || 'member',
        memberCount: orgRes.data.memberCount || membersData.length,
        projectCount: orgRes.data.projectCount || projectsData.length
      });
      
      // Debug log to see if role is being set correctly
      console.log('Current User ID:', currentUserId);
      console.log('Current User Membership:', currentUserMembership);
      console.log('Organization Role:', currentUserMembership?.role);
      console.log('Organization Data:', orgRes.data);
    } catch (error: any) {
      console.error('Error loading organization:', error);
      toast.error('Failed to load organization details');
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/organizations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !inviteEmail.trim()) return;

    try {
      await organizationService.inviteMember(id, {
        email: inviteEmail,
        role: inviteRole
      });
      toast.success('Member invited successfully!');
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast.error(error.response?.data?.message || 'Failed to Add member');
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedMember) return;

    try {
      await organizationService.updateMemberRole(id, selectedMember.user.id, {
        role: newRole
      });
      toast.success('Member role updated successfully!');
      setSelectedMember(null);
      setShowRoleModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async () => {
    if (!id || !selectedMember) return;

    try {
      await organizationService.removeMember(id, selectedMember.user.id);
      toast.success('Member removed successfully!');
      setSelectedMember(null);
      setShowRemoveModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const openRoleModal = (member: OrganizationMember) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setShowRoleModal(true);
  };

  const openRemoveModal = (member: OrganizationMember) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const canManageMembers = () => {
    return organization?.role === 'owner' || organization?.role === 'admin';
  };

  const canChangeRole = (member: OrganizationMember) => {
    if (organization?.role === 'owner') return true;
    if (organization?.role === 'admin' && member.role !== 'owner') return true;
    return false;
  };

  const canRemoveMember = (member: OrganizationMember) => {
    if (organization?.role === 'owner') return true;
    if (organization?.role === 'admin' && member.role !== 'owner') return true;
    return false;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (!organization) {
    return (
      <Layout>
        <div className="text-center py-8">Organization not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/organizations" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Organizations
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(organization.role || 'member')}`}>
                  {organization.role}
                </span>
                <span className="text-gray-600">{members.length} members</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">{projects.length} projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            <Link
              to={`/`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              View All Projects
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No projects yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}/tasks`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Members</h2>
            {canManageMembers() && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Invite Member
              </button>
            )}
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{member.user.username}</p>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {canChangeRole(member) && (
                    <button
                      onClick={() => openRoleModal(member)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Change Role
                    </button>
                  )}
                  {canRemoveMember(member) && (
                    <button
                      onClick={() => openRemoveModal(member)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Member</h2>
              <form onSubmit={handleInviteMember}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteEmail('');
                      setInviteRole('member');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Change Member Role</h2>
              <form onSubmit={handleUpdateRole}>
                <p className="text-gray-600 mb-4">
                  Changing role for <strong>{selectedMember.user.username}</strong>
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'owner' | 'admin' | 'member')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    {organization?.role === 'owner' && <option value="owner">Owner</option>}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleModal(false);
                      setSelectedMember(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Remove Member Modal */}
        {showRemoveModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Remove Member</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <strong>{selectedMember.user.username}</strong> from this organization?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedMember(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveMember}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrganizationDetails;
