import { Component, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// ── Global error boundary — prevents white/black screens on uncaught errors ──
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, message: err?.message ?? "Unknown error" };
  }

  componentDidCatch(err: Error, info: any) {
    console.error("[AppErrorBoundary]", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0c0d10",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Outfit', sans-serif",
            color: "#f0ede8",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem" }}>⚡</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFFFFF" }}>
            IAZR — Error inesperado
          </h1>
          <p style={{ color: "rgba(240,237,232,0.5)", maxWidth: "480px" }}>
            {this.state.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              background: "#FFFFFF",
              color: "#000",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <AppErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AppErrorBoundary>
);

export default App;
