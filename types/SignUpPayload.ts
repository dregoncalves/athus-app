// Essa interface representa o envio de informações inicial no cadastro de usuário, ou seja, só os primeiros dados obrigatórios. A intenção é adicionar todo o resto com UPDATE depois de logado.
export interface SignUpPayload {
  nomeCompleto: string;
  email: string;
  senha: string;
}