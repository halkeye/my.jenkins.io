import { JENKINS_URL } from "../const";

export const getInstanceUrl = (): string | null => {
  return localStorage.getItem(JENKINS_URL);
};
