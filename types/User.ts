// Os campos com | null são opcionais, eles não fazem parte dos dados iniciais obrigatórios (nome, email e senha).
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  pais?: string | null;
  estado?: string | null;
  cidade?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero?: number | null;
  apartamento?: number | null;
  logradouro?: string | null;
  imagemPerfil?: string | null;
  ativo: boolean;
  prestadorServico: boolean;
}