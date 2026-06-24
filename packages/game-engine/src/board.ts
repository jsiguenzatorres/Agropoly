import type { BoardSpace } from './types'

export const BOARD_DATA: BoardSpace[] = [
  // ── CASILLA 0 — INICIO ────────────────────────────────
  { id: 0,  type: 'go',      group: -1, name: 'INICIO',                    price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },

  // ── GRUPO 0: OCCIDENTE I (morado #8B1A8B) — ×2 ───────
  { id: 1,  type: 'prop',    group: 0,  name: 'Agencia Ahuachapán',        price: 60,  rents: [2,10,30,90,160,250],   hcost: 50 },
  { id: 2,  type: 'cosecha', group: -1, name: 'Tarjeta Cosecha',           price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 3,  type: 'prop',    group: 0,  name: 'Agencia Atiquizaya',        price: 60,  rents: [4,20,60,180,320,450],  hcost: 50 },
  { id: 4,  type: 'tax',     group: -1, name: 'Impuesto Agrario ƒ200',     price: 200, rents: [0,0,0,0,0,0], hcost: 0 },

  // ── ESTACIÓN 5 — CANAL BFA OCCIDENTE ─────────────────
  { id: 5,  type: 'station', group: -1, name: 'Canal BFA Occidente',       price: 200, rents: [25,50,100,200,0,0],   hcost: 0 },

  // ── GRUPO 1: OCCIDENTE II (celeste #009FDF) — ×3 ─────
  { id: 6,  type: 'prop',    group: 1,  name: 'Agencia Chalchuapa',        price: 100, rents: [6,30,90,270,400,550],  hcost: 50 },
  { id: 7,  type: 'riesgo',  group: -1, name: 'Tarjeta Riesgo',            price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 8,  type: 'prop',    group: 1,  name: 'Agencia Metapán',           price: 100, rents: [6,30,90,270,400,550],  hcost: 50 },
  { id: 9,  type: 'prop',    group: 1,  name: 'Agencia Sonsonate',         price: 120, rents: [8,40,100,300,450,600], hcost: 50 },

  // ── CASILLA 10 — EMERGENCIA CLIMÁTICA (JAIL) ─────────
  { id: 10, type: 'jail',    group: -1, name: 'Emergencia Climática',      price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },

  // ── GRUPO 2: CENTRO NORTE (rosado #D6006E) — ×3 ──────
  { id: 11, type: 'prop',    group: 2,  name: 'Agencia Santa Tecla',       price: 140, rents: [10,50,150,450,625,750], hcost: 100 },

  // ── UTILIDAD 12 — SERVICIO BFA ───────────────────────
  { id: 12, type: 'utility', group: -1, name: 'Servicio BFA Agrícola',     price: 150, rents: [0,0,0,0,0,0], hcost: 0 },

  { id: 13, type: 'prop',    group: 2,  name: 'Agencia San Juan Opico',    price: 140, rents: [10,50,150,450,625,750], hcost: 100 },
  { id: 14, type: 'prop',    group: 2,  name: 'Agencia Chalatenango',      price: 160, rents: [12,60,180,500,700,900], hcost: 100 },

  // ── ESTACIÓN 15 — CANAL BFA CENTRO ───────────────────
  { id: 15, type: 'station', group: -1, name: 'Canal BFA Centro',          price: 200, rents: [25,50,100,200,0,0],   hcost: 0 },

  // ── GRUPO 3: PARACENTRAL (naranja #E8610C) — ×3 ──────
  { id: 16, type: 'prop',    group: 3,  name: 'Agencia Cojutepeque',       price: 180, rents: [14,70,200,550,750,950], hcost: 100 },
  { id: 17, type: 'cosecha', group: -1, name: 'Tarjeta Cosecha',           price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 18, type: 'prop',    group: 3,  name: 'Agencia Sensuntepeque',     price: 180, rents: [14,70,200,550,750,950], hcost: 100 },
  { id: 19, type: 'prop',    group: 3,  name: 'Agencia San Vicente',       price: 200, rents: [16,80,220,600,800,1000], hcost: 100 },

  // ── CASILLA 20 — FERIA DEL CAMPO (FREE PARKING) ──────
  { id: 20, type: 'free',    group: -1, name: 'Feria del Campo',           price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },

  // ── GRUPO 4: ORIENTE I (rojo #C0392B) — ×3 ──────────
  { id: 21, type: 'prop',    group: 4,  name: 'Agencia Usulután',          price: 220, rents: [18,90,250,700,875,1050], hcost: 150 },
  { id: 22, type: 'riesgo',  group: -1, name: 'Tarjeta Riesgo',            price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 23, type: 'prop',    group: 4,  name: 'Agencia Jucuapa',           price: 220, rents: [18,90,250,700,875,1050], hcost: 150 },
  { id: 24, type: 'prop',    group: 4,  name: 'Agencia Berlín',            price: 240, rents: [20,100,300,750,925,1100], hcost: 150 },

  // ── ESTACIÓN 25 — CANAL BFA ORIENTE ──────────────────
  { id: 25, type: 'station', group: -1, name: 'Canal BFA Oriente',         price: 200, rents: [25,50,100,200,0,0],   hcost: 0 },

  // ── GRUPO 5: ORIENTE II (amarillo #D4AC00) — ×3 ──────
  { id: 26, type: 'prop',    group: 5,  name: 'Agencia San Miguel',        price: 260, rents: [22,110,330,800,975,1150], hcost: 150 },
  { id: 27, type: 'prop',    group: 5,  name: 'Agencia Gotera',            price: 260, rents: [22,110,330,800,975,1150], hcost: 150 },

  // ── UTILIDAD 28 — SERVICIO BFA ───────────────────────
  { id: 28, type: 'utility', group: -1, name: 'Servicio BFA Ganadero',     price: 150, rents: [0,0,0,0,0,0], hcost: 0 },

  { id: 29, type: 'prop',    group: 5,  name: 'Agencia La Unión',          price: 280, rents: [24,120,360,850,1025,1200], hcost: 150 },

  // ── CASILLA 30 — IR A EMERGENCIA (GO TO JAIL) ────────
  { id: 30, type: 'gotojail', group: -1, name: 'Ir a Emergencia',          price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },

  // ── GRUPO 6: GRAN S.S. (verde oscuro #00913A) — ×3 ───
  { id: 31, type: 'prop',    group: 6,  name: 'Agencia Soyapango',         price: 300, rents: [26,130,390,900,1100,1275], hcost: 200 },
  { id: 32, type: 'prop',    group: 6,  name: 'Agencia Apopa',             price: 300, rents: [26,130,390,900,1100,1275], hcost: 200 },
  { id: 33, type: 'cosecha', group: -1, name: 'Tarjeta Cosecha',           price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 34, type: 'prop',    group: 6,  name: 'Agencia Ilopango',          price: 320, rents: [28,150,450,1000,1200,1400], hcost: 200 },

  // ── ESTACIÓN 35 — CANAL BFA GRAN S.S. ────────────────
  { id: 35, type: 'station', group: -1, name: 'Canal BFA Gran S.S.',       price: 200, rents: [25,50,100,200,0,0],   hcost: 0 },

  // ── RIESGO 36 ─────────────────────────────────────────
  { id: 36, type: 'riesgo',  group: -1, name: 'Tarjeta Riesgo',            price: 0,   rents: [0,0,0,0,0,0], hcost: 0 },

  // ── GRUPO 7: CASA MATRIZ (azul marino #00297A) — ×2 ──
  { id: 37, type: 'prop',    group: 7,  name: 'Agencia Centro Histórico',  price: 350, rents: [35,175,500,1100,1300,1500], hcost: 200 },
  { id: 38, type: 'tax',     group: -1, name: 'Impuesto de Lujo ƒ100',     price: 100, rents: [0,0,0,0,0,0], hcost: 0 },
  { id: 39, type: 'prop',    group: 7,  name: 'Agencia Av. Olímpica',      price: 400, rents: [50,200,600,1400,1700,2000], hcost: 200 },
]

export const GROUP_SIZES: Record<number, number> = { 0: 2, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2 }
export const STARTING_BALANCE = 1500
export const GO_AMOUNT = 200
export const JAIL_POSITION = 10
export const JAIL_FINE = 50
export const MAX_JAIL_TURNS = 3
export const MAX_BUILDINGS = 4
export const HOTEL_LEVEL = 5
