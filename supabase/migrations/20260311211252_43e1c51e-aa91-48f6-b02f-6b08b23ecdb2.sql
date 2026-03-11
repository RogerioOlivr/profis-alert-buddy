
-- Create profissionais table
CREATE TABLE public.profissionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  cargo TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_vencimento_contrato DATE NOT NULL,
  email_responsavel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

-- Public read policy (needed for API/webhook integration)
CREATE POLICY "Public read access for profissionais"
  ON public.profissionais FOR SELECT USING (true);

-- Public insert policy
CREATE POLICY "Public insert access for profissionais"
  ON public.profissionais FOR INSERT WITH CHECK (true);

-- Public update policy
CREATE POLICY "Public update access for profissionais"
  ON public.profissionais FOR UPDATE USING (true);

-- Public delete policy
CREATE POLICY "Public delete access for profissionais"
  ON public.profissionais FOR DELETE USING (true);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profissionais_updated_at
  BEFORE UPDATE ON public.profissionais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
