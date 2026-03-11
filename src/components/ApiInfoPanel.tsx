import { useState } from "react";
import { Copy, Check, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = "https://kqhdcrhozazusjffbzhb.supabase.co/functions/v1/profissionais-api";

const ApiInfoPanel = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      key: "all",
      label: "Todos os profissionais",
      method: "GET",
      url: API_BASE,
      description: "Retorna todos os profissionais cadastrados.",
    },
    {
      key: "vencendo",
      label: "Contratos vencendo em 30 dias",
      method: "GET",
      url: `${API_BASE}?vencendo_em_dias=30`,
      description: "Filtra contratos que vencem nos próximos N dias. Ideal para automações de alerta.",
    },
  ];

  return (
    <div className="bg-card border rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b bg-muted/30 flex items-center gap-2">
        <Code2 className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          API para Integração Externa
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          Endpoint público · sem autenticação
        </span>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Use estes endpoints em automações (n8n, Zapier, Make, etc.) para consultar contratos e disparar alertas de vencimento.
        </p>
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.key} className="rounded-lg border bg-background p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-accent border border-border px-1.5 py-0.5 rounded">
                  {ep.method}
                </span>
                <span className="text-sm font-medium text-foreground">{ep.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ep.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded border font-mono text-foreground truncate">
                  {ep.url}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => copy(ep.url, ep.key)}
                >
                  {copied === ep.key ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </Button>
                <a href={ep.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-accent border border-accent-foreground/10 p-3">
          <p className="text-xs text-accent-foreground font-medium mb-1">Exemplo de resposta</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto">{`{
  "success": true,
  "total": 3,
  "data": [
    {
      "id": "uuid",
      "nome_completo": "João da Silva",
      "cargo": "Analista",
      "data_vencimento_contrato": "2026-04-01",
      "email_responsavel": "rh@empresa.com",
      ...
    }
  ]
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default ApiInfoPanel;
