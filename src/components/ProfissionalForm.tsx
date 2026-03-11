import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User } from "lucide-react";

type Profissional = Tables<"profissionais">;

const TEN_YEARS_AGO = new Date();
TEN_YEARS_AGO.setFullYear(TEN_YEARS_AGO.getFullYear() - 10);

const schema = z
  .object({
    nome_completo: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(200),
    email: z.string().trim().email("Email inválido"),
    cargo: z.string().trim().min(2, "Cargo deve ter ao menos 2 caracteres").max(100),
    data_inicio: z
      .string()
      .min(1, "Data de início obrigatória")
      .refine((v) => {
        const d = new Date(v);
        return !isNaN(d.getTime()) && d >= TEN_YEARS_AGO;
      }, "Data de início inválida."),
    data_vencimento_contrato: z.string().min(1, "Data de vencimento obrigatória"),
    email_responsavel: z.string().trim().email("Email do responsável inválido"),
  })
  .superRefine((data, ctx) => {
    if (!data.data_inicio || !data.data_vencimento_contrato) return;
    const inicio = new Date(data.data_inicio);
    const vencimento = new Date(data.data_vencimento_contrato);
    if (isNaN(inicio.getTime()) || isNaN(vencimento.getTime())) return;

    if (vencimento < inicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data de vencimento do contrato deve ser posterior à data de início.",
        path: ["data_vencimento_contrato"],
      });
    } else if (vencimento.getTime() === inicio.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O contrato deve ter duração mínima de 1 dia.",
        path: ["data_vencimento_contrato"],
      });
    }
  });

type FormValues = {
  nome_completo: string;
  email: string;
  cargo: string;
  data_inicio: string;
  data_vencimento_contrato: string;
  email_responsavel: string;
};

interface Props {
  profissional: Profissional | null;
  onBack: () => void;
  onSuccess: () => void;
}

const ProfissionalForm = ({ profissional, onBack, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!profissional;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profissional) {
      reset({
        nome_completo: profissional.nome_completo,
        email: profissional.email,
        cargo: profissional.cargo,
        data_inicio: profissional.data_inicio,
        data_vencimento_contrato: profissional.data_vencimento_contrato,
        email_responsavel: profissional.email_responsavel,
      });
    } else {
      reset({
        nome_completo: "",
        email: "",
        cargo: "",
        data_inicio: "",
        data_vencimento_contrato: "",
        email_responsavel: "",
      });
    }
  }, [profissional, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEditing && profissional) {
        const { error } = await supabase
          .from("profissionais")
          .update(values)
          .eq("id", profissional.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profissionais").insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profissionais"] });
      toast({
        title: isEditing
          ? "Profissional atualizado com sucesso!"
          : "Profissional cadastrado com sucesso!",
      });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Erro ao salvar. Tente novamente.", variant: "destructive" });
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Card */}
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        {/* Card header */}
        <div className="gradient-hero px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-primary-foreground text-lg">
              {isEditing ? "Editar Profissional" : "Novo Profissional"}
            </h2>
            <p className="text-primary-foreground/70 text-xs">
              {isEditing ? "Atualize os dados do profissional" : "Preencha os dados para cadastrar"}
            </p>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                placeholder="Ex: João da Silva"
                {...register("nome_completo")}
              />
              {errors.nome_completo && (
                <p className="text-xs text-destructive">{errors.nome_completo.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="profissional@empresa.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Cargo */}
            <div className="space-y-1.5">
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                id="cargo"
                placeholder="Ex: Desenvolvedor Sênior"
                {...register("cargo")}
              />
              {errors.cargo && (
                <p className="text-xs text-destructive">{errors.cargo.message}</p>
              )}
            </div>

            {/* Data Início */}
            <div className="space-y-1.5">
              <Label htmlFor="data_inicio">Data de Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                {...register("data_inicio")}
              />
              {errors.data_inicio && (
                <p className="text-xs text-destructive">{errors.data_inicio.message}</p>
              )}
            </div>

            {/* Data Vencimento */}
            <div className="space-y-1.5">
              <Label htmlFor="data_vencimento_contrato">Data de Vencimento do Contrato *</Label>
              <Input
                id="data_vencimento_contrato"
                type="date"
                {...register("data_vencimento_contrato")}
              />
              {errors.data_vencimento_contrato && (
                <p className="text-xs text-destructive">{errors.data_vencimento_contrato.message}</p>
              )}
            </div>

            {/* Email Responsável */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="email_responsavel">Email do Responsável *</Label>
              <Input
                id="email_responsavel"
                type="email"
                placeholder="responsavel@empresa.com"
                {...register("email_responsavel")}
              />
              {errors.email_responsavel && (
                <p className="text-xs text-destructive">{errors.email_responsavel.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfissionalForm;
