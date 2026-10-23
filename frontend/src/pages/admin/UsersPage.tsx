import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Mail, 
  Building, 
  Key, 
  Calendar, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User, UserRole } from '../../types';
import { formatDate } from '../../utils/formatters';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const list = await adminService.getUsers();
        setUsers(list);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Admin
          </span>
        );
      case 'faculty':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Faculty
          </span>
        );
      case 'student':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
          Institutional User Directory
        </h1>
        <p className="text-xs text-campus-text-secondary mt-0.5">
          Review authenticated student, faculty, and administrative accounts provisioned on CampusMind.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-campus-border shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-campus-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-9 pr-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
            className="w-full sm:w-auto px-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-campus-primary mx-auto mb-3" />
          <p className="text-xs text-campus-text-secondary">Loading institutional directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-campus-primary-subtle text-campus-primary flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-campus-text">No accounts matched</h3>
          <p className="text-xs text-campus-text-secondary">
            Try adjusting your search query or role filter.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-campus-border rounded-xl shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-campus-surface-subtle border-b border-campus-border text-campus-text-secondary font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Identifier</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-campus-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-campus-surface-subtle/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-campus-text">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-campus-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-campus-text">{u.name}</p>
                          <p className="text-[11px] text-campus-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="py-3.5 px-3 text-campus-text-secondary whitespace-nowrap">
                      {u.department || 'General'}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-campus-text-secondary whitespace-nowrap">
                      {u.studentId || u.facultyId || u.id}
                    </td>

                    <td className="py-3.5 px-4 text-right text-campus-text-muted whitespace-nowrap">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
