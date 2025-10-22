import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles!inner (role)
      `)
      .order("created_at", { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  };

  const promoteToAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: "admin" })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to promote user");
    } else {
      toast.success("User promoted to admin");
      fetchUsers();
    }
  };

  const demoteToUser = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: "user" })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to demote user");
    } else {
      toast.success("User demoted to regular user");
      fetchUsers();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user roles and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.user_roles[0]?.role === "admin" ? (
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <User className="h-3 w-3" />
                      User
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.user_roles[0]?.role === "admin" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => demoteToUser(user.id)}
                    >
                      Demote to User
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => promoteToAdmin(user.id)}
                    >
                      Promote to Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
