import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RegionalContextType {
  regional: string;
  setRegional: (regional: string) => void;
  regionals: string[];
  addRegional: (name: string) => void;
  removeRegional: (name: string) => void;
  isLoadingRegionals: boolean;
}

const RegionalContext = createContext<RegionalContextType | undefined>(undefined);

const ACTIVE_KEY = "bobcats_active_regional";

export const RegionalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [regionals, setRegionals] = useState<string[]>([]);
  const [regional, setRegionalState] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_KEY) || "";
  });
  const [isLoadingRegionals, setIsLoadingRegionals] = useState(false);

  useEffect(() => {
    if (user?.teamNumber) {
      fetchRegionals(user.teamNumber);
    } else {
      setRegionals([]);
    }
  }, [user?.teamNumber]);

  const fetchRegionals = async (teamNumber: string) => {
    setIsLoadingRegionals(true);
    const { data } = await supabase
      .from("regionals" as any)
      .select("name")
      .eq("team_number", teamNumber)
      .order("created_at", { ascending: true });

    if (data) {
      setRegionals((data as any[]).map((r) => r.name));
    }
    setIsLoadingRegionals(false);
  };

  const setRegional = (r: string) => {
    setRegionalState(r);
    localStorage.setItem(ACTIVE_KEY, r);
  };

  const addRegional = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || !user?.teamNumber || regionals.includes(trimmed)) return;

    const { error } = await supabase
      .from("regionals" as any)
      .insert({ team_number: user.teamNumber, name: trimmed });

    if (!error) {
      setRegionals((prev) => [...prev, trimmed]);
      setRegional(trimmed);
    }
  };

  const removeRegional = async (name: string) => {
    if (!user?.teamNumber) return;

    const { error } = await supabase
      .from("regionals" as any)
      .delete()
      .eq("team_number", user.teamNumber)
      .eq("name", name);

    if (!error) {
      setRegionals((prev) => prev.filter((r) => r !== name));
      if (regional === name) {
        const remaining = regionals.filter((r) => r !== name);
        setRegional(remaining[0] || "");
      }
    }
  };

  return (
    <RegionalContext.Provider value={{ regional, setRegional, regionals, addRegional, removeRegional, isLoadingRegionals }}>
      {children}
    </RegionalContext.Provider>
  );
};

export const useRegional = () => {
  const ctx = useContext(RegionalContext);
  if (!ctx) throw new Error("useRegional must be used within RegionalProvider");
  return ctx;
};
