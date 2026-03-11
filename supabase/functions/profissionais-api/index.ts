import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function validateDates(data_inicio: string, data_vencimento_contrato: string): string | null {
  const inicio = new Date(data_inicio);
  const vencimento = new Date(data_vencimento_contrato);

  if (isNaN(inicio.getTime())) return "Data de início inválida.";
  if (isNaN(vencimento.getTime())) return "Data de vencimento inválida.";

  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  if (inicio < tenYearsAgo) return "Data de início inválida.";

  if (vencimento < inicio)
    return "A data de vencimento do contrato deve ser posterior à data de início.";

  if (vencimento.getTime() === inicio.getTime())
    return "O contrato deve ter duração mínima de 1 dia.";

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // ── GET: list profissionais ────────────────────────────────────────────
    if (req.method === "GET") {
      const url = new URL(req.url);
      const vencendoParam = url.searchParams.get("vencendo_em_dias");

      const { data, error } = await supabase
        .from("profissionais")
        .select("*")
        .order("data_vencimento_contrato", { ascending: true });

      if (error) throw error;

      let result = data;

      if (vencendoParam) {
        const dias = parseInt(vencendoParam, 10);
        if (!isNaN(dias)) {
          const hoje = new Date();
          const limite = new Date();
          limite.setDate(hoje.getDate() + dias);
          result = data.filter((p: { data_vencimento_contrato: string }) => {
            const venc = new Date(p.data_vencimento_contrato);
            return venc >= hoje && venc <= limite;
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, total: result.length, data: result }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── POST: create profissional ──────────────────────────────────────────
    if (req.method === "POST") {
      const body = await req.json();
      const { nome_completo, email, cargo, data_inicio, data_vencimento_contrato, email_responsavel } = body;

      if (!nome_completo || !email || !cargo || !data_inicio || !data_vencimento_contrato || !email_responsavel) {
        return new Response(
          JSON.stringify({ success: false, error: "Todos os campos são obrigatórios." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const dateError = validateDates(data_inicio, data_vencimento_contrato);
      if (dateError) {
        return new Response(
          JSON.stringify({ success: false, error: dateError }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("profissionais")
        .insert([{ nome_completo, email, cargo, data_inicio, data_vencimento_contrato, email_responsavel }])
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── PUT: update profissional ───────────────────────────────────────────
    if (req.method === "PUT") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: "Parâmetro 'id' obrigatório." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const body = await req.json();
      const { data_inicio, data_vencimento_contrato } = body;

      if (data_inicio && data_vencimento_contrato) {
        const dateError = validateDates(data_inicio, data_vencimento_contrato);
        if (dateError) {
          return new Response(
            JSON.stringify({ success: false, error: dateError }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      const { data, error } = await supabase
        .from("profissionais")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
