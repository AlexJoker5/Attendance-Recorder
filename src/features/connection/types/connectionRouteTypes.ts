// Keep the existing Node-style response adapter alongside the Edge Response path.
export interface ConnectionRouteResponse {
  status: (code: number) => ConnectionRouteResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}
