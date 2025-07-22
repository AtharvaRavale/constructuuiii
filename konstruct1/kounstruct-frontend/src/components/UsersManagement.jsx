import React, { useEffect, useState } from "react";
import Layout1 from "../components/Layout1";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../ThemeContext";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});

  const { theme } = useTheme();

  const palette =
    theme === "dark"
      ? {
          card: "bg-slate-800 border-slate-700 text-slate-100",
          border: "border-slate-700",
          text: "text-slate-100",
          subtext: "text-slate-300",
          shadow: "shadow-xl",
          input: "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400",
        }
      : {
          card: "bg-white border-gray-200 text-gray-900",
          border: "border-gray-200",
          text: "text-gray-900",
          subtext: "text-gray-600",
          shadow: "shadow",
          input: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
        };

  // Fetch users created by current user
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/users-by-creator/");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUniqueRoles = () => {
    const roles = new Set();
    users.forEach((user) => {
      user.accesses?.forEach((access) => {
        access.roles?.forEach((role) => {
          roles.add(role.role);
        });
      });
    });
    return Array.from(roles);
  };

  const getUniqueProjects = () => {
    const projects = new Set();
    users.forEach((user) => {
      user.accesses?.forEach((access) => {
        projects.add(access.project_id);
      });
    });
    return Array.from(projects);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm);

    const matchesRole =
      roleFilter === "all" ||
      user.accesses?.some((access) =>
        access.roles?.some((role) => role.role === roleFilter)
      );

    const matchesProject =
      projectFilter === "all" ||
      user.accesses?.some(
        (access) => access.project_id?.toString() === projectFilter
      );

    return matchesSearch && matchesRole && matchesProject;
  });

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "maker":
        return theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-700";
      case "inspector":
        return theme === "dark"
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-700";
      case "checker":
        return theme === "dark"
          ? "bg-orange-900 text-orange-300"
          : "bg-orange-100 text-orange-700";
      case "supervisor":
        return theme === "dark"
          ? "bg-purple-900 text-purple-300"
          : "bg-purple-100 text-purple-700";
      case "admin":
        return theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-700";
      default:
        return theme === "dark"
          ? "bg-slate-700 text-slate-200"
          : "bg-gray-100 text-gray-700";
    }
  };

  const toggleRowExpansion = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleEditUser = (userId) => {
    alert(`Edit user ${userId} - Feature to be implemented`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      alert(`Delete user ${userId} - Feature to be implemented`);
    }
  };

  const handleManageAccess = (userId) => {
    alert(`Manage access for user ${userId} - Feature to be implemented`);
  };

  return (
    <>
      {/* Main content - fills the space, no max-w or mx-auto */}
      <main className="w-full min-h-[calc(100vh-64px)] p-6 bg-transparent">
        <h2 className={`text-2xl font-bold mb-6 ${palette.text}`}>Users Management</h2>

        {/* Header Stats */}
        <div className={`rounded-lg ${palette.card} ${palette.shadow} p-4 mb-6 ${palette.border} border`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg ${theme === "dark" ? "bg-blue-900" : "bg-blue-50"}`}>
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className={`text-sm ${palette.subtext}`}>Total Users Created</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${theme === "dark" ? "bg-green-900" : "bg-green-50"}`}>
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.accesses?.length > 0).length}
              </div>
              <div className={`text-sm ${palette.subtext}`}>Users with Access</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${theme === "dark" ? "bg-purple-900" : "bg-purple-50"}`}>
              <div className="text-2xl font-bold text-purple-600">
                {getUniqueProjects().length}
              </div>
              <div className={`text-sm ${palette.subtext}`}>Projects Assigned</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-lg ${palette.card} ${palette.shadow} p-6 mb-6 ${palette.border} border`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${palette.text}`}>Search Users</label>
              <input
                type="text"
                placeholder="Search by username, email, or ID..."
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${palette.input} ${palette.border} border`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Role Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${palette.text}`}>Filter by Role</label>
              <select
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${palette.input} ${palette.border} border`}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                {getUniqueRoles().map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {/* Project Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${palette.text}`}>Filter by Project</label>
              <select
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${palette.input} ${palette.border} border`}
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                {getUniqueProjects().map((projectId) => (
                  <option key={projectId} value={projectId}>
                    Project {projectId}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Active Filters Display */}
          {(searchTerm || roleFilter !== "all" || projectFilter !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`text-sm ${palette.subtext}`}>Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {roleFilter !== "all" && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  Role: {roleFilter}
                </span>
              )}
              {projectFilter !== "all" && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                  Project: {projectFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setProjectFilter("all");
                }}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className={`rounded-lg ${palette.card} ${palette.shadow} overflow-hidden ${palette.border} border`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className={palette.subtext}>Loading users...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className={palette.subtext}>
                {users.length === 0
                  ? "No users created yet."
                  : "No users match the current filters."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className={`min-w-full divide-y ${palette.border} border`}>
                  <thead className={theme === "dark" ? "bg-slate-900" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Access & Projects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Roles</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={theme === "dark" ? "bg-slate-800" : "bg-white"}>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-50"}>
                        {/* User Details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${palette.text}`}>
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                              {user.email && (
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Access & Projects */}
                        <td className="px-6 py-4">
                          {user.accesses && user.accesses.length > 0 ? (
                            <div className="space-y-1">
                              {user.accesses
                                .slice(0, 2)
                                .map((access, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium text-gray-900">
                                      Project {access.project_id}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {access.building_id &&
                                        `Building: ${access.building_id}`}
                                      {access.zone_id &&
                                        ` | Zone: ${access.zone_id}`}
                                      {access.flat_id &&
                                        ` | Flat: ${access.flat_id}`}
                                    </div>
                                  </div>
                                ))}
                              {user.accesses.length > 2 && (
                                <div className="text-xs text-blue-600">
                                  +{user.accesses.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No access assigned
                            </span>
                          )}
                        </td>
                        {/* Roles */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.accesses && user.accesses.length > 0 ? (
                              (() => {
                                const allRoles = new Set();
                                user.accesses.forEach((access) => {
                                  access.roles?.forEach((role) => {
                                    allRoles.add(role.role);
                                  });
                                });
                                return Array.from(allRoles)
                                  .slice(0, 3)
                                  .map((role) => (
                                    <span
                                      key={role}
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                        role
                                      )}`}
                                    >
                                      {role}
                                    </span>
                                  ));
                              })()
                            ) : (
                              <span className="text-sm text-gray-500">
                                No roles
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.is_active
                                ? theme === "dark"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : theme === "dark"
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleManageAccess(user.id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs"
                            >
                              Access
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Cards */}
              <div className="lg:hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`border-b ${palette.border} p-4`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-medium ${palette.text}`}>
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRowExpansion(user.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedRows[user.id] ? "▲" : "▼"}
                      </button>
                    </div>
                    {/* Roles Preview */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {user.accesses && user.accesses.length > 0 ? (
                        (() => {
                          const allRoles = new Set();
                          user.accesses.forEach((access) => {
                            access.roles?.forEach((role) => {
                              allRoles.add(role.role);
                            });
                          });
                          return Array.from(allRoles)
                            .slice(0, 2)
                            .map((role) => (
                              <span
                                key={role}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                  role
                                )}`}
                              >
                                {role}
                              </span>
                            ));
                        })()
                      ) : (
                        <span className="text-sm text-gray-500">No roles</span>
                      )}
                    </div>
                    {/* Expanded Details */}
                    {expandedRows[user.id] && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {user.email && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">
                              Email:{" "}
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="text-sm font-medium">Status: </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? theme === "dark"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : theme === "dark"
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {user.accesses && user.accesses.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">
                              Project Access:
                            </div>
                            {user.accesses.map((access, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600 ml-2"
                              >
                                • Project {access.project_id}
                                {access.building_id &&
                                  ` (Building: ${access.building_id})`}
                                {access.zone_id &&
                                  ` (Zone: ${access.zone_id})`}
                                {access.flat_id &&
                                  ` (Flat: ${access.flat_id})`}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleManageAccess(user.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                          >
                            Manage Access
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Results Summary */}
        {!loading && !error && (
          <div className={`mt-4 text-sm ${palette.subtext} text-center`}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </main>
    </>
  );
}

export default UsersManagement;
