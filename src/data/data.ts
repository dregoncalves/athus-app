import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
  title: string;
  titleColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../../assets/animations/Lottie1.json"),
    title: "Encontre quem faz na sua quebrada!",
    titleColor: "#3B2C00",
    text: "Aqui você descobre profissionais da sua área, gente que trabalha duro e tá pronta pra somar com você.",
    textColor: "#A88923",
    backgroundColor: "#FFF6D1",
  },
  {
    id: 2,
    animation: require("../../assets/animations/Lottie2.json"),
    title: "Contrate com segurança",
    titleColor: "#3A2B28",
    text: "Avaliações e perfis ajudam você a fazer a escolha certa com confiança.",
    textColor: "#B75C30",
    backgroundColor: "#E8D7C0",
  },
  {
    id: 3,
    animation: require("../../assets/animations/Lottie3.json"),
    title: "Fortaleça o corre de quem é da base!",
    titleColor: "#4B2E2B",
    text: "Dê moral pra quem rala todo dia. Sua escolha movimenta a economia da quebrada.",
    textColor: "#B9573C",
    backgroundColor: "#FBE5D9",
  },
];

export default data;
