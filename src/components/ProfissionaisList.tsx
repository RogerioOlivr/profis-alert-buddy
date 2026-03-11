import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, AlertTriangle, Pencil, Trash2, Calendar } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type Profissional = Tables<"profissionais">;

interface Props {
  onAdd: () => void;
  onEdit: (p: Profissional) => void;
}

const getContractStatus = (dataVencimento: string) => {
  const days = differenceInDays(parseISO(dataVencimento), new Date());
  if (days < 0) return { label: "Vencido", variant: "destructive" as const, days };
  if (days <= 30) return { label: `Vence em ${days}d`, variant: "warning" as const, days };
  if (days <= 60) return { label: `Vence em ${days}d`, variant: "secondary" as const, days };
  return { label: "Ativo", variant: "success" as const, days };
};

const ProfissionaisList = ({ onAdd, onEdit }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterVencendo, setFilterVencendo] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: profissionais = [], isLoading } = useQuery({
    queryKey: ["profissionais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profissionais")
        .select("*")
        .order("nome_completo");
      if (error) throw error;
      return data as Profissional[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profissionais").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profissionais"] });
      toast({ title: "Profissional excluído com sucesso." });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir.", variant: "destructive" });
    },
  });

  const filtered = profissionais.filter((p) => {
    const matchSearch = p.nome_completo.toLowerCase().includes(search.toLowerCase());
    const status = getContractStatus(p.data_vencimento_contrato);
    const matchFilter = filterVencendo ? status.days <= 30 : true;
    return matchSearch && matchFilter;
  });

  const vencendoCount = profissionais.filter(
    (p) => getContractStatus(p.data_vencimento_contrato).days <= 30
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Profissionais
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profissionais.length} cadastrado{profissionais.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={onAdd} className="gap-2 shadow-elevated">
          <PlusCircle className="w-4 h-4" />
          Novo Profissional
        </Button>
      </div>

      {/* Alert for expiring contracts */}
      {vencendoCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{vencendoCount} contrato{vencendoCount !== 1 ? "s" : ""}</span>{" "}
            {vencendoCount !== 1 ? "estão" : "está"} vencendo nos próximos 30 dias.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={() => setFilterVencendo(!filterVencendo)}
          >
            {filterVencendo ? "Ver todos" : "Ver somente esses"}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={filterVencendo ? "default" : "outline"}
          className="gap-2 shrink-0"
          onClick={() => setFilterVencendo(!filterVencendo)}
        >
          <Calendar className="w-4 h-4" />
          Próximos do vencimento
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Nenhum profissional encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || filterVencendo
                ? "Tente ajustar os filtros de busca."
                : "Clique em 'Novo Profissional' para começar."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold text-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-foreground">Cargo</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Início</TableHead>
                <TableHead className="font-semibold text-foreground">Vencimento</TableHead>
                <TableHead className="font-semibold text-foreground hidden lg:table-cell">Responsável</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const status = getContractStatus(p.data_vencimento_contrato);
                return (
                  <TableRow key={p.id} className="group hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{p.nome_completo}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{p.cargo}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {format(parseISO(p.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-foreground">
                          {format(parseISO(p.data_vencimento_contrato), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <ContractBadge status={status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                      {p.email_responsavel}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => onEdit(p)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cadastro será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ContractBadge = ({
  status,
}: {
  status: { label: string; variant: "destructive" | "warning" | "secondary" | "success" };
}) => {
  const classes: Record<string, string> = {
    destructive: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    secondary: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${classes[status.variant]}`}
    >
      {status.label}
    </span>
  );
};

export default ProfissionaisList;
