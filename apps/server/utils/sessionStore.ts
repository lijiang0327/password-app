const store: Record<string, string> = {};

export const setSession = (key: string, value: string) => {
  store[key] = value;
}

export const getSession = (key: string): string | undefined => {
  return store[key];
}