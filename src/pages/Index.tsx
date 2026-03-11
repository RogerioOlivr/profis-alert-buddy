import { useState } from "react";
import ProfissionaisList from "@/components/ProfissionaisList";
import ProfissionalForm from "@/components/ProfissionalForm";
import type { Tables } from "@/integrations/supabase/types";

type Profissional = Tables<"profissionais">;
type ViewMode = "list" | "add" | "edit";

const Index = () => {
  const [view, setView] = useState<ViewMode>("list");
  const [editingProfissional, setEditingProfissional] = useState<Profissional | null>(null);

  const handleAdd = () => {
    setEditingProfissional(null);
    setView("add");
  };

  const handleEdit = (profissional: Profissional) => {
    setEditingProfissional(profissional);
    setView("edit");
  };

  const handleBack = () => {
    setEditingProfissional(null);
    setView("list");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-primary-foreground">
                  Gestão de Profissionais
                </h1>
                <p className="text-primary-foreground/70 text-xs">
                  Cadastro e controle de contratos
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "list" && (
          <ProfissionaisList onAdd={handleAdd} onEdit={handleEdit} />
        )}
        {(view === "add" || view === "edit") && (
          <ProfissionalForm
            profissional={editingProfissional}
            onBack={handleBack}
            onSuccess={handleBack}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
