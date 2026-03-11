import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const vencendoParam = url.searchParams.get("vencendo_em_dias");

    let query = supabase
      .from("profissionais")
      .select("*")
      .order("data_vencimento_contrato", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    let result = data;

    // Filter by contracts expiring within N days if requested
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
      JSON.stringify({
        success: true,
        total: result.length,
        data: result,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error fetching profissionais:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
