export const JENKINS_URL = "hassUrl";
export const DEFAULT_JENKINS_URL = "http://localhost:8080";

export type ParamType = "url" | "string";

export interface Redirect {
  redirect: string;
  deprecated?: boolean;
  name: string;
  badge?: string;
  description: string;
  introduced: string;
  component?: string;
  params?: {
    [key: string]: ParamType;
  };
}
