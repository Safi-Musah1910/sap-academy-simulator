export const AUTH_COOKIE_NAME = "sap-academy-session";
export const AUTH_COOKIE_VALUE = "academy-demo-session";

export const demoCredentials = {
  username: "admin",
  password: "academy123",
};

export function isValidDemoLogin(username: string, password: string) {
  return username === demoCredentials.username && password === demoCredentials.password;
}
