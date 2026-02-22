import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RegionalProvider } from "@/contexts/RegionalContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import ScoutMatch from "./pages/ScoutMatch";
import Teams from "./pages/Teams";
import TeamProfile from "./pages/TeamProfile";
import MatchHistory from "./pages/MatchHistory";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import AllianceBuilder from "./pages/AllianceBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <RegionalProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/scout" element={<ProtectedRoute requireAuth><ScoutMatch /></ProtectedRoute>} />
                  <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                  <Route path="/teams/:teamNumber" element={<ProtectedRoute><TeamProfile /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><MatchHistory /></ProtectedRoute>} />
                  <Route path="/alliance" element={<ProtectedRoute><AllianceBuilder /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RegionalProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
