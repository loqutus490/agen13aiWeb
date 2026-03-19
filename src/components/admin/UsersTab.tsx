import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Users, KeyRound, Search, Trash2, ShieldCheck, Shield, UserCog, Plus, X } from "lucide-react";
import { toast } from "sonner";

type AppRole = "admin" | "moderator" | "user";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: AppRole[];
}

const ROLE_CONFIG: Record<AppRole, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Admin", variant: "default" },
  moderator: { label: "Moderator", variant: "secondary" },
  user: { label: "User", variant: "outline" },
};

const ALL_ROLES: AppRole[] = ["admin", "moderator", "user"];

const invokeAdmin = async (body: Record<string, unknown>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke("admin-users", {
    body,
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (res.error) throw res.error;
  if (res.data?.error) throw new Error(res.data.error);
  return res.data;
};

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [passwordDialog, setPasswordDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter((u) => u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const data = await invokeAdmin({ action: "list" });
      setUsers(data.users || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordDialog.user) return;
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await invokeAdmin({
        action: "change_password",
        userId: passwordDialog.user.id,
        newPassword,
      });
      toast.success(`Password updated for ${passwordDialog.user.email}`);
      setPasswordDialog({ open: false, user: null });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    try {
      await invokeAdmin({ action: "delete_user", userId: user.id });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`Deleted user ${user.email}`);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleAssignRole = async (userId: string, role: AppRole) => {
    try {
      await invokeAdmin({ action: "assign_role", userId, role });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, roles: [...new Set([...u.roles, role])] } : u
        )
      );
      toast.success(`Role "${role}" assigned`);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign role");
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    if (!confirm(`Remove "${role}" role from this user?`)) return;
    try {
      await invokeAdmin({ action: "remove_role", userId, role });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, roles: u.roles.filter((r) => r !== role) } : u
        )
      );
      toast.success(`Role "${role}" removed`);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Registered Users</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {users.length} total registered user{users.length !== 1 ? "s" : ""}
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const availableRoles = ALL_ROLES.filter((r) => !user.roles.includes(r));
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {user.roles.length === 0 && (
                            <span className="text-xs text-muted-foreground">No roles</span>
                          )}
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={ROLE_CONFIG[role].variant}
                              className="gap-1 pr-1"
                            >
                              {role === "admin" && <ShieldCheck className="w-3 h-3" />}
                              {role === "moderator" && <Shield className="w-3 h-3" />}
                              {role === "user" && <UserCog className="w-3 h-3" />}
                              {ROLE_CONFIG[role].label}
                              <button
                                onClick={() => handleRemoveRole(user.id, role)}
                                className="ml-0.5 rounded-full p-0.5 hover:bg-background/20"
                                title={`Remove ${role} role`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                          {availableRoles.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel className="text-xs">Assign role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {availableRoles.map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() => handleAssignRole(user.id, role)}
                                  >
                                    {role === "admin" && <ShieldCheck className="w-3 h-3 mr-2" />}
                                    {role === "moderator" && <Shield className="w-3 h-3 mr-2" />}
                                    {role === "user" && <UserCog className="w-3 h-3 mr-2" />}
                                    {ROLE_CONFIG[role].label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                          {user.email_confirmed_at ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPasswordDialog({ open: true, user })}
                        >
                          <KeyRound className="w-3 h-3 mr-1" />
                          Reset Password
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog
        open={passwordDialog.open}
        onOpenChange={(open) => {
          setPasswordDialog({ open, user: open ? passwordDialog.user : null });
          if (!open) {
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{passwordDialog.user?.email}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialog({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
