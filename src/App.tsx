
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ElectionProvider } from "@/contexts/ElectionContext";
import AppLayout from "@/components/layout/AppLayout";
import IndexPage from "./pages/IndexPage";
import CreateElectionPage from "./pages/CreateElectionPage";
import ElectionDetailPage from "./pages/ElectionDetailPage";
import ResultsPage from "./pages/ResultsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ElectionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <AppLayout>
                  <IndexPage />
                </AppLayout>
              }
            />
            <Route
              path="/create"
              element={
                <AppLayout>
                  <CreateElectionPage />
                </AppLayout>
              }
            />
            <Route
              path="/election/:electionId"
              element={
                <AppLayout>
                  <ElectionDetailPage />
                </AppLayout>
              }
            />
            <Route
              path="/results"
              element={
                <AppLayout>
                  <ResultsPage />
                </AppLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ElectionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
