import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus, Shield, Trash2, MapPin, Plus, Users, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegional } from "@/contexts/RegionalContext";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TeamUser {
  id: string;
  username: string;
  display_name: string;
  role: string;
  created_at: string;
}

const AdminUsers = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { regionals, addRegional, removeRegional } = useRegional();
  const [isLoading, setIsLoading] = useState(false);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newRegionalName, setNewRegionalName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ type: "user" | "regional"; id: string; name: string } | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<{ id: string; username: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    role: "scout",
  });

  useEffect(() => {
    if (user?.teamNumber) {
      fetchTeamUsers();
    }
  }, [user?.teamNumber]);

  const fetchTeamUsers = async () => {
    if (!user?.teamNumber) return;
    setLoadingUsers(true);
    const { data } = await supabase
      .from("team_users" as any)
      .select("id, username, display_name, role, created_at")
      .eq("team_number", user.teamNumber)
      .order("created_at", { ascending: true });

    if (data) setTeamUsers(data as any[]);
    setLoadingUsers(false);
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/scout" replace />;
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.teamNumber) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("team_users" as any)
        .insert({
          team_number: user.teamNumber,
          username: formData.username,
          password: formData.password,
          display_name: formData.displayName || formData.username,
          role: formData.role,
        });

      if (error) {
        if (error.code === "23505") {
          toast.error(t("admin.userExists"));
        } else {
          throw error;
        }
      } else {
        toast.success(t("admin.userCreated").replace("{username}", formData.username));
        setFormData({ username: "", password: "", displayName: "", role: "scout" });
        fetchTeamUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (username === user?.username) {
      toast.error(t("admin.cantDeleteSelf"));
      return;
    }
    setDeleteTarget({ type: "user", id: userId, name: username });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "user") {
      const { error } = await supabase
        .from("team_users" as any)
        .delete()
        .eq("id", deleteTarget.id);

      if (!error) {
        toast.success(t("admin.userDeleted").replace("{username}", deleteTarget.name));
        fetchTeamUsers();
      }
    } else {
      await removeRegional(deleteTarget.name);
    }
    setDeleteTarget(null);
  };

  const handleChangePassword = async () => {
    if (!passwordTarget || newPassword.length < 4) return;
    const { error } = await supabase
      .from("team_users" as any)
      .update({ password: newPassword })
      .eq("id", passwordTarget.id);

    if (error) {
      toast.error(t("admin.passwordChangeFailed"));
    } else {
      toast.success(t("admin.passwordChanged").replace("{username}", passwordTarget.username));
    }
    setPasswordTarget(null);
    setNewPassword("");
  };

  const handleAddRegional = async () => {
    if (newRegionalName.trim()) {
      await addRegional(newRegionalName.trim());
      setNewRegionalName("");
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-4 lg:py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">{t("admin.title")}</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("admin.subtitle")} • {t("admin.teamLabel")} {user?.teamNumber}
            </p>
          </div>

          {/* Regional Management */}
          <div className="card-data p-4 mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              {t("regional.manage")}
            </h3>
            <div className="space-y-1 mb-3">
              {regionals.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">{t("admin.noRegionals")}</p>
              )}
              {regionals.map((r) => (
                <div key={r} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium">{r}</span>
                  <button
                    onClick={() => setDeleteTarget({ type: "regional", id: r, name: r })}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t("regional.namePlaceholder")}
                value={newRegionalName}
                onChange={(e) => setNewRegionalName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRegional()}
                className="h-9 bg-input border-border text-sm"
              />
              <Button onClick={handleAddRegional} size="sm" className="h-9 px-3" disabled={!newRegionalName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Team Members */}
          <div className="card-data p-4 mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              {t("admin.teamMembers")}
            </h3>
            {loadingUsers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-1">
                {teamUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{u.display_name || u.username}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-2xs font-semibold uppercase",
                        u.role === "admin" ? "bg-primary/20 text-primary" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {u.role}
                      </span>
                    </div>
                    {u.username !== user?.username && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setPasswordTarget({ id: u.id, username: u.username }); setNewPassword(""); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title={t("admin.changePassword")}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create User Form */}
          <div className="card-data p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-primary" />
              {t("admin.createUser")}
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("admin.username")}</Label>
                <Input
                  placeholder="john"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="h-11 bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("admin.displayName")}</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="h-11 bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("admin.password")}</Label>
                <Input
                  type="text"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 bg-input border-border"
                  required
                  minLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("admin.role")}</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger className="h-11 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scout">Scout</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <><UserPlus className="w-4 h-4 mr-2" />{t("admin.createUser")}</>
                )}
              </Button>
            </form>
          </div>
        </div>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("admin.confirmDeleteTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.type === "user"
                  ? t("admin.confirmDeleteUser").replace("{name}", deleteTarget?.name || "")
                  : t("admin.confirmDeleteRegional").replace("{name}", deleteTarget?.name || "")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("admin.confirmCancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("admin.confirmDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={!!passwordTarget} onOpenChange={(open) => !open && setPasswordTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.changePassword")} — {passwordTarget?.username}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("admin.newPassword")}</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-input border-border"
                minLength={4}
                onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPasswordTarget(null)}>{t("admin.confirmCancel")}</Button>
              <Button onClick={handleChangePassword} disabled={newPassword.length < 4}>{t("admin.changePassword")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
};

export default AdminUsers;
