// API client for Historias del Campo BFA.
// Always sends credentials: 'include' so the admin httpOnly cookie travels
// across the dev origin boundary (web :5173 ↔ server :2567).

export interface Historia {
  mascotaId:        string
  nombre:           string
  rubro:            string
  zona:             string
  saludo:           string
  origen:           string
  rubroDescripcion: string
  rubroStatLabel:   string
  rubroStatValue:   string
  rubroStatNote:    string
  desafios:         string[]
  bfaProducto:      string
  bfaDescripcion:   string
  retoJugador:      string
  pendingReview:    boolean
}

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:2567') + '/api/historias'

const fetchOpts: RequestInit = { credentials: 'include' }

export async function listHistorias(): Promise<Historia[]> {
  const res = await fetch(API_URL, fetchOpts)
  if (!res.ok) throw new Error(`list failed: ${res.status}`)
  const data = await res.json() as { historias: Historia[] }
  return data.historias
}

export async function getHistoria(mascotaId: string): Promise<Historia> {
  const res = await fetch(`${API_URL}/${mascotaId}`, fetchOpts)
  if (!res.ok) throw new Error(`get failed: ${res.status}`)
  return res.json() as Promise<Historia>
}

export async function adminLogin(password: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/admin/login`, {
    ...fetchOpts,
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ password }),
  })
  return res.ok
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_URL}/admin/logout`, { ...fetchOpts, method: 'POST' })
}

export async function adminMe(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/admin/me`, fetchOpts)
    if (!res.ok) return false
    const data = await res.json() as { authenticated: boolean }
    return data.authenticated
  } catch { return false }
}

export async function adminUpdateHistoria(h: Historia): Promise<boolean> {
  const res = await fetch(`${API_URL}/${h.mascotaId}`, {
    ...fetchOpts,
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(h),
  })
  return res.ok
}
