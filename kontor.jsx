import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Droplet, Wheat, Pickaxe, Fuel, Package, Layers, Beaker, Cookie, Wrench,
  GlassWater, Wallet, Plus, X, Play, RotateCw, Trash2, ChevronDown, ChevronRight,
  Building2, Factory, Store, Landmark, Check, AlertCircle, Repeat, TrendingUp,
  TrendingDown, PiggyBank, Coins, FileText, Truck, ShoppingCart, Award, Clock,
  ChevronsUp, Banknote, Target, CheckCircle2, Circle, Trophy, Users, HardHat,
  GraduationCap, UserPlus, UserMinus, Sun, Wind, Flame, BatteryCharging, Zap, Moon,
  Plug, Map, MapPin, Lock, Ship, Anchor, ArrowRight,
  Mountain, TreePine, Hexagon, Square, SquareStack, Cable, CircuitBoard, Sofa, Watch, Wine, Car, Gem,
  Blocks, Frame, Construction, Hammer,
} from "lucide-react";

/* ------------------------------------------------------------------ palette */
const C = {
  bg: "#0B1420", panel: "#132132", panel2: "#182B40", raise: "#1E3350",
  line: "rgba(255,255,255,0.07)", line2: "rgba(255,255,255,0.14)",
  text: "#EAF1FA", muted: "#8DA2BC", faint: "#5B7089",
  gold: "#F2B441", goldDim: "#9E7526", teal: "#2FD4C4",
  rose: "#FB7185", green: "#57DA8A", blue: "#5AA9F2", sea: "#0E1D2E",
};

/* ------------------------------------------------------------------ data */
const PRODUCTS = {
  water:   { id:"water",   name:"Wasser",     tier:0, Icon:Droplet,    color:"#40BEF2", building:"Wasserwerk",     time:5,  out:10, buildCost:250,  base:2,  eq:400, demand:22, elast:0.55, op:6,  inputs:{} },
  grain:   { id:"grain",   name:"Getreide",   tier:0, Icon:Wheat,      color:"#F2B441", building:"Farm",           time:8,  out:8,  buildCost:350,  base:3,  eq:340, demand:18, elast:0.55, op:9,  inputs:{} },
  ore:     { id:"ore",     name:"Eisenerz",   tier:0, Icon:Pickaxe,    color:"#9AB0C7", building:"Mine",           time:10, out:6,  buildCost:450,  base:4,  eq:300, demand:15, elast:0.60, op:14, inputs:{} },
  oil:     { id:"oil",     name:"Rohöl",      tier:0, Icon:Fuel,       color:"#A78BFA", building:"Bohrturm",       time:12, out:5,  buildCost:550,  base:5,  eq:260, demand:12, elast:0.60, op:18, inputs:{} },
  flour:   { id:"flour",   name:"Mehl",       tier:1, Icon:Package,    color:"#D9C08C", building:"Mühle",          time:12, out:5,  buildCost:850,  base:8,  eq:200, demand:9,  elast:0.65, op:12, inputs:{ grain:5 } },
  steel:   { id:"steel",   name:"Stahl",      tier:1, Icon:Layers,     color:"#84A6C4", building:"Stahlwerk",      time:15, out:4,  buildCost:1100, base:12, eq:170, demand:7,  elast:0.70, op:18, inputs:{ ore:4 } },
  plastic: { id:"plastic", name:"Kunststoff", tier:1, Icon:Beaker,     color:"#34D399", building:"Kunststoffwerk", time:15, out:4,  buildCost:1250, base:14, eq:160, demand:6.5,elast:0.70, op:20, inputs:{ oil:3 } },
  bread:   { id:"bread",   name:"Brot",       tier:2, Icon:Cookie,     color:"#E8A15C", building:"Bäckerei",       time:18, out:4,  buildCost:1600, base:22, eq:130, demand:6,  elast:0.80, op:14, inputs:{ flour:3, water:2 } },
  tools:   { id:"tools",   name:"Werkzeug",   tier:2, Icon:Wrench,     color:"#93C5FD", building:"Werkzeugfabrik", time:20, out:3,  buildCost:1900, base:30, eq:100, demand:4,  elast:0.85, op:16, inputs:{ steel:3 } },
  bottle:  { id:"bottle",  name:"Flasche",    tier:2, Icon:GlassWater, color:"#5EEAD4", building:"Abfüllanlage",   time:18, out:4,  buildCost:1700, base:28, eq:110, demand:4.5,elast:0.80, op:14, inputs:{ plastic:2, water:3 } },
  sand:    { id:"sand",    name:"Sand",       tier:0, Icon:Mountain,   color:"#E3C878", building:"Sandgrube",      time:6,  out:9,  buildCost:300,  base:2,  eq:380, demand:20, elast:0.55, op:7,  inputs:{} },
  wood:    { id:"wood",    name:"Holz",       tier:0, Icon:TreePine,   color:"#B07D4F", building:"Forst",          time:9,  out:7,  buildCost:400,  base:3,  eq:320, demand:16, elast:0.55, op:10, inputs:{} },
  copperore:{id:"copperore",name:"Kupfererz", tier:0, Icon:Hexagon,    color:"#C87A4B", building:"Kupfermine",     time:11, out:5,  buildCost:500,  base:6,  eq:280, demand:13, elast:0.60, op:16, inputs:{} },
  gold:    { id:"gold",    name:"Gold",       tier:0, Icon:Coins,      color:"#F2C14E", building:"Goldmine",       time:16, out:2,  buildCost:900,  base:40, eq:120, demand:5,  elast:0.70, op:30, inputs:{} },
  glass:   { id:"glass",   name:"Glas",       tier:1, Icon:Square,     color:"#A7D8E8", building:"Glashütte",      time:13, out:4,  buildCost:900,  base:10, eq:180, demand:8,  elast:0.65, op:13, inputs:{ sand:4 } },
  planks:  { id:"planks",  name:"Bretter",    tier:1, Icon:SquareStack,color:"#C89B6B", building:"Sägewerk",       time:12, out:5,  buildCost:800,  base:9,  eq:190, demand:8,  elast:0.65, op:12, inputs:{ wood:4 } },
  wire:    { id:"wire",    name:"Kupferdraht",tier:1, Icon:Cable,      color:"#E08A5B", building:"Drahtzieherei",  time:14, out:4,  buildCost:1150, base:16, eq:160, demand:6.5,elast:0.70, op:18, inputs:{ copperore:3 } },
  electronics:{id:"electronics",name:"Elektronik",tier:2, Icon:CircuitBoard,color:"#6EE7B7", building:"Elektronikfabrik", time:22, out:3, buildCost:2200, base:55, eq:80, demand:3.5,elast:0.85, op:24, inputs:{ wire:2, plastic:2, glass:1 } },
  furniture:{id:"furniture",name:"Möbel",     tier:2, Icon:Sofa,       color:"#C9A27E", building:"Möbelmanufaktur",time:20, out:3,  buildCost:1800, base:48, eq:85,  demand:3.8,elast:0.85, op:20, inputs:{ planks:3, tools:1 } },
  watch:   { id:"watch",   name:"Chronometer",tier:3, Icon:Watch,      color:"#D4AF37", building:"Uhrmanufaktur",  time:45, out:1,  buildCost:3200, base:160,eq:40,  demand:1.6,elast:0.95, op:40, inputs:{ steel:2, glass:2, tools:1 } },
  spirits: { id:"spirits", name:"Edelbrand",  tier:3, Icon:Wine,       color:"#C0653A", building:"Brennerei",      time:90, out:2,  buildCost:2600, base:130,eq:55,  demand:2.2,elast:0.90, op:30, inputs:{ grain:4, water:3, bottle:1 } },
  automobile:{id:"automobile",name:"Automobil",tier:3, Icon:Car,       color:"#7FB3F2", building:"Autowerk",       time:70, out:1,  buildCost:4500, base:420,eq:26,  demand:1.1,elast:1.00, op:55, inputs:{ steel:3, tools:2, electronics:1 } },
  jewelry: { id:"jewelry", name:"Schmuck",    tier:3, Icon:Gem,        color:"#F5A9D0", building:"Goldschmiede",   time:55, out:1,  buildCost:3800, base:320,eq:30,  demand:1.2,elast:1.00, op:45, inputs:{ gold:2, glass:1 } },
  steelbeam:{id:"steelbeam",name:"Stahlträger",tier:1, Icon:Construction, color:"#9FB3C8", building:"Walzwerk",       time:12, out:4,  buildCost:950,  base:20, eq:150, demand:6,  elast:0.70, op:14, inputs:{ steel:2 } },
  bricks:  { id:"bricks",  name:"Ziegel",     tier:1, Icon:Blocks,     color:"#C56B4A", building:"Ziegelei",       time:10, out:8,  buildCost:600,  base:3,  eq:260, demand:14, elast:0.60, op:9,  inputs:{ sand:3 } },
  windows: { id:"windows", name:"Fenster",    tier:1, Icon:Frame,      color:"#A7D8E8", building:"Fensterfabrik",  time:12, out:4,  buildCost:950,  base:18, eq:150, demand:6,  elast:0.70, op:13, inputs:{ glass:2 } },
};
const PLIST = Object.values(PRODUCTS);
const TIER_LABEL = ["Rohstoffe", "Zwischenprodukte", "Endprodukte", "Spitzenprodukte"];
const FOCI = ["Rohstoffe", "Verarbeitung", "Konsumgüter", "Allgemein"];
const RIVALS = ["Nordwerk AG", "Hansa Kontor", "Baltschmidt & Sohn", "Ostsee Rohstoff", "Fördewerke", "Kieler Union", "Bornholm Trading"];
const CLIENTS = ["Reederei Voss", "Lübecker Handel", "Kanal-Logistik", "Marktgilde Nord", "Werft Holm", "Kontor Süd", "Fehmarn Retail"];

/* cities — real German cities projected onto a Germany map */
const HOME = "luebeck";
const GEO = { lonMin: 5.6, lonMax: 15.2, latMin: 47.1, latMax: 55.1 };
const projX = (lon) => (lon - GEO.lonMin) / (GEO.lonMax - GEO.lonMin);
const projY = (lat) => (GEO.latMax - lat) / (GEO.latMax - GEO.latMin);
const ASPECT = 0.746; // map width/height for distance & viewBox
const CITY_DEF = {
  luebeck:   { name:"Lübeck",    short:"LÜ", lon:10.69, lat:53.87, unlockCost:0,     spec:"Hansekontor · leichtes Plus auf Endprodukte" },
  hamburg:   { name:"Hamburg",   short:"HH", lon:9.99,  lat:53.55, unlockCost:3500,  spec:"Großer Hafen · hohe Nachfrage nach Endprodukten" },
  kiel:      { name:"Kiel",      short:"KI", lon:10.14, lat:54.32, unlockCost:4500,  spec:"Werftstadt · zahlt viel für Stahl & Werkzeug" },
  bremen:    { name:"Bremen",    short:"HB", lon:8.80,  lat:53.08, unlockCost:6000,  spec:"Handelshafen · gute Preise für Endprodukte" },
  rostock:   { name:"Rostock",   short:"RO", lon:12.14, lat:54.09, unlockCost:6500,  spec:"Rohstoffhafen · günstige Rohstoffe" },
  hannover:  { name:"Hannover",  short:"H",  lon:9.73,  lat:52.37, unlockCost:9000,  spec:"Messezentrum · tiefer, ausgeglichener Markt" },
  leipzig:   { name:"Leipzig",   short:"L",  lon:12.37, lat:51.34, unlockCost:11000, spec:"Osten · günstige Rohstoffe, wachsend" },
  berlin:    { name:"Berlin",    short:"B",  lon:13.40, lat:52.52, unlockCost:12000, spec:"Metropole · riesiger Konsummarkt, Premiumpreise" },
  dortmund:  { name:"Dortmund",  short:"DO", lon:7.47,  lat:51.51, unlockCost:15000, spec:"Ruhrgebiet · billiges Erz, hoher Stahl-/Werkzeugbedarf" },
  frankfurt: { name:"Frankfurt", short:"F",  lon:8.68,  lat:50.11, unlockCost:17000, spec:"Handelsdrehkreuz · durchweg hohe Preise" },
  stuttgart: { name:"Stuttgart", short:"S",  lon:9.18,  lat:48.78, unlockCost:22000, spec:"Maschinen & Automobil · Spitzenpreise für Werkzeug & Stahl" },
  muenchen:  { name:"München",   short:"M",  lon:11.58, lat:48.14, unlockCost:26000, spec:"Premiummarkt · Spitzenpreise für Konsumgüter" },
};
const CITIES = {};
for (const [id, c] of Object.entries(CITY_DEF)) CITIES[id] = { id, ...c, x: projX(c.lon), y: projY(c.lat) };
const CLIST = Object.values(CITIES);

// simplified Germany border outline as [lon, lat] points
const DE_OUTLINE = [
  [8.3,55.0],[8.6,54.4],[9.0,54.8],[9.9,54.5],[10.2,54.4],[11.0,54.4],[11.4,54.0],[12.1,54.2],[12.6,54.5],[13.4,54.1],[14.2,53.9],
  [14.4,53.3],[14.15,52.95],[14.6,52.6],[14.75,52.1],[14.6,51.8],[15.03,51.3],
  [14.9,51.0],[14.3,51.0],[13.5,50.7],[12.95,50.4],[12.3,50.2],[12.1,50.3],[12.5,49.9],[13.0,49.3],[13.5,48.9],[13.8,48.6],
  [13.0,48.3],[12.9,47.7],[12.2,47.7],[11.6,47.6],[10.9,47.5],[10.4,47.6],[10.2,47.4],
  [9.6,47.6],[8.9,47.7],[8.4,47.7],[7.7,47.6],
  [7.6,48.2],[8.1,48.8],[8.2,49.0],[7.4,49.15],[6.9,49.2],[6.35,49.5],
  [6.15,49.9],[6.4,50.3],[6.0,50.75],
  [6.05,51.2],[6.2,51.5],[6.9,51.9],[6.7,52.4],[7.05,52.5],[7.2,53.3],
  [8.1,53.5],[8.5,53.6],[8.3,54.0],[8.9,53.9],[8.5,54.4],[8.6,54.9],
];

function cityFactor(cid, p) {
  let bias = 1, depth = 1; const t = p.tier, id = p.id;
  switch (cid) {
    case "luebeck":   if (t === 2) bias = 1.05; if (t === 3) bias = 1.08; break;
    case "hamburg":   if (t === 2) { bias = 1.28; depth = 1.5; } if (t === 0) bias = 1.05; if (t === 3) bias = 1.12; break;
    case "kiel":      if (id === "ore") bias = 0.85; if (id === "steel" || id === "tools") { bias = 1.32; depth = 1.3; } break;
    case "bremen":    if (t === 2) { bias = 1.16; depth = 1.3; } if (t === 0) bias = 1.03; break;
    case "rostock":   if (t === 0) { bias = 0.74; depth = 1.6; } else if (t === 2) bias = 1.06; break;
    case "hannover":  depth = 1.25; if (t === 2) bias = 1.08; break;
    case "leipzig":   if (t === 0) { bias = 0.82; depth = 1.2; } else if (t === 1) bias = 1.05; break;
    case "berlin":    if (id === "bread" || id === "bottle") bias = 1.35; if (t === 2) { bias = Math.max(bias, 1.2); depth = 1.6; } if (t === 3) { bias = 1.38; depth = 1.4; } break;
    case "dortmund":  if (id === "ore" || id === "copperore") { bias = 0.72; depth = 1.5; } if (id === "steel" || id === "tools") { bias = 1.35; depth = 1.4; } break;
    case "frankfurt": bias = 1.10; if (t === 2) { bias = 1.2; depth = 1.3; } if (id === "electronics") bias = 1.24; if (t === 3) { bias = 1.42; depth = 1.3; } break;
    case "stuttgart": if (id === "tools") { bias = 1.5; depth = 1.4; } else if (id === "steel") bias = 1.3; else if (id === "electronics") { bias = 1.28; depth = 1.3; } else if (id === "automobile") { bias = 1.55; depth = 1.5; } else if (t === 3) bias = 1.2; else if (t === 2) bias = 1.1; break;
    case "muenchen":  if (id === "bread" || id === "bottle" || id === "tools") { bias = 1.45; depth = 1.2; } else if (t === 3) { bias = 1.42; depth = 1.3; } else bias = 1.12; break;
    default: break;
  }
  return { base: p.base * bias, eq: p.eq * depth, demand: p.demand, elast: p.elast };
}
const CITY_PP = {};
for (const cid of Object.keys(CITIES)) { CITY_PP[cid] = {}; for (const p of PLIST) CITY_PP[cid][p.id] = cityFactor(cid, p); }

const dist01 = (a, b) => Math.hypot((CITIES[a].x - CITIES[b].x) * ASPECT, CITIES[a].y - CITIES[b].y);
const shipKm = (a, b) => Math.round(dist01(a, b) * 520);
const shipTime = (a, b) => Math.round(12 + dist01(a, b) * 95);
const shipCost = (a, b, qty) => Math.round(6 + qty * dist01(a, b) * 0.9);

/* power plants */
const POWER = {
  solar:   { id:"solar",   kind:"solar",   name:"Solar",    building:"Photovoltaik",     Icon:Sun,             color:"#F2B441", cap:30, buildCost:1400, staff:1 },
  wind:    { id:"wind",    kind:"wind",    name:"Wind",     building:"Windrad",          Icon:Wind,            color:"#5EEAD4", cap:26, buildCost:1600, staff:1 },
  gas:     { id:"gas",     kind:"gas",     name:"Gas",      building:"Gaskraftwerk",     Icon:Flame,           color:"#FB7185", cap:45, buildCost:2200, staff:2, oilPerKW:0.01 },
  battery: { id:"battery", kind:"battery", name:"Speicher", building:"Batteriespeicher", Icon:BatteryCharging, color:"#93C5FD", cap:30, store:420, buildCost:1800, staff:1 },
};
const POWER_LIST = Object.values(POWER);
const POWER_NEED = [4, 7, 10, 14];

/* labor */
const STAFF = {
  basic:   { key:"basic",   name:"Ungelernt",    Icon:Users,         cap:1.0, wage:1.0, color:"#9AB0C7" },
  skilled: { key:"skilled", name:"Facharbeiter", Icon:HardHat,       cap:1.6, wage:1.6, color:"#5AA9F2" },
  master:  { key:"master",  name:"Meister",      Icon:GraduationCap, cap:2.4, wage:2.5, color:"#F2B441" },
};
const STAFF_ORDER = ["basic", "skilled", "master"];
const STAFF_BASE = [1, 2, 3, 5];
const BASE_WAGE = 0.22;
const TICKS_PER_MIN = 50;

const FOUND_COST = 500;
const MAX_LEVEL = 5;
const LOAN_RATE = 0.0007;
const DAY_MS = 120000;
const GRID_BASE = 0.042;
const FEED_IN = 0.018;
const SAVE_KEY = "kontor:save:v3";
const MAX_OFFLINE_MS = 12 * 3600 * 1000;

/* ------------------------------------------------------------------ helpers */
let _n = 0;
const uid = (p) => `${p}_${Date.now().toString(36)}${(_n++).toString(36)}`;
const nf0 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n) => `${nf0.format(Math.round(n))} €`;
const price = (n) => `${nf2.format(n)} €`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const timeStr = (s) => (s >= 60 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : `${Math.ceil(s)}s`);
const fl = (n) => Math.floor(n || 0);

const isGen = (b) => !!b.powerId;const bDef = (b) => (isGen(b) ? POWER[b.powerId] : PRODUCTS[b.productId]);
const buildingCost = (b) => bDef(b).buildCost;
const lvl = (b) => b.level || 1;
const effOut = (b) => PRODUCTS[b.productId].out * lvl(b);
const OP_SCALE = 0.4;
const effOp = (b) => Math.max(1, Math.round(PRODUCTS[b.productId].op * (1 + (lvl(b) - 1) * 0.6) * OP_SCALE));
const baseTime = (b) => PRODUCTS[b.productId].time * (1 - (lvl(b) - 1) * 0.05);
const upgradeCost = (b) => Math.round(buildingCost(b) * (0.7 + lvl(b) * 0.35));
const CMATS = ["steelbeam", "bricks", "planks", "windows"];
const buildMats = (cost) => ({
  steelbeam: Math.max(1, Math.round(cost / 500)),
  bricks: Math.max(4, Math.round(cost / 40)),
  planks: Math.max(2, Math.round(cost / 120)),
  windows: Math.max(1, Math.round(cost / 1200)),
});
const hasMats = (inv, mats) => CMATS.every((k) => (inv[k] || 0) >= (mats[k] || 0));
const reqInputs = (b) => Object.fromEntries(Object.entries(PRODUCTS[b.productId].inputs).map(([k, v]) => [k, v * lvl(b)]));
const hasReq = (inv, b) => Object.entries(reqInputs(b)).every(([k, v]) => (inv[k] || 0) >= v);
const missReq = (inv, b) => Object.entries(reqInputs(b)).filter(([k, v]) => (inv[k] || 0) < v).map(([k, v]) => ({ id: k, need: v, have: inv[k] || 0 }));

const staffNeed = (b) => isGen(b) ? (POWER[b.powerId].staff + (lvl(b) - 1)) : (STAFF_BASE[PRODUCTS[b.productId].tier] + (lvl(b) - 1));
const laborDemand = (bs) => bs.reduce((s, b) => s + staffNeed(b), 0);
const laborCapacity = (wf) => wf.basic * STAFF.basic.cap + wf.skilled * STAFF.skilled.cap + wf.master * STAFF.master.cap;
const headcount = (wf) => wf.basic + wf.skilled + wf.master;
const wageIndex = (wf) => clamp(1 + headcount(wf) * 0.006, 1, 1.7);
const wagesPerTick = (wf, cpi = 1, boom = 0) => (wf.basic * STAFF.basic.wage + wf.skilled * STAFF.skilled.wage + wf.master * STAFF.master.wage) * BASE_WAGE * wageIndex(wf) * cpi * (1 + Math.max(0, boom) * 0.12);
const efficiency = (wf, bs) => { const d = laborDemand(bs); return d <= 0 ? 1 : clamp(laborCapacity(wf) / d, 0.25, 1); };
const recruitFee = (wf, tier) => Math.round(40 * STAFF[tier].wage * wageIndex(wf));
const trainCost = (wf, to) => Math.round((to === "skilled" ? 300 : 600) * wageIndex(wf));

const unlockedList = (g) => CLIST.filter((c) => g.unlocked[c.id]);
const isUnlocked = (g, cid) => !!g.unlocked[cid];

/* macro economy */
const cpiOf = (g) => (g.macro ? g.macro.cpi : 1) || 1;
const ppI = (cid, pid, cpi) => { const p = CITY_PP[cid][pid]; return { base: p.base * cpi, eq: p.eq, demand: p.demand, elast: p.elast }; };
const opCost = (b, cpi) => Math.max(1, Math.round(effOp(b) * cpi));
const MACRO_PHASES = [
  { key: "boom",   min: 0.5,  label: "Boom",       color: "#57DA8A" },
  { key: "up",     min: 0.15, label: "Aufschwung", color: "#2FD4C4" },
  { key: "stable", min: -0.15,label: "Stabil",     color: "#8DA2BC" },
  { key: "down",   min: -0.5, label: "Abschwung",  color: "#F2B441" },
  { key: "rec",    min: -2,   label: "Rezession",  color: "#FB7185" },
];
const phaseOf = (boom) => MACRO_PHASES.find((p) => boom >= p.min) || MACRO_PHASES[MACRO_PHASES.length - 1];
const loanRateOf = (leitzins) => (leitzins / 100) * 0.014;
const CYC_AMP = { berlin: 1.3, frankfurt: 1.25, stuttgart: 1.2, muenchen: 1.15, dortmund: 1.1, leipzig: 1.1, hannover: 1.0, luebeck: 0.95, hamburg: 0.85, bremen: 0.85, kiel: 0.8, rostock: 0.8 };

/* energy */
const dayPhase = (now) => (now % DAY_MS) / DAY_MS;
const localHour = (now) => { const d = new Date(now); return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600; };
const solarFactor = (now, realDay) => {
  if (realDay) { const h = localHour(now); return (h <= 6 || h >= 20) ? 0 : Math.max(0, Math.sin(Math.PI * (h - 6) / 14)); }
  return Math.max(0, Math.sin(dayPhase(now) * Math.PI * 2));
};
const windFactor = (now) => clamp(0.55 + 0.35 * Math.sin(now / 37000 + 1) + 0.14 * Math.sin(now / 11000), 0.08, 1);
const gridPrice = (now, realDay) => GRID_BASE * (1 + 0.55 * (1 - solarFactor(now, realDay)));
const isDay = (now, realDay) => solarFactor(now, realDay) > 0.02;
const genLiveKW = (b, now, realDay) => {
  const pw = POWER[b.powerId], cap = pw.cap * lvl(b);
  if (pw.kind === "solar") return cap * solarFactor(now, realDay);
  if (pw.kind === "wind") return cap * windFactor(now);
  return cap;
};

function energyState(g, now) {
  let demand = 0, solarCap = 0, windCap = 0, gasCap = 0, batPower = 0, batStore = 0;
  for (const b of g.buildings) {
    if (b.powerId) {
      const pw = POWER[b.powerId], L = lvl(b);
      if (pw.kind === "solar") solarCap += pw.cap * L;
      else if (pw.kind === "wind") windCap += pw.cap * L;
      else if (pw.kind === "gas") gasCap += pw.cap * L;
      else if (pw.kind === "battery") { batPower += pw.cap * L; batStore += pw.store * L; }
    } else if (b.prod) demand += POWER_NEED[PRODUCTS[b.productId].tier] * lvl(b);
  }
  const solarGen = solarCap * solarFactor(now, g.realDay), windGen = windCap * windFactor(now);
  const renew = solarGen + windGen;
  const soc = clamp(g.batterySoc || 0, 0, batStore);
  const oil = g.oil || 0, oilPerKW = POWER.gas.oilPerKW;
  let gasUse = 0, oilUse = 0, gridImport = 0, feedIn = 0, socAfter = soc;
  const net = demand - renew;
  if (net <= 0) {
    const surplus = -net, room = batStore - soc;
    const charge = Math.min(surplus, batPower, room);
    socAfter = soc + charge; feedIn = surplus - charge;
  } else {
    const dis = Math.min(net, batPower, soc);
    socAfter = soc - dis;
    let rem = net - dis;
    const maxGasByOil = oilPerKW > 0 ? oil / oilPerKW : gasCap;
    gasUse = Math.min(rem, gasCap, maxGasByOil);
    oilUse = gasUse * oilPerKW;
    rem -= gasUse;
    gridImport = rem;
  }
  const gP = gridPrice(now, g.realDay) * (g.cpi || 1);
  const cost = gridImport * gP, income = feedIn * FEED_IN, selfKW = demand - gridImport;
  return { demand, solarCap, windCap, gasCap, batPower, batStore, solarGen, windGen, renew, gasUse, oilUse, gridImport, feedIn, cost, income, socAfter, soc, gridP: gP, selfKW, oilShort: net > 0 && oilPerKW > 0 && oil < 1 && gasCap > 0, day: isDay(now, g.realDay) };
}
const esFor = (game, now) => energyState({ buildings: game.buildings, batterySoc: game.batterySoc, oil: game.inventory[HOME] ? (game.inventory[HOME].oil || 0) : 0, cpi: cpiOf(game), realDay: !!(game.settings && game.settings.realClock) }, now);

function priceFrom(pp, stock) {
  const ratio = pp.eq / Math.max(stock, pp.eq * 0.12);
  return clamp(pp.base * Math.pow(ratio, pp.elast), pp.base * 0.3, pp.base * 3);
}
function sellInto(pp, stock, qty) {
  let s = stock, rev = 0, rem = qty; const step = Math.max(1, Math.floor(qty / 10));
  while (rem > 0) { const n = Math.min(step, rem); rev += priceFrom(pp, s) * n; s += n; rem -= n; }
  return { revenue: Math.max(1, Math.round(rev)), newStock: s };
}
function buyFrom(pp, stock, qty) {
  let s = stock, cost = 0, rem = qty; const step = Math.max(1, Math.floor(qty / 10));
  while (rem > 0) { const n = Math.min(step, rem); s = Math.max(1, s - n); cost += priceFrom(pp, s) * n; rem -= n; }
  return { cost: Math.round(cost), newStock: s };
}

/* ------------------------------------------------------------------ milestones */
const MILESTONES = [
  { id: "b3",     label: "3 Betriebe besitzen",         test: (g) => g.buildings.filter((b) => !isGen(b)).length >= 3, cash: 600, rep: 0 },
  { id: "ship1",  label: "Erste Lieferung verschicken", test: (g) => g.stats.shipments >= 1, cash: 800, rep: 2 },
  { id: "city2",  label: "Zweite Stadt erschließen",    test: (g) => unlockedList(g).length >= 2, cash: 1500, rep: 3 },
  { id: "gen1",   label: "Erstes Kraftwerk bauen",      test: (g) => g.buildings.some(isGen), cash: 1000, rep: 2 },
  { id: "staff10",label: "10 Mitarbeiter beschäftigen", test: (g) => headcount(g.workforce) >= 10, cash: 1500, rep: 3 },
  { id: "lv3",    label: "Ein Gebäude auf Stufe 3",     test: (g) => g.buildings.some((b) => lvl(b) >= 3), cash: 1500, rep: 4 },
  { id: "allEnd", label: "Alle 3 Endprodukte fertigen", test: (g) => ["bread", "tools", "bottle"].every((id) => g.buildings.some((b) => b.productId === id)), cash: 2500, rep: 6 },
  { id: "lux1",   label: "Erstes Spitzenprodukt fertigen", test: (g) => ["watch", "spirits", "automobile", "jewelry"].some((id) => g.buildings.some((b) => b.productId === id)), cash: 3000, rep: 6 },
  { id: "auto1",  label: "Erstes Automobil bauen",      test: (g) => g.buildings.some((b) => b.productId === "automobile"), cash: 4000, rep: 8 },
  { id: "nw15",   label: "Vermögen 15.000 €",           test: (g, nw) => nw >= 15000, cash: 2000, rep: 4 },
  { id: "ct10",   label: "10 Aufträge erfüllen",        test: (g) => g.stats.contracts >= 10, cash: 2500, rep: 8 },
  { id: "ship20", label: "20 Lieferungen verschicken",  test: (g) => g.stats.shipments >= 20, cash: 3000, rep: 6 },
  { id: "cityAll",label: "In allen Städten präsent",    test: (g) => CLIST.every((c) => g.unlocked[c.id]), cash: 10000, rep: 15 },
  { id: "nw75",   label: "Vermögen 75.000 €",           test: (g, nw) => nw >= 75000, cash: 8000, rep: 10 },
];

/* ------------------------------------------------------------------ state */
function freshMarketFor(cid) {
  const m = {};
  for (const p of PLIST) { const pp = CITY_PP[cid][p.id]; m[p.id] = { price: pp.base, stock: pp.eq, history: Array.from({ length: 22 }, () => pp.base) }; }
  return m;
}
function freshGame() {
  const market = {}, inventory = {};
  for (const cid of Object.keys(CITIES)) { market[cid] = freshMarketFor(cid); inventory[cid] = {}; }
  const now = Date.now();
  return {
    cash: 3000, rep: 20, debt: 0, milestones: {}, goalToast: null, batterySoc: 0,
    unlocked: { [HOME]: true }, shipments: [],
    macro: { boom: 0, cpi: 1, leitzins: 3.5, phase: "stable" },
    settings: { realClock: false }, lastSeen: now,
    workforce: { basic: 0, skilled: 0, master: 0 },
    companies: [{ id: uid("co"), name: "Kontor & Co.", focus: "Allgemein" }],
    buildings: [], inventory, market, contracts: [], news: [],
    nextMarket: now + 1200, nextEvent: now + 12000, nextContract: now + 7000,
    stats: { earned: 0, spent: 0, contracts: 0, shipments: 0 },
  };
}
function migrate(g) {
  const f = freshGame();
  const out = { ...f, ...g };
  out.milestones = g.milestones || {};
  out.goalToast = null;
  out.batterySoc = g.batterySoc || 0;
  out.macro = { boom: 0, cpi: 1, leitzins: 3.5, phase: "stable", ...(g.macro || {}) };
  out.settings = { realClock: false, ...(g.settings || {}) };
  out.lastSeen = g.lastSeen || Date.now();
  out.unlocked = { [HOME]: true };
  if (g.unlocked) for (const k of Object.keys(g.unlocked)) if (g.unlocked[k] && CITIES[k]) out.unlocked[k] = true;
  out.shipments = (g.shipments || []).filter((s) => CITIES[s.from] && CITIES[s.to]);
  out.workforce = g.workforce ? { basic: 0, skilled: 0, master: 0, ...g.workforce } : { basic: 0, skilled: 0, master: 0 };
  out.stats = { earned: 0, spent: 0, contracts: 0, shipments: 0, ...(g.stats || {}) };
  // markets: ensure every current city has every current product
  out.market = {};
  for (const cid of Object.keys(CITIES)) {
    const fresh = freshMarketFor(cid), existing = (g.market && g.market[cid]) ? g.market[cid] : {};
    const merged = {};
    for (const p of PLIST) merged[p.id] = existing[p.id] || fresh[p.id];
    out.market[cid] = merged;
  }
  // inventory: nested per city; unknown/removed cities merge into home; flat legacy -> home
  out.inventory = {}; for (const cid of Object.keys(CITIES)) out.inventory[cid] = {};
  if (g.inventory) {
    const nested = Object.values(g.inventory).some((v) => v && typeof v === "object");
    if (nested) {
      for (const [k, cityInv] of Object.entries(g.inventory)) {
        const target = CITIES[k] ? k : HOME;
        for (const [pid, q] of Object.entries(cityInv || {})) if (PRODUCTS[pid]) out.inventory[target][pid] = (out.inventory[target][pid] || 0) + (q || 0);
      }
    } else {
      for (const [pid, q] of Object.entries(g.inventory)) if (PRODUCTS[pid]) out.inventory[HOME][pid] = (out.inventory[HOME][pid] || 0) + (q || 0);
    }
  }
  out.buildings = (g.buildings || []).map((b) => ({ level: 1, ...b, cityId: (b.cityId && CITIES[b.cityId]) ? b.cityId : HOME }));
  out.contracts = (g.contracts || []).map((c) => ({ ...c, cityId: (c.cityId && CITIES[c.cityId]) ? c.cityId : HOME }));
  return out;
}
const addNews = (news, text, tone) => [{ id: uid("n"), text, tone, t: Date.now() }, ...news].slice(0, 10);

function tick(prev, now = Date.now()) {
  let cash = prev.cash, debt = prev.debt || 0, rep = prev.rep, stats = prev.stats, batterySoc = prev.batterySoc || 0;
  let workforce = prev.workforce, news = prev.news, macro = prev.macro;
  const realDay = !!(prev.settings && prev.settings.realClock);
  const inventory = {}; for (const cid of Object.keys(prev.inventory)) inventory[cid] = { ...prev.inventory[cid] };
  const buildings = prev.buildings.map((b) => ({ ...b }));
  let market = prev.market, contracts = prev.contracts, shipments = prev.shipments;
  let nextMarket = prev.nextMarket, nextEvent = prev.nextEvent, nextContract = prev.nextContract;

  // offline cap: never simulate more than MAX_OFFLINE_MS of backlog
  if (now - nextMarket > MAX_OFFLINE_MS) nextMarket = now - MAX_OFFLINE_MS;
  if (now - nextEvent > MAX_OFFLINE_MS) nextEvent = now - 9000;
  if (now - nextContract > MAX_OFFLINE_MS) nextContract = now - 9000;

  const completeArrivals = (vt) => {
    if (!shipments.length) return;
    const still = [];
    for (const s of shipments) {
      if (vt >= s.arrive) { inventory[s.to][s.productId] = (inventory[s.to][s.productId] || 0) + s.qty; news = addNews(news, `${s.qty} ${PRODUCTS[s.productId].name} in ${CITIES[s.to].name} eingetroffen.`, "neutral"); }
      else still.push(s);
    }
    if (still.length !== shipments.length) shipments = still;
  };
  const STOCK_CAP = 30;
  const runProduction = (vt) => {
    const eff = efficiency(workforce, buildings);
    for (const b of buildings) {
      if (b.powerId) continue;
      let guard = 0;
      while (b.prod && vt >= b.prod.end && guard < 4000) {
        guard++;
        const endT = b.prod.end, inv = inventory[b.cityId];
        inv[b.productId] = (inv[b.productId] || 0) + effOut(b);
        b.prod = null;
        if (b.autoRepeat && hasReq(inv, b) && cash >= opCost(b, macro.cpi) && (b.autoSell || (inv[b.productId] || 0) < STOCK_CAP)) {
          for (const [k, v] of Object.entries(reqInputs(b))) inv[k] -= v;
          cash -= opCost(b, macro.cpi);
          b.prod = { start: endT, end: endT + (baseTime(b) / eff) * 1000 };
        }
      }
      if (b.autoRepeat && !b.prod) {
        const inv = inventory[b.cityId];
        if (hasReq(inv, b) && cash >= opCost(b, macro.cpi) && (b.autoSell || (inv[b.productId] || 0) < STOCK_CAP)) {
          for (const [k, v] of Object.entries(reqInputs(b))) inv[k] -= v;
          cash -= opCost(b, macro.cpi);
          b.prod = { start: vt, end: vt + (baseTime(b) / eff) * 1000 };
        }
      }
    }
  };

  // step the world forward at market cadence, catching up any missed real time
  let steps = 0;
  while (now >= nextMarket && steps < 40000) {
    const vt = nextMarket;
    completeArrivals(vt);
    runProduction(vt);
    // macro
    {
      const target = 0.72 * Math.sin(vt / 48000);
      const boom = clamp(macro.boom + (target - macro.boom) * 0.05 + rand(-0.015, 0.015), -1, 1);
      const inflPerTick = clamp(0.00008 + 0.00016 * boom, -0.00004, 0.0003);
      const cpi = Math.max(0.9, macro.cpi * (1 + inflPerTick));
      const leitzins = clamp(1 + 5 * ((boom + 1) / 2) + (cpi - 1) * 6, 0.5, 9);
      const ph = phaseOf(boom);
      if (macro.phase !== ph.key) news = addNews(news, `Konjunktur schlägt um: ${ph.label}.`, ph.key === "boom" ? "good" : ph.key === "rec" ? "down" : "neutral");
      macro = { boom, cpi, leitzins, phase: ph.key };
    }
    const cpi = macro.cpi, boom = macro.boom;
    const nm = {};
    for (const cid of Object.keys(CITIES)) {
      nm[cid] = {};
      const cyc = 1 + boom * 0.22 * (CYC_AMP[cid] || 1);
      for (const p of PLIST) {
        const pp = ppI(cid, p.id, cpi), m = market[cid][p.id];
        const demandEff = pp.demand * cyc * Math.pow(pp.base / m.price, 0.35) * rand(0.75, 1.25);
        const supply = pp.demand * Math.pow(m.price / pp.base, 0.6) * rand(0.8, 1.2);
        const stock = Math.max(1, m.stock + supply - demandEff);
        const pr = priceFrom(pp, stock);
        nm[cid][p.id] = { price: pr, stock, history: [...m.history, pr].slice(-26) };
      }
    }
    market = nm;
    // automatic selling for flagged production buildings
    {
      const sellSet = {};
      for (const b of buildings) if (!b.powerId && b.autoSell) (sellSet[b.cityId] || (sellSet[b.cityId] = new Set())).add(b.productId);
      for (const cid of Object.keys(sellSet)) {
        for (const pid of sellSet[cid]) {
          const have = inventory[cid][pid] || 0;
          const qty = Math.min(Math.floor(have), 12);
          if (qty >= 1) {
            const pp = ppI(cid, pid, macro.cpi), m = market[cid][pid];
            const { revenue, newStock } = sellInto(pp, m.stock, qty);
            inventory[cid][pid] = have - qty;
            const np = priceFrom(pp, newStock);
            market = { ...market, [cid]: { ...market[cid], [pid]: { price: np, stock: newStock, history: [...m.history, np].slice(-26) } } };
            cash += revenue; stats = { ...stats, earned: stats.earned + revenue };
          }
        }
      }
    }
    if (debt > 0) debt = debt * (1 + loanRateOf(macro.leitzins));
    const w = wagesPerTick(workforce, cpi, boom);
    if (w > 0) {
      if (cash >= w) { cash -= w; stats = { ...stats, spent: stats.spent + w }; }
      else {
        stats = { ...stats, spent: stats.spent + cash }; cash = 0;
        const t = workforce.basic > 0 ? "basic" : workforce.skilled > 0 ? "skilled" : workforce.master > 0 ? "master" : null;
        if (t) { workforce = { ...workforce, [t]: workforce[t] - 1 }; news = addNews(news, "Löhne nicht gezahlt — ein Mitarbeiter kündigt.", "down"); }
      }
    }
    const es = energyState({ buildings, batterySoc, oil: inventory[HOME] ? (inventory[HOME].oil || 0) : 0, cpi, realDay }, vt);
    batterySoc = es.socAfter;
    if (es.oilUse > 0 && inventory[HOME]) inventory[HOME].oil = Math.max(0, (inventory[HOME].oil || 0) - es.oilUse);
    const eCost = Math.min(es.cost, cash);
    if (eCost > 0) { cash -= eCost; stats = { ...stats, spent: stats.spent + eCost }; }
    if (es.income > 0) { cash += es.income; stats = { ...stats, earned: stats.earned + es.income }; }
    // market event
    if (vt >= nextEvent) {
      const cid = pick(unlockedList(prev).map((c) => c.id));
      const p = pick(PLIST), m = market[cid][p.id], pp = ppI(cid, p.id, cpi);
      if (Math.random() < 0.5) {
        const add = m.stock + pp.eq * rand(0.45, 0.95);
        market = { ...market, [cid]: { ...market[cid], [p.id]: { ...m, stock: add, price: priceFrom(pp, add) } } };
        news = addNews(news, `${pick(RIVALS)} flutet ${p.name} in ${CITIES[cid].name} — Preis fällt.`, "down");
      } else {
        const cut = Math.max(1, m.stock - pp.eq * rand(0.35, 0.6));
        market = { ...market, [cid]: { ...market[cid], [p.id]: { ...m, stock: cut, price: priceFrom(pp, cut) } } };
        news = addNews(news, `Nachfrageschub bei ${p.name} in ${CITIES[cid].name} — Preis steigt.`, "up");
      }
      nextEvent = vt + rand(13000, 22000);
    }
    // new contract offer
    if (vt >= nextContract) {
      const open = contracts.filter((c) => c.status === "open").length;
      if (open < 4) { contracts = [...contracts, makeContract(market, rep, prev, vt)]; nextContract = vt + rand(9000, 16000); }
      else nextContract = vt + rand(6000, 10000);
    }
    nextMarket += 1200;
    steps++;
  }
  // finish any completions up to the exact current time
  completeArrivals(now);
  runProduction(now);

  // contract expiry / broken deadlines
  const kept = [];
  for (const c of contracts) {
    if (c.status === "open" && now >= c.offerExpiry) continue;
    if (c.status === "accepted" && c.kind === "sell" && now >= c.deadline) {
      rep = clamp(rep - 6, 0, 100);
      news = addNews(news, `Auftrag von ${c.client} geplatzt — Ruf beschädigt.`, "down");
      continue;
    }
    kept.push(c);
  }
  contracts = kept;

  let milestones = prev.milestones, goalToast = prev.goalToast;
  const nwNow = netWorth({ cash, debt, inventory, buildings, market });
  const probe = { ...prev, cash, buildings, inventory, workforce, stats, unlocked: prev.unlocked };
  for (const ms of MILESTONES) {
    if (!milestones[ms.id] && ms.test(probe, nwNow)) {
      milestones = { ...milestones, [ms.id]: now };
      cash += ms.cash; rep = clamp(rep + ms.rep, 0, 100);
      news = addNews(news, `Ziel erreicht: ${ms.label} (+${ms.cash} €${ms.rep ? `, +${ms.rep} Ruf` : ""}).`, "good");
      goalToast = { key: now + Math.random(), label: ms.label, cash: ms.cash, rep: ms.rep };
    }
  }

  return { ...prev, cash, debt, rep, workforce, batterySoc, macro, inventory, buildings, market, news, contracts, shipments, milestones, goalToast, nextMarket, nextEvent, nextContract, stats, lastSeen: now };
}

function makeContract(market, rep, g, now = Date.now()) {
  const cid = pick(unlockedList(g).map((c) => c.id));
  const kind = Math.random() < 0.62 ? "sell" : "supply";
  const pool = kind === "sell" ? weighted([[2, 4], [1, 2], [0, 1]]) : weighted([[0, 3], [1, 2], [2, 1]]);
  const p = pick(PLIST.filter((x) => x.tier === pool));
  const m = market[cid][p.id];
  if (kind === "sell") {
    const qty = Math.round(rand(12, 30) * (1 + rep / 120));
    const premium = 0.05 + (rep / 100) * 0.22 + rand(0, 0.06);
    return { id: uid("c"), kind, cityId: cid, client: pick(CLIENTS), productId: p.id, qty, pricePer: +(m.price * (1 + premium)).toFixed(2),
      duration: Math.round(rand(85, 200)), offerExpiry: now + rand(45, 80) * 1000, status: "open" };
  }
  const qty = Math.round(rand(20, 55));
  return { id: uid("c"), kind, cityId: cid, client: pick(RIVALS), productId: p.id, qty, pricePer: +(m.price * (1 - (0.08 + rand(0, 0.14)))).toFixed(2),
    offerExpiry: now + rand(50, 90) * 1000, status: "open" };
}
function weighted(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [val, w] of pairs) { if ((r -= w) <= 0) return val; }
  return pairs[0][0];
}

const actions = {
  build: (g, companyId, cityId, productId) => {
    const p = PRODUCTS[productId];
    if (g.cash < p.buildCost || !isUnlocked(g, cityId)) return g;
    const mats = buildMats(p.buildCost), inv = g.inventory[cityId];
    if (!hasMats(inv, mats)) return g;
    const ninv = { ...inv }; for (const k of CMATS) ninv[k] = (ninv[k] || 0) - (mats[k] || 0);
    return { ...g, cash: g.cash - p.buildCost, inventory: { ...g.inventory, [cityId]: ninv }, stats: { ...g.stats, spent: g.stats.spent + p.buildCost },
      buildings: [...g.buildings, { id: uid("b"), companyId, cityId, productId, level: 1, autoRepeat: false, autoSell: false, prod: null }] };
  },
  buildGen: (g, companyId, cityId, powerId) => {
    const pw = POWER[powerId];
    if (g.cash < pw.buildCost || !isUnlocked(g, cityId)) return g;
    const mats = buildMats(pw.buildCost), inv = g.inventory[cityId];
    if (!hasMats(inv, mats)) return g;
    const ninv = { ...inv }; for (const k of CMATS) ninv[k] = (ninv[k] || 0) - (mats[k] || 0);
    return { ...g, cash: g.cash - pw.buildCost, inventory: { ...g.inventory, [cityId]: ninv }, stats: { ...g.stats, spent: g.stats.spent + pw.buildCost },
      buildings: [...g.buildings, { id: uid("b"), companyId, cityId, powerId, level: 1 }] };
  },
  demolish: (g, id) => {
    const b = g.buildings.find((x) => x.id === id); if (!b) return g;
    return { ...g, cash: g.cash + Math.round(buildingCost(b) * 0.5), buildings: g.buildings.filter((x) => x.id !== id) };
  },
  upgrade: (g, id) => {
    const b = g.buildings.find((x) => x.id === id); if (!b || lvl(b) >= MAX_LEVEL) return g;
    const cost = upgradeCost(b); if (g.cash < cost) return g;
    const mats = buildMats(cost), inv = g.inventory[b.cityId];
    if (!hasMats(inv, mats)) return g;
    const ninv = { ...inv }; for (const k of CMATS) ninv[k] = (ninv[k] || 0) - (mats[k] || 0);
    return { ...g, cash: g.cash - cost, inventory: { ...g.inventory, [b.cityId]: ninv }, stats: { ...g.stats, spent: g.stats.spent + cost },
      buildings: g.buildings.map((x) => x.id === id ? { ...x, level: lvl(x) + 1 } : x) };
  },
  buyMats: (g, cityId, mats) => {
    let ng = g;
    for (const k of CMATS) {
      const short = (mats[k] || 0) - (ng.inventory[cityId][k] || 0);
      if (short > 0) ng = actions.buy(ng, cityId, k, short);
    }
    return ng;
  },
  startProd: (g, id) => {
    const b = g.buildings.find((x) => x.id === id); if (!b || b.prod) return g;
    const inv = g.inventory[b.cityId];
    const op = opCost(b, cpiOf(g));
    if (!hasReq(inv, b) || g.cash < op) return g;
    const eff = efficiency(g.workforce, g.buildings);
    const ninv = { ...inv };
    for (const [k, v] of Object.entries(reqInputs(b))) ninv[k] -= v;
    const now = Date.now();
    return { ...g, cash: g.cash - op, inventory: { ...g.inventory, [b.cityId]: ninv }, stats: { ...g.stats, spent: g.stats.spent + op },
      buildings: g.buildings.map((x) => x.id === id ? { ...x, prod: { start: now, end: now + (baseTime(x) / eff) * 1000 } } : x) };
  },
  toggleAuto: (g, id) => {
    let ng = { ...g, buildings: g.buildings.map((x) => x.id === id ? { ...x, autoRepeat: !x.autoRepeat } : x) };
    const b = ng.buildings.find((x) => x.id === id);
    if (b.autoRepeat && !b.prod) ng = actions.startProd(ng, id);
    return ng;
  },
  toggleSell: (g, id) => ({ ...g, buildings: g.buildings.map((x) => x.id === id ? { ...x, autoSell: !x.autoSell } : x) }),
  sell: (g, cid, pid, qty) => {
    const inv = g.inventory[cid]; qty = Math.min(qty, inv[pid] || 0); if (qty <= 0) return g;
    const pp = ppI(cid, pid, cpiOf(g)), m = g.market[cid][pid];
    const { revenue, newStock } = sellInto(pp, m.stock, qty);
    const ninv = { ...inv }; ninv[pid] -= qty;
    const np = priceFrom(pp, newStock);
    return { ...g, cash: g.cash + revenue, inventory: { ...g.inventory, [cid]: ninv }, stats: { ...g.stats, earned: g.stats.earned + revenue },
      market: { ...g.market, [cid]: { ...g.market[cid], [pid]: { price: np, stock: newStock, history: [...m.history, np].slice(-26) } } } };
  },
  buy: (g, cid, pid, qty) => {
    if (qty <= 0) return g;
    const pp = ppI(cid, pid, cpiOf(g)), m = g.market[cid][pid];
    const { cost, newStock } = buyFrom(pp, m.stock, qty);
    if (g.cash < cost) return g;
    const inv = g.inventory[cid], ninv = { ...inv }; ninv[pid] = (ninv[pid] || 0) + qty;
    const np = priceFrom(pp, newStock);
    return { ...g, cash: g.cash - cost, inventory: { ...g.inventory, [cid]: ninv }, stats: { ...g.stats, spent: g.stats.spent + cost },
      market: { ...g.market, [cid]: { ...g.market[cid], [pid]: { price: np, stock: newStock, history: [...m.history, np].slice(-26) } } } };
  },
  transport: (g, from, to, pid, qty) => {
    if (from === to || !isUnlocked(g, from) || !isUnlocked(g, to)) return g;
    const inv = g.inventory[from]; qty = Math.min(qty, inv[pid] || 0); if (qty <= 0) return g;
    const cost = shipCost(from, to, qty); if (g.cash < cost) return g;
    const ninv = { ...inv }; ninv[pid] -= qty;
    const now = Date.now();
    const ship = { id: uid("s"), from, to, productId: pid, qty, depart: now, arrive: now + shipTime(from, to) * 1000, cost };
    return { ...g, cash: g.cash - cost, inventory: { ...g.inventory, [from]: ninv }, shipments: [...g.shipments, ship],
      stats: { ...g.stats, spent: g.stats.spent + cost, shipments: g.stats.shipments + 1 },
      news: addNews(g.news, `${qty} ${PRODUCTS[pid].name}: ${CITIES[from].name} → ${CITIES[to].name} unterwegs.`, "neutral") };
  },
  unlockCity: (g, cid) => {
    if (isUnlocked(g, cid) || g.cash < CITIES[cid].unlockCost) return g;
    return { ...g, cash: g.cash - CITIES[cid].unlockCost, stats: { ...g.stats, spent: g.stats.spent + CITIES[cid].unlockCost },
      unlocked: { ...g.unlocked, [cid]: true }, news: addNews(g.news, `${CITIES[cid].name} erschlossen — neuer Markt offen.`, "good") };
  },
  found: (g, name, focus) => {
    if (g.cash < FOUND_COST) return g;
    return { ...g, cash: g.cash - FOUND_COST, companies: [...g.companies, { id: uid("co"), name: name || `Firma ${g.companies.length + 1}`, focus }] };
  },
  deleteCompany: (g, id) => {
    const bs = g.buildings.filter((b) => b.companyId === id);
    const refund = bs.reduce((s, b) => s + Math.round(buildingCost(b) * 0.5), 0);
    return { ...g, cash: g.cash + refund, companies: g.companies.filter((c) => c.id !== id), buildings: g.buildings.filter((b) => b.companyId !== id) };
  },
  acceptContract: (g, id) => {
    const now = Date.now();
    return { ...g, contracts: g.contracts.map((c) => c.id === id ? { ...c, status: "accepted", deadline: now + c.duration * 1000 } : c) };
  },
  deliverContract: (g, id) => {
    const c = g.contracts.find((x) => x.id === id); if (!c) return g;
    const inv = g.inventory[c.cityId];
    if ((inv[c.productId] || 0) < c.qty) return g;
    const ninv = { ...inv }; ninv[c.productId] -= c.qty;
    const pay = Math.round(c.qty * c.pricePer);
    const reward = Math.round(3 + c.qty / 12 + PRODUCTS[c.productId].tier);
    return { ...g, cash: g.cash + pay, inventory: { ...g.inventory, [c.cityId]: ninv }, rep: clamp(g.rep + reward, 0, 100),
      stats: { ...g.stats, earned: g.stats.earned + pay, contracts: g.stats.contracts + 1 },
      contracts: g.contracts.filter((x) => x.id !== id),
      news: addNews(g.news, `Auftrag von ${c.client} erfüllt (+${pay} €, +${reward} Ruf).`, "good") };
  },
  buySupply: (g, id) => {
    const c = g.contracts.find((x) => x.id === id); if (!c) return g;
    const cost = Math.round(c.qty * c.pricePer); if (g.cash < cost) return g;
    const inv = g.inventory[c.cityId], ninv = { ...inv }; ninv[c.productId] = (ninv[c.productId] || 0) + c.qty;
    return { ...g, cash: g.cash - cost, inventory: { ...g.inventory, [c.cityId]: ninv }, stats: { ...g.stats, spent: g.stats.spent + cost },
      contracts: g.contracts.filter((x) => x.id !== id),
      news: addNews(g.news, `${c.qty} ${PRODUCTS[c.productId].name} in ${CITIES[c.cityId].name} bezogen.`, "neutral") };
  },
  takeLoan: (g, amt) => {
    const limit = loanLimit(g), room = limit - (g.debt || 0);
    const take = Math.min(amt, room); if (take <= 0) return g;
    return { ...g, cash: g.cash + take, debt: (g.debt || 0) + take };
  },
  repay: (g, amt) => {
    const pay = Math.min(amt, g.debt || 0, g.cash); if (pay <= 0) return g;
    return { ...g, cash: g.cash - pay, debt: (g.debt || 0) - pay };
  },
  hire: (g, tier) => {
    const fee = recruitFee(g.workforce, tier); if (g.cash < fee) return g;
    return { ...g, cash: g.cash - fee, stats: { ...g.stats, spent: g.stats.spent + fee }, workforce: { ...g.workforce, [tier]: g.workforce[tier] + 1 } };
  },
  fire: (g, tier) => { if (g.workforce[tier] <= 0) return g; return { ...g, workforce: { ...g.workforce, [tier]: g.workforce[tier] - 1 } }; },
  train: (g, from, to) => {
    if (g.workforce[from] <= 0) return g;
    const cost = trainCost(g.workforce, to); if (g.cash < cost) return g;
    return { ...g, cash: g.cash - cost, stats: { ...g.stats, spent: g.stats.spent + cost },
      workforce: { ...g.workforce, [from]: g.workforce[from] - 1, [to]: g.workforce[to] + 1 } };
  },
  clearToast: (g) => (g.goalToast ? { ...g, goalToast: null } : g),
  toggleRealClock: (g) => ({ ...g, settings: { ...(g.settings || {}), realClock: !(g.settings && g.settings.realClock) } }),
};

function netWorth(g) {
  let w = g.cash;
  for (const cid of Object.keys(g.inventory || {})) for (const [k, q] of Object.entries(g.inventory[cid])) w += (q || 0) * (g.market[cid]?.[k]?.price || 0);
  for (const b of g.buildings || []) w += buildingCost(b) * 0.5;
  return w - (g.debt || 0);
}
const loanLimit = (g) => Math.max(3000, Math.round((netWorth(g) + (g.debt || 0)) * 0.6));
const totalStock = (g, pid) => Object.keys(g.inventory).reduce((s, cid) => s + (g.inventory[cid][pid] || 0), 0);

function computeCatchUp(g0) {
  const last = g0.lastSeen || Date.now();
  const elapsed = Date.now() - last;
  const beforeInv = {}; for (const p of PLIST) beforeInv[p.id] = totalStock(g0, p.id);
  const beforeCash = g0.cash, beforeNw = netWorth(g0), beforeHead = headcount(g0.workforce);
  const g1 = tick(g0);
  let summary = null;
  if (elapsed > 60000) {
    const produced = PLIST.map((p) => ({ p, q: totalStock(g1, p.id) - beforeInv[p.id] })).filter((x) => x.q > 0.5).sort((a, b) => b.q - a.q);
    summary = { elapsed: Math.min(elapsed, MAX_OFFLINE_MS), capped: elapsed > MAX_OFFLINE_MS, cashDelta: g1.cash - beforeCash, nwDelta: netWorth(g1) - beforeNw, workersLost: Math.max(0, beforeHead - headcount(g1.workforce)), produced };
  }
  return { g1, summary };
}
const awayStr = (ms) => { const m = Math.round(ms / 60000); if (m < 60) return `${m} Min`; const h = Math.floor(m / 60), r = m % 60; return `${h} Std${r ? ` ${r} Min` : ""}`; };

/* ------------------------------------------------------------------ small UI */
function Spark({ data, color, w = 60, h = 22 }) {
  if (!data || data.length < 2) return <svg width={w} height={h} />;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - ((v - mn) / rng) * (h - 4) - 2).toFixed(1)}`).join(" ");
  return <svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" /></svg>;
}
const CityPin = ({ cid, size = 11 }) => <span className="cityPin"><MapPin size={size} color={C.faint} /> {CITIES[cid].short}</span>;

/* ------------------------------------------------------------------ app */
export default function App() {
  const [game, setGame] = useState(null);
  const [tab, setTab] = useState("betrieb");
  const [buildFor, setBuildFor] = useState(null);
  const [founding, setFounding] = useState(false);
  const [energyOpen, setEnergyOpen] = useState(false);
  const [offline, setOffline] = useState(null);
  const [city, setCity] = useState(HOME);
  const [flash, setFlash] = useState(null);
  const gameRef = useRef(null);
  const lastCash = useRef(null);

  useEffect(() => {
    let done = false;
    (async () => {
      try { if (window.storage) { const r = await window.storage.get(SAVE_KEY); if (r && r.value) { const { g1, summary } = computeCatchUp(migrate(JSON.parse(r.value))); setGame(g1); if (summary) setOffline(summary); done = true; } } } catch (e) {}
      if (!done) setGame(freshGame());
    })();
  }, []);
  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { if (!game) return; const id = setInterval(() => setGame((g) => (g ? tick(g) : g)), 400); return () => clearInterval(id); }, [game !== null]);
  useEffect(() => { const id = setInterval(async () => { try { if (window.storage && gameRef.current) await window.storage.set(SAVE_KEY, JSON.stringify(gameRef.current)); } catch (e) {} }, 3000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      const g0 = gameRef.current; if (!g0) return;
      if (Date.now() - (g0.lastSeen || Date.now()) < 60000) return;
      const { g1, summary } = computeCatchUp(g0);
      setGame(g1); if (summary) setOffline(summary);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  useEffect(() => {
    if (!game) return;
    if (lastCash.current !== null && game.cash !== lastCash.current) { const d = Math.round(game.cash - lastCash.current); if (d !== 0) setFlash({ amt: d, up: d > 0, key: Date.now() }); }
    lastCash.current = game.cash;
  }, [game && Math.round(game.cash)]);
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 1100); return () => clearTimeout(t); }, [flash]);
  useEffect(() => { if (game && game.goalToast) { const t = setTimeout(() => setGame((g) => actions.clearToast(g)), 2800); return () => clearTimeout(t); } }, [game && game.goalToast && game.goalToast.key]);

  const act = useCallback((fn, ...args) => setGame((g) => fn(g, ...args)), []);
  const openMarketIn = useCallback((cid) => { setCity(cid); setTab("markt"); }, []);

  if (!game) return <div style={{ background: C.bg, height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontFamily: "Inter,system-ui" }}>Lädt …</div>;

  const nw = netWorth(game);
  const openContracts = game.contracts.filter((c) => c.status === "open").length;
  const eff = efficiency(game.workforce, game.buildings);
  const understaffed = game.buildings.length > 0 && eff < 0.999;
  const activeCity = isUnlocked(game, city) ? city : HOME;

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", display: "flex", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{CSS}</style>
      <div className="app">
        <header className="top">
          <div className="brand">
            <span className="brandMark">◆</span>
            <div><div className="brandName">KONTOR</div><div className="brandSub">Handelsnetz Deutschland</div></div>
          </div>
          <div className="cashBox">
            <div className="cashRow">
              <Wallet size={15} color={C.gold} />
              <span className="cash">{money(game.cash)}</span>
              {flash && <span className="flash" key={flash.key} style={{ color: flash.up ? C.green : C.rose }}>{flash.up ? "+" : ""}{nf0.format(flash.amt)}</span>}
            </div>
            <div className="nwRow">Vermögen <b>{money(nw)}</b></div>
          </div>
        </header>

        <main className="main">
          {tab === "betrieb" && <Betrieb game={game} act={act} eff={eff} openBuild={setBuildFor} openFound={() => setFounding(true)} goPersonal={() => setTab("personal")} openEnergy={() => setEnergyOpen(true)} />}
          {tab === "personal" && <Personal game={game} act={act} />}
          {tab === "markt" && <Markt game={game} act={act} city={activeCity} setCity={setCity} />}
          {tab === "karte" && <Karte game={game} act={act} openMarketIn={openMarketIn} city={activeCity} setCity={setCity} />}
          {tab === "auftraege" && <Auftraege game={game} act={act} />}
          {tab === "bilanz" && <Bilanz game={game} nw={nw} act={act} onReset={async () => {
            if (window.confirm("Spielstand wirklich zurücksetzen? Alles geht verloren.")) {
              try { if (window.storage) await window.storage.delete(SAVE_KEY); } catch (e) {}
              setGame(freshGame()); setTab("betrieb");
            }
          }} />}
        </main>

        <nav className="nav">
          <TabBtn active={tab === "betrieb"} onClick={() => setTab("betrieb")} icon={Factory} label="Betrieb" badge={understaffed ? "!" : 0} />
          <TabBtn active={tab === "personal"} onClick={() => setTab("personal")} icon={Users} label="Personal" />
          <TabBtn active={tab === "markt"} onClick={() => setTab("markt")} icon={Store} label="Markt" />
          <TabBtn active={tab === "karte"} onClick={() => setTab("karte")} icon={Map} label="Karte" badge={game.shipments.length} />
          <TabBtn active={tab === "auftraege"} onClick={() => setTab("auftraege")} icon={FileText} label="Aufträge" badge={openContracts} />
          <TabBtn active={tab === "bilanz"} onClick={() => setTab("bilanz")} icon={Landmark} label="Bilanz" />
        </nav>

        {game.goalToast && (
          <div className="toast" key={game.goalToast.key}>
            <Trophy size={20} color={C.gold} />
            <div><div className="toastT">Ziel erreicht</div><div className="toastL">{game.goalToast.label} · +{money(game.goalToast.cash)}{game.goalToast.rep ? ` · +${game.goalToast.rep} Ruf` : ""}</div></div>
          </div>
        )}

        {buildFor && <BuildSheet game={game} companyId={buildFor} defaultCity={activeCity} act={act} onClose={() => setBuildFor(null)}
          onBuild={(cid, pid) => act(actions.build, buildFor, cid, pid)} onBuildGen={(cid, pw) => act(actions.buildGen, buildFor, cid, pw)} />}
        {founding && <FoundSheet game={game} onClose={() => setFounding(false)} onFound={(n, f) => { act(actions.found, n, f); setFounding(false); }} />}
        {energyOpen && <EnergySheet game={game} act={act} onClose={() => setEnergyOpen(false)} />}
        {offline && <OfflineSheet s={offline} onClose={() => setOffline(null)} />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Ic, label, badge }) {
  return (
    <button className={"tabBtn" + (active ? " on" : "")} onClick={onClick}>
      <div className="tabIconWrap"><Ic size={19} />{badge && badge !== 0 ? <span className={"tabBadge" + (badge === "!" ? " warn" : "")}>{badge}</span> : null}</div>
      <span>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ Betrieb */
function Betrieb({ game, act, eff, openBuild, openFound, goPersonal, openEnergy }) {
  const now = Date.now();
  const dem = laborDemand(game.buildings), cap = laborCapacity(game.workforce);
  const pct = dem > 0 ? Math.round((cap / dem) * 100) : 100, full = pct >= 100;
  const es = esFor(game, now);
  const selfShare = es.demand > 0 ? Math.round((es.selfKW / es.demand) * 100) : 100;
  const showBanners = game.buildings.length > 0;
  return (
    <div className="pad">
      {game.buildings.length === 0 && (
        <div className="welcome">
          <div className="wTitle">Willkommen im Kontor.</div>
          <p>Startkapital <b>{money(game.cash)}</b>. Baue Betriebe in <b>Lübeck</b>, veredle (<b>Getreide → Mehl → Brot</b>) und schalte an jedem Betrieb <b>Auto</b> (produziert selbst nach) und <b>Verkauf</b> (verkauft automatisch am Markt) ein — so verdienst du laufend Geld, auch offline. Später erschließt du über die <b>Karte</b> Städte in ganz Deutschland und handelst zwischen ihnen — jede Stadt hat eigene Preise.</p>
        </div>
      )}
      {showBanners && (
        <button className={"staffBanner" + (full ? " full" : "")} onClick={goPersonal}>
          <Users size={16} color={full ? C.teal : C.gold} />
          <div className="sbText"><div className="sbTitle">{full ? "Voll besetzt" : `Unterbesetzt · ${pct}%`}</div><div className="sbSub">{cap.toFixed(0)}/{dem} Arbeitskraft · {full ? "volles Tempo" : "Produktion gebremst"}</div></div>
          <ChevronRight size={16} color={C.faint} />
        </button>
      )}
      {showBanners && (
        <button className="energyBanner" onClick={openEnergy}>
          {es.day ? <Sun size={16} color={C.gold} /> : <Moon size={16} color={C.blue} />}
          <div className="sbText"><div className="sbTitle">Strom · {selfShare}% Eigenversorgung</div><div className="sbSub">Bedarf {Math.round(es.demand)} kW · Netz {Math.round(es.gridImport)} kW · {money(es.cost * TICKS_PER_MIN)}/min</div></div>
          <ChevronRight size={16} color={C.faint} />
        </button>
      )}
      {game.companies.map((co) => {
        const bs = game.buildings.filter((b) => b.companyId === co.id);
        return (
          <section key={co.id} className="coCard">
            <div className="coHead">
              <div className="coIcon"><Building2 size={17} color={C.gold} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="coName">{co.name}</div>
                <div className="coMeta">{co.focus} · {bs.length} {bs.length === 1 ? "Betrieb" : "Betriebe"}</div>
              </div>
              <button className="coDel" onClick={() => {
                const refund = bs.reduce((s, b) => s + Math.round(buildingCost(b) * 0.5), 0);
                const msg = bs.length ? `${co.name} löschen? ${bs.length} Gebäude werden abgerissen (+${money(refund)} zurück).` : `${co.name} löschen?`;
                if (window.confirm(msg)) act(actions.deleteCompany, co.id);
              }}><Trash2 size={15} /></button>
              <button className="addBtn" onClick={() => openBuild(co.id)}><Plus size={15} /> Gebäude</button>
            </div>
            {bs.length === 0 ? <div className="empty">Noch keine Gebäude. Tippe „Gebäude“.</div>
              : <div className="bList">{bs.map((b) => isGen(b)
                  ? <GenCard key={b.id} b={b} game={game} act={act} es={es} now={now} />
                  : <BuildingCard key={b.id} b={b} game={game} act={act} eff={eff} />)}</div>}
          </section>
        );
      })}
      <button className="foundBtn" onClick={openFound}><Plus size={16} /> Firma gründen <span className="foundCost">{money(FOUND_COST)}</span></button>
    </div>
  );
}

function BuildingCard({ b, game, act, eff }) {
  const p = PRODUCTS[b.productId], now = Date.now();
  const inv = game.inventory[b.cityId] || {};
  const running = !!b.prod;
  const prog = running ? clamp((now - b.prod.start) / (b.prod.end - b.prod.start), 0, 1) : 0;
  const left = running ? Math.max(0, (b.prod.end - now) / 1000) : 0;
  const miss = missReq(inv, b);
  const op = opCost(b, cpiOf(game));
  const canStart = miss.length === 0 && game.cash >= op;
  const L = lvl(b), upCost = upgradeCost(b), atMax = L >= MAX_LEVEL;
  const req = reqInputs(b), dispTime = Math.round(baseTime(b) / eff), slow = eff < 0.999;
  return (
    <div className="bCard">
      <div className="bTop">
        <div className="bIcon" style={{ background: p.color + "22", borderColor: p.color + "55" }}><p.Icon size={18} color={p.color} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bName">{p.building} <span className="lvChip">Lv.{L}</span> <CityPin cid={b.cityId} /></div>
          <div className="bMakes">→ {p.name} <span className="x">×{effOut(b)}</span> · {dispTime}s{slow && <span className="slow"> unterbesetzt</span>}</div>
        </div>
        <div className="bToggles">
          <button className={"autoBtn" + (b.autoRepeat ? " on" : "")} onClick={() => act(actions.toggleAuto, b.id)}><Repeat size={13} /> Auto</button>
          <button className={"autoBtn sell" + (b.autoSell ? " on" : "")} onClick={() => act(actions.toggleSell, b.id)}><Coins size={13} /> Verkauf</button>
        </div>
      </div>
      {b.autoSell && <div className="sellNote"><Coins size={11} /> verkauft {p.name} automatisch in {CITIES[b.cityId].name}</div>}
      {Object.keys(req).length > 0 && (
        <div className="inputs">
          {Object.entries(req).map(([k, v]) => {
            const ip = PRODUCTS[k], have = inv[k] || 0, ok = have >= v;
            return <span key={k} className="inChip" style={{ color: ok ? C.muted : C.rose, borderColor: ok ? C.line : C.rose + "66" }}>
              <ip.Icon size={11} color={ip.color} /> {v} {ip.name} <b style={{ color: ok ? C.faint : C.rose }}>({fl(have)})</b></span>;
          })}
        </div>
      )}
      {running ? (
        <div className="prog">
          <div className="progTrack"><div className="progFill" style={{ width: `${prog * 100}%` }} /></div>
          <div className="progText">produziert … <b>{timeStr(left)}</b></div>
        </div>
      ) : (
        <div className="bActions">
          <button className="startBtn" disabled={!canStart} onClick={() => act(actions.startProd, b.id)}><Play size={14} /> Produzieren <span className="op">−{money(op)}</span></button>
          <button className="iconBtn" onClick={() => { if (window.confirm(`${p.building} abreißen?`)) act(actions.demolish, b.id); }}><Trash2 size={15} /></button>
        </div>
      )}
      {!running && !canStart && <div className="warn"><AlertCircle size={12} /> {miss.length ? `Fehlt in ${CITIES[b.cityId].short}: ${miss.map((m) => `${m.need - fl(m.have)}× ${PRODUCTS[m.id].name}`).join(", ")}` : "Zu wenig Bargeld für Betriebskosten"}</div>}
      {atMax ? <div className="upBar max"><ChevronsUp size={13} /> Maximale Stufe erreicht</div>
        : (() => {
            const uMats = buildMats(upCost), okMats = hasMats(inv, uMats);
            let sc = 0; for (const k of CMATS) { const s = (uMats[k] || 0) - (inv[k] || 0); if (s > 0) sc += s * (game.market[b.cityId][k]?.price || 0); }
            return (
              <>
                <button className="upBar" disabled={game.cash < upCost || !okMats} onClick={() => act(actions.upgrade, b.id)}>
                  <span className="upLeft"><ChevronsUp size={14} /> Ausbauen → Lv.{L + 1}</span>
                  <span className="upRight" style={{ color: (game.cash < upCost || !okMats) ? C.faint : C.gold }}>{money(upCost)}</span>
                </button>
                <div className="matRow" style={{ marginTop: 6 }}>
                  {CMATS.map((k) => { const mp = PRODUCTS[k], need = uMats[k] || 0, h = Math.floor(inv[k] || 0), ok = h >= need; return <span key={k} className="matChip" style={{ borderColor: ok ? C.line : C.rose + "66", color: ok ? C.muted : C.rose }}><mp.Icon size={11} color={mp.color} /> {need}{!ok && <b style={{ color: C.rose }}> /{h}</b>}</span>; })}
                  {!okMats && <button className="matBuyMini" disabled={game.cash < sc} onClick={() => act(actions.buyMats, b.cityId, uMats)}><ShoppingCart size={11} /> ~{money(sc)}</button>}
                </div>
              </>
            );
          })()}
    </div>
  );
}

function GenCard({ b, game, act, es, now }) {
  const pw = POWER[b.powerId], L = lvl(b), cap = pw.cap * L, live = genLiveKW(b, now, !!(game.settings && game.settings.realClock));
  const upCost = upgradeCost(b), atMax = L >= MAX_LEVEL;
  let statusLine, statusColor = C.teal;
  if (pw.kind === "solar") { statusLine = es.day ? `${Math.round(live)}/${cap} kW · Tag` : "inaktiv · Nacht"; statusColor = es.day ? C.gold : C.faint; }
  else if (pw.kind === "wind") { statusLine = `${Math.round(live)}/${cap} kW · Wind`; statusColor = C.teal; }
  else if (pw.kind === "gas") { statusLine = es.oilShort ? `${cap} kW · kein Rohöl` : `bis ${cap} kW · Öl-befeuert`; statusColor = C.rose; }
  else { const pctc = es.batStore > 0 ? Math.round((es.soc / es.batStore) * 100) : 0; const ch = es.socAfter > es.soc ? "lädt" : es.socAfter < es.soc ? "entlädt" : "bereit"; statusLine = `${pctc}% geladen · ${cap} kW · ${ch}`; statusColor = C.blue; }
  const fillPct = pw.kind === "battery" ? (es.batStore > 0 ? clamp((es.soc / es.batStore) * 100, 0, 100) : 0) : clamp((live / cap) * 100, 0, 100);
  return (
    <div className="bCard gen">
      <div className="bTop">
        <div className="bIcon" style={{ background: pw.color + "22", borderColor: pw.color + "55" }}><pw.Icon size={18} color={pw.color} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bName">{pw.building} <span className="lvChip">Lv.{L}</span> <CityPin cid={b.cityId} /></div>
          <div className="bMakes" style={{ color: statusColor }}>{statusLine}</div>
        </div>
        <button className="iconBtn" onClick={() => { if (window.confirm(`${pw.building} abreißen?`)) act(actions.demolish, b.id); }}><Trash2 size={15} /></button>
      </div>
      {pw.kind !== "gas" && <div className="genBar"><div className="genFill" style={{ width: `${fillPct}%`, background: statusColor }} /></div>}
      {atMax ? <div className="upBar max"><ChevronsUp size={13} /> Maximale Stufe erreicht</div>
        : <button className="upBar" disabled={game.cash < upCost} onClick={() => act(actions.upgrade, b.id)}>
            <span className="upLeft"><ChevronsUp size={14} /> Ausbauen → Lv.{L + 1} ({pw.cap * (L + 1)} kW)</span>
            <span className="upRight" style={{ color: game.cash < upCost ? C.faint : C.gold }}>{money(upCost)}</span>
          </button>}
    </div>
  );
}

/* ------------------------------------------------------------------ Personal */
function Personal({ game, act }) {
  const wf = game.workforce;
  const cap = laborCapacity(wf), dem = laborDemand(game.buildings);
  const pct = dem > 0 ? Math.round((cap / dem) * 100) : 100, full = pct >= 100;
  const idx = wageIndex(wf), cpi = cpiOf(game), boom = game.macro.boom;
  const wpm = wagesPerTick(wf, cpi, boom) * TICKS_PER_MIN;
  const wagePer = (tier) => STAFF[tier].wage * BASE_WAGE * idx * cpi * (1 + Math.max(0, boom) * 0.12) * TICKS_PER_MIN;
  return (
    <div className="pad">
      <div className="staffCard">
        <div className="staffTop"><Users size={16} color={C.gold} /> <span>Belegschaft</span> <b>{headcount(wf)}</b></div>
        {dem > 0 ? (
          <>
            <div className="staffBar"><div className="staffFill" style={{ width: `${clamp(pct, 0, 100)}%`, background: full ? C.teal : C.gold }} /></div>
            <div className="staffMeta"><span style={{ color: full ? C.teal : C.gold }}>{full ? "Voll besetzt" : `Unterbesetzt · ${pct}%`}</span><span>{cap.toFixed(1)}/{dem} Arbeitskraft</span></div>
          </>
        ) : <div className="staffMeta"><span>Keine Betriebe zu besetzen</span></div>}
        <div className="staffCosts"><span>Lohnkosten</span><b>{money(wpm)}/min</b></div>
        <div className="staffCosts sub"><span>Lohnindex (Knappheit)</span><b>×{idx.toFixed(2)}</b></div>
      </div>
      <div className="secLabel">Einstellen & Ausbilden</div>
      {STAFF_ORDER.map((tier) => {
        const s = STAFF[tier], n = wf[tier], fee = recruitFee(wf, tier);
        return (
          <div key={tier} className="staffRow">
            <div className="staffIcon" style={{ background: s.color + "1e" }}><s.Icon size={17} color={s.color} /></div>
            <div className="staffInfo"><div className="staffName">{s.name} <span className="staffN">×{n}</span></div><div className="staffSub">Kapazität {s.cap.toFixed(1)} · {money(wagePer(tier))}/min · Einstellung {money(fee)}</div></div>
            <div className="staffBtns">
              <button className="hireMini" disabled={n <= 0} onClick={() => act(actions.fire, tier)}><UserMinus size={15} /></button>
              <button className="hireMini plus" disabled={game.cash < fee} onClick={() => act(actions.hire, tier)}><UserPlus size={15} /></button>
            </div>
          </div>
        );
      })}
      <div className="trainRow">
        <button className="trainBtn" disabled={wf.basic <= 0 || game.cash < trainCost(wf, "skilled")} onClick={() => act(actions.train, "basic", "skilled")}><GraduationCap size={13} /> Ungelernt → Facharbeiter <b>{money(trainCost(wf, "skilled"))}</b></button>
        <button className="trainBtn" disabled={wf.skilled <= 0 || game.cash < trainCost(wf, "master")} onClick={() => act(actions.train, "skilled", "master")}><GraduationCap size={13} /> Facharbeiter → Meister <b>{money(trainCost(wf, "master"))}</b></button>
      </div>
      <div className="staffHint">Personal ist ein gemeinsamer Pool für alle Städte. Höher qualifizierte Kräfte liefern mehr Arbeitskraft pro Kopf, kosten aber mehr Lohn. Löhne laufen fortlaufend.</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Markt */
function Markt({ game, act, city, setCity }) {
  const [open, setOpen] = useState(null);
  const [qty, setQty] = useState({});
  const q = (id) => qty[id] || 1;
  const setQ = (id, v) => setQty((s) => ({ ...s, [id]: clamp(v, 1, 999) }));
  const cities = unlockedList(game);
  const mk = game.market[city], inv = game.inventory[city] || {};
  const cpi = cpiOf(game), macro = game.macro, ph = phaseOf(macro.boom), infl = (cpi - 1) * 100;
  const boomPct = clamp((macro.boom + 1) / 2 * 100, 0, 100);
  return (
    <div className="pad">
      <div className="macroCard">
        <div className="macroLeft">
          <div className="macroPhase" style={{ color: ph.color }}>{ph.label}</div>
          <div className="macroBarWrap"><div className="macroZero" /><div className="macroBar" style={{ width: `${boomPct}%`, background: ph.color }} /></div>
        </div>
        <div className="macroStats">
          <div className="macroStat"><span>Leitzins</span><b>{macro.leitzins.toFixed(1)}%</b></div>
          <div className="macroStat"><span>Inflation</span><b style={{ color: infl >= 0 ? C.muted : C.green }}>{infl >= 0 ? "+" : ""}{infl.toFixed(1)}%</b></div>
        </div>
      </div>
      <div className="cityTabs">
        {cities.map((c) => <button key={c.id} className={"cityTab" + (c.id === city ? " on" : "")} onClick={() => { setCity(c.id); setOpen(null); }}>{c.name}</button>)}
      </div>
      <div className="cityBar"><MapPin size={13} color={C.gold} /> <b>{CITIES[city].name}</b> <span>{CITIES[city].spec}</span></div>
      {game.news.length > 0 && (
        <div className="news">{game.news.slice(0, 3).map((n) => (
          <div key={n.id} className="newsItem"><span className="newsDot" style={{ background: n.tone === "up" ? C.green : n.tone === "down" ? C.rose : n.tone === "good" ? C.gold : C.faint }} /><span>{n.text}</span></div>
        ))}</div>
      )}
      {[0, 1, 2, 3].map((t) => (
        <div key={t} className="mGroup">
          <div className="mGroupLabel">{TIER_LABEL[t]}</div>
          {PLIST.filter((p) => p.tier === t).map((p) => {
            const m = mk[p.id], pp = ppI(city, p.id, cpi), have = inv[p.id] || 0;
            const rel = m.price / pp.base, up = rel >= 1;
            const tag = rel > 1.12 ? { t: "Nachfrage hoch", c: C.green } : rel < 0.9 ? { t: "Überangebot", c: C.rose } : { t: "stabil", c: C.faint };
            const isOpen = open === p.id, n = q(p.id);
            const sc = sellInto(pp, m.stock, Math.min(n, have) || 1), bc = buyFrom(pp, m.stock, n);
            return (
              <div key={p.id} className={"mRow" + (isOpen ? " open" : "")}>
                <button className="mRowMain" onClick={() => setOpen(isOpen ? null : p.id)}>
                  <div className="mIcon" style={{ background: p.color + "1e" }}><p.Icon size={16} color={p.color} /></div>
                  <div className="mNameWrap"><div className="mName">{p.name}</div><div className="mTag" style={{ color: tag.c }}>{tag.t} · Lager {fl(have)}</div></div>
                  <Spark data={m.history} color={up ? C.teal : C.rose} />
                  <div className="mPriceWrap"><div className="mPrice" style={{ color: up ? C.teal : C.rose }}>{price(m.price)}</div><div className="mBase">{up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} Ø {price(pp.base)}</div></div>
                  <ChevronDown size={16} color={C.faint} className="mChevron" />
                </button>
                {isOpen && (
                  <div className="trade">
                    <div className="qtyRow">
                      <button className="qBtn" onClick={() => setQ(p.id, n - 1)}>−</button>
                      <div className="qVal">{n}</div>
                      <button className="qBtn" onClick={() => setQ(p.id, n + 1)}>+</button>
                      <button className="qQuick" onClick={() => setQ(p.id, n + 10)}>+10</button>
                      {have > 0 && <button className="qQuick" onClick={() => setQ(p.id, fl(have))}>Alles ({fl(have)})</button>}
                    </div>
                    <div className="tradeBtns">
                      <button className="buyBtn" disabled={game.cash < bc.cost} onClick={() => act(actions.buy, city, p.id, n)}>Kaufen <span>{money(bc.cost)}</span></button>
                      <button className="sellBtn" disabled={have <= 0} onClick={() => act(actions.sell, city, p.id, Math.min(n, fl(have)))}>Verkaufen <span>{have > 0 ? "+" + money(sc.revenue) : "—"}</span></button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Karte */
function Karte({ game, act, openMarketIn, city, setCity }) {
  const [focus, setFocus] = useState(city);
  const [from, setFrom] = useState(city);
  const [to, setTo] = useState(null);
  const [selP, setSelP] = useState(null);
  const [tqty, setTqty] = useState(10);
  const now = Date.now();
  const W = 88, H = 118;
  const fx = (c) => c.x * W, fy = (c) => c.y * H;
  const outline = "M " + DE_OUTLINE.map(([lon, lat]) => `${(projX(lon) * W).toFixed(1)} ${(projY(lat) * H).toFixed(1)}`).join(" L ") + " Z";
  const unlocked = unlockedList(game);
  const fromInv = game.inventory[from] || {};
  const goods = PLIST.filter((p) => (fromInv[p.id] || 0) > 0);
  const dest = to && to !== from && isUnlocked(game, to) ? to : null;
  const maxQ = selP ? fl(fromInv[selP] || 0) : 0;
  const useQ = clamp(tqty, 1, Math.max(1, maxQ));
  const tCost = dest && selP ? shipCost(from, dest, useQ) : 0;
  const tTime = dest ? shipTime(from, dest) : 0;

  return (
    <div className="pad">
      <div className="mapWrap">
        <svg viewBox={`-6 -8 ${W + 12} ${H + 16}`} className="mapSvg" preserveAspectRatio="xMidYMid meet">
          <rect x="-6" y="-8" width={W + 12} height={H + 16} fill={C.sea} />
          <path d={outline} fill="#12253a" stroke={C.line2} strokeWidth="0.5" strokeLinejoin="round" />
          {game.shipments.map((s) => {
            const a = CITIES[s.from], b = CITIES[s.to], t = clamp((now - s.depart) / (s.arrive - s.depart), 0, 1);
            const px = (a.x + (b.x - a.x) * t) * W, py = (a.y + (b.y - a.y) * t) * H;
            return <g key={s.id}><line x1={fx(a)} y1={fy(a)} x2={fx(b)} y2={fy(b)} stroke={C.teal + "66"} strokeWidth="0.6" strokeDasharray="1.5 1.5" /><circle cx={px} cy={py} r="1.6" fill={C.teal} /></g>;
          })}
          {CLIST.map((c) => {
            const on = game.unlocked[c.id], home = c.id === HOME, isFocus = c.id === focus;
            const col = home ? C.gold : on ? C.teal : C.faint;
            const has = game.buildings.some((b) => b.cityId === c.id);
            const X = fx(c), Y = fy(c);
            return (
              <g key={c.id} onClick={() => setFocus(c.id)} style={{ cursor: "pointer" }}>
                <circle cx={X} cy={Y} r="6" fill="transparent" />
                {isFocus && <circle cx={X} cy={Y} r="4.4" fill="none" stroke={col} strokeWidth="0.6" opacity="0.75" />}
                <circle cx={X} cy={Y} r={on ? 2.7 : 2.1} fill={on ? col : C.sea} stroke={col} strokeWidth={on ? 0 : 0.7} strokeDasharray={on ? "0" : "1.3 1"} />
                {has && <circle cx={X} cy={Y} r="1.1" fill={C.bg} />}
                <text x={X} y={Y - 3.6} fill={on ? C.text : C.faint} fontSize="3.6" fontWeight="700" textAnchor="middle" fontFamily="Space Grotesk">{c.short}</text>
                {!on && <text x={X} y={Y + 4.6} fill={C.faint} fontSize="2.9" textAnchor="middle">🔒</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {(() => {
        const c = CITIES[focus], on = game.unlocked[focus];
        const count = game.buildings.filter((b) => b.cityId === focus).length;
        return (
          <div className="focusCard">
            <div className="focusHead">
              <div className="focusPin" style={{ background: (focus === HOME ? C.gold : on ? C.teal : C.faint) + "22" }}><MapPin size={16} color={focus === HOME ? C.gold : on ? C.teal : C.faint} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="focusName">{c.name}{focus === HOME && <span className="homeTag">Sitz</span>}</div><div className="focusSpec">{c.spec}</div></div>
            </div>
            {on ? (
              <div className="focusActions">
                <span className="focusStat">{count} {count === 1 ? "Betrieb" : "Betriebe"}</span>
                <button className="focusBtn" onClick={() => openMarketIn(focus)}><Store size={13} /> Markt öffnen</button>
              </div>
            ) : (
              <button className="unlockBtn" disabled={game.cash < c.unlockCost} onClick={() => act(actions.unlockCity, focus)}><Lock size={14} /> Erschließen <span>{money(c.unlockCost)}</span></button>
            )}
          </div>
        );
      })()}

      <div className="secLabel"><Ship size={12} /> Transport</div>
      {unlocked.length < 2 ? (
        <div className="empty">Erschließe eine zweite Stadt, um Waren zu verschicken und Preisunterschiede auszunutzen.</div>
      ) : (
        <div className="transCard">
          <div className="transRow"><span className="transLbl">Von</span><div className="chipRow">{unlocked.map((c) => <button key={c.id} className={"cChip" + (c.id === from ? " on" : "")} onClick={() => { setFrom(c.id); setSelP(null); if (to === c.id) setTo(null); }}>{c.short}</button>)}</div></div>
          <div className="transRow"><span className="transLbl">Nach</span><div className="chipRow">{unlocked.filter((c) => c.id !== from).map((c) => <button key={c.id} className={"cChip" + (c.id === to ? " on" : "")} onClick={() => setTo(c.id)}>{c.short}</button>)}</div></div>
          <div className="transRow"><span className="transLbl">Ware</span>
            {goods.length === 0 ? <span className="transEmpty">Kein Warenbestand in {CITIES[from].short}</span>
              : <div className="chipRow">{goods.map((p) => <button key={p.id} className={"gChip" + (p.id === selP ? " on" : "")} onClick={() => { setSelP(p.id); setTqty(Math.min(10, fl(fromInv[p.id]))); }}><p.Icon size={12} color={p.color} /> {fl(fromInv[p.id])}</button>)}</div>}
          </div>
          {selP && dest && (
            <>
              <div className="qtyRow" style={{ marginTop: 10 }}>
                <button className="qBtn" onClick={() => setTqty(Math.max(1, useQ - 1))}>−</button>
                <div className="qVal">{useQ}</div>
                <button className="qBtn" onClick={() => setTqty(Math.min(maxQ, useQ + 1))}>+</button>
                <button className="qQuick" onClick={() => setTqty(Math.min(maxQ, useQ + 10))}>+10</button>
                <button className="qQuick" onClick={() => setTqty(maxQ)}>Alles ({maxQ})</button>
              </div>
              <div className="transInfo"><span>{shipKm(from, dest)} km · ~{tTime}s</span><span>Kosten <b>{money(tCost)}</b></span></div>
              <button className="shipBtn" disabled={game.cash < tCost || maxQ <= 0} onClick={() => { act(actions.transport, from, dest, selP, useQ); setSelP(null); }}>
                <Truck size={15} /> {CITIES[from].short} <ArrowRight size={13} /> {CITIES[dest].short} verschicken
              </button>
            </>
          )}
          {selP && !dest && <div className="transHint">Zielstadt wählen.</div>}
        </div>
      )}

      {game.shipments.length > 0 && <div className="secLabel"><Truck size={12} /> Unterwegs</div>}
      {game.shipments.map((s) => {
        const p = PRODUCTS[s.productId], t = clamp((now - s.depart) / (s.arrive - s.depart), 0, 1), eta = Math.max(0, (s.arrive - now) / 1000);
        return (
          <div key={s.id} className="shipRow">
            <div className="mIcon" style={{ background: p.color + "1e" }}><p.Icon size={15} color={p.color} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="shipTitle">{s.qty}× {p.name} <span className="shipRoute">{CITIES[s.from].short} → {CITIES[s.to].short}</span></div>
              <div className="shipTrack"><div className="shipFill" style={{ width: `${t * 100}%` }} /></div>
            </div>
            <div className="shipEta"><Clock size={11} /> {timeStr(eta)}</div>
          </div>
        );
      })}

      <div className="secLabel"><Anchor size={12} /> Preisvergleich</div>
      <div className="cmpHint">Bestpreis je Ware über deine Städte — Basis für Arbitrage.</div>
      <div className="cmpList">
        {PLIST.filter((p) => p.tier >= 2).map((p) => {
          let best = null, worst = null;
          for (const c of unlocked) { const pr = game.market[c.id][p.id].price; if (!best || pr > best.pr) best = { c: c.id, pr }; if (!worst || pr < worst.pr) worst = { c: c.id, pr }; }
          if (!best) return null;
          return (
            <div key={p.id} className="cmpRow">
              <p.Icon size={14} color={p.color} /><span className="cmpName">{p.name}</span>
              <span className="cmpBest">{CITIES[best.c].short} {price(best.pr)}</span>
              {unlocked.length > 1 && <span className="cmpSpread">Δ {price(best.pr - worst.pr)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Aufträge */
function Auftraege({ game, act }) {
  const now = Date.now();
  const open = game.contracts.filter((c) => c.status === "open");
  const active = game.contracts.filter((c) => c.status === "accepted");
  return (
    <div className="pad">
      <div className="repCard">
        <div className="repTop"><Award size={16} color={C.gold} /> <span>Reputation</span> <b>{Math.round(game.rep)}</b><span className="repMax">/100</span></div>
        <div className="repTrack"><div className="repFill" style={{ width: `${game.rep}%` }} /></div>
        <div className="repHint">Aufträge sind an eine Stadt gebunden — liefere aus deren Lager. Höherer Ruf bringt größere Aufträge.</div>
      </div>
      {active.length > 0 && <div className="secLabel">Laufende Aufträge</div>}
      {active.map((c) => {
        const p = PRODUCTS[c.productId], have = game.inventory[c.cityId][c.productId] || 0;
        const left = Math.max(0, (c.deadline - now) / 1000), ready = have >= c.qty, urgent = left < 30;
        return (
          <div key={c.id} className="ctCard active">
            <div className="ctHead">
              <div className="mIcon" style={{ background: p.color + "1e" }}><p.Icon size={16} color={p.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ctTitle">{c.qty}× {p.name} <span className="ctClient">an {c.client}</span></div>
                <div className="ctSub"><CityPin cid={c.cityId} /> · Festpreis {price(c.pricePer)} · <b>{money(c.qty * c.pricePer)}</b></div>
              </div>
              <div className={"ctTimer" + (urgent ? " urgent" : "")}><Clock size={12} /> {timeStr(left)}</div>
            </div>
            <div className="ctProgWrap">
              <div className="ctProgTrack"><div className="ctProgFill" style={{ width: `${clamp(have / c.qty, 0, 1) * 100}%`, background: ready ? C.green : C.gold }} /></div>
              <span className="ctProgTxt">{Math.min(fl(have), c.qty)}/{c.qty}</span>
            </div>
            <button className="deliverBtn" disabled={!ready} onClick={() => act(actions.deliverContract, c.id)}><Truck size={14} /> {ready ? `Liefern (+${money(c.qty * c.pricePer)})` : `Noch ${c.qty - fl(have)}× in ${CITIES[c.cityId].short} nötig`}</button>
          </div>
        );
      })}
      <div className="secLabel">Angebote</div>
      {open.length === 0 ? <div className="empty">Gerade keine Angebote. Neue kommen laufend rein.</div> : open.map((c) => {
        const p = PRODUCTS[c.productId], expire = Math.max(0, (c.offerExpiry - now) / 1000);
        if (c.kind === "sell") return (
          <div key={c.id} className="ctCard">
            <div className="ctBadge sell"><ShoppingCart size={11} /> Verkauf · {CITIES[c.cityId].short}</div>
            <div className="ctHead">
              <div className="mIcon" style={{ background: p.color + "1e" }}><p.Icon size={16} color={p.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="ctTitle">{c.qty}× {p.name}</div><div className="ctSub">{c.client} zahlt <b style={{ color: C.gold }}>{price(c.pricePer)}</b>/Stk · {money(c.qty * c.pricePer)}</div></div>
            </div>
            <div className="ctFoot"><span className="ctMeta">{Math.round(c.duration)}s Lieferzeit · Angebot {timeStr(expire)}</span><button className="acceptBtn" onClick={() => act(actions.acceptContract, c.id)}>Annehmen</button></div>
          </div>
        );
        const cost = Math.round(c.qty * c.pricePer);
        return (
          <div key={c.id} className="ctCard">
            <div className="ctBadge supply"><Truck size={11} /> Einkauf · {CITIES[c.cityId].short}</div>
            <div className="ctHead">
              <div className="mIcon" style={{ background: p.color + "1e" }}><p.Icon size={16} color={p.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="ctTitle">{c.qty}× {p.name}</div><div className="ctSub">{c.client} liefert für <b style={{ color: C.teal }}>{price(c.pricePer)}</b>/Stk · günstig</div></div>
            </div>
            <div className="ctFoot"><span className="ctMeta">Angebot läuft {timeStr(expire)}</span><button className="acceptBtn buy" disabled={game.cash < cost} onClick={() => act(actions.buySupply, c.id)}>Kaufen {money(cost)}</button></div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Bilanz */
function Bilanz({ game, nw, act, onReset }) {
  let invVal = 0; for (const cid of Object.keys(game.inventory)) for (const [k, q] of Object.entries(game.inventory[cid])) invVal += (q || 0) * (game.market[cid]?.[k]?.price || 0);
  const assetVal = game.buildings.reduce((s, b) => s + buildingCost(b) * 0.5, 0);
  const stock = PLIST.map((p) => ({ p, q: totalStock(game, p.id) })).filter((x) => x.q > 0);
  const limit = loanLimit(game), debt = game.debt || 0, room = limit - debt;
  const wpm = wagesPerTick(game.workforce, cpiOf(game), game.macro.boom) * TICKS_PER_MIN;
  const es = esFor(game, Date.now()), epm = es.cost * TICKS_PER_MIN;
  const selfShare = es.demand > 0 ? Math.round((es.selfKW / es.demand) * 100) : 100;
  const macro = game.macro, ph = phaseOf(macro.boom), infl = (macro.cpi - 1) * 100;
  return (
    <div className="pad">
      <div className="nwCard">
        <div className="nwLabel">Gesamtvermögen</div>
        <div className="nwBig">{money(nw)}</div>
        <div className="nwBreak">
          <span><Wallet size={12} color={C.gold} /> Bargeld <b>{money(game.cash)}</b></span>
          <span><Package size={12} color={C.teal} /> Lagerwert <b>{money(invVal)}</b></span>
          <span><Factory size={12} color={C.muted} /> Anlagen <b>{money(assetVal)}</b></span>
          {debt > 0 && <span><Banknote size={12} color={C.rose} /> Schulden <b style={{ color: C.rose }}>−{money(debt)}</b></span>}
        </div>
      </div>
      <div className="bankCard">
        <div className="bankTop"><Banknote size={16} color={C.blue} /> <span>Bank</span> <span className="bankRate">Leitzins {macro.leitzins.toFixed(1)}%</span></div>
        <div className="bankRow"><span>Schulden</span><b style={{ color: debt > 0 ? C.rose : C.muted }}>{money(debt)}</b></div>
        <div className="bankRow"><span>Kreditrahmen frei</span><b>{money(Math.max(0, room))}</b></div>
        <div className="bankBtns">
          <button className="loanBtn" disabled={room < 1} onClick={() => act(actions.takeLoan, 2000)}>+2.000 leihen</button>
          <button className="loanBtn repay" disabled={debt <= 0 || game.cash <= 0} onClick={() => act(actions.repay, 2000)}>2.000 tilgen</button>
          <button className="loanBtn repay" disabled={debt <= 0 || game.cash <= 0} onClick={() => act(actions.repay, debt)}>Alles tilgen</button>
        </div>
      </div>
      <div className="statGrid">
        <div className="stat"><Coins size={15} color={C.green} /><div><div className="statV">{money(game.stats.earned)}</div><div className="statL">Einnahmen</div></div></div>
        <div className="stat"><PiggyBank size={15} color={C.rose} /><div><div className="statV">{money(game.stats.spent)}</div><div className="statL">Ausgaben</div></div></div>
        <div className="stat"><Map size={15} color={C.gold} /><div><div className="statV">{unlockedList(game).length}/{CLIST.length}</div><div className="statL">Städte</div></div></div>
        <div className="stat"><Ship size={15} color={C.blue} /><div><div className="statV">{game.stats.shipments}</div><div className="statL">Lieferungen</div></div></div>
        <div className="stat"><Zap size={15} color={C.gold} /><div><div className="statV">{money(epm)}</div><div className="statL">Energie/min</div></div></div>
        <div className="stat"><Plug size={15} color={C.teal} /><div><div className="statV">{selfShare}%</div><div className="statL">Eigenstrom</div></div></div>
        <div className="stat"><Banknote size={15} color={C.gold} /><div><div className="statV">{money(wpm)}</div><div className="statL">Löhne/min</div></div></div>
        <div className="stat"><Award size={15} color={C.gold} /><div><div className="statV">{Math.round(game.rep)}</div><div className="statL">Reputation</div></div></div>
        <div className="stat"><TrendingUp size={15} color={ph.color} /><div><div className="statV" style={{ color: ph.color }}>{ph.label}</div><div className="statL">Konjunktur</div></div></div>
        <div className="stat"><Coins size={15} color={C.blue} /><div><div className="statV">{infl >= 0 ? "+" : ""}{infl.toFixed(1)}%</div><div className="statL">Inflation</div></div></div>
      </div>
      <div className="secLabel"><Target size={12} /> Ziele</div>
      <div className="goalList">
        {MILESTONES.map((ms) => {
          const done = !!game.milestones[ms.id];
          return (
            <div key={ms.id} className={"goalItem" + (done ? " done" : "")}>
              {done ? <CheckCircle2 size={16} color={C.green} /> : <Circle size={16} color={C.faint} />}
              <span className="goalLabel">{ms.label}</span>
              <span className="goalReward">+{money(ms.cash)}{ms.rep ? ` · +${ms.rep}` : ""}</span>
            </div>
          );
        })}
      </div>
      <div className="secLabel">Lagerbestand (alle Städte)</div>
      {stock.length === 0 ? <div className="empty">Lager ist leer.</div> : (
        <div className="stockGrid">
          {stock.map(({ p, q }) => <div key={p.id} className="stockItem"><p.Icon size={15} color={p.color} /><span className="stockName">{p.name}</span><span className="stockQ">{fl(q)}</span></div>)}
        </div>
      )}
      <button className="resetBtn" onClick={onReset}><RotateCw size={14} /> Spiel zurücksetzen</button>
      <div className="foot">Fortschritt wird automatisch gespeichert.</div>
    </div>
  );
}

/* ------------------------------------------------------------------ EnergySheet */
function EnergySheet({ game, act, onClose }) {
  const now = Date.now();
  const real = !!(game.settings && game.settings.realClock);
  const es = esFor(game, now);
  const sf = solarFactor(now, real), wf = windFactor(now);
  const selfShare = es.demand > 0 ? Math.round((es.selfKW / es.demand) * 100) : 100;
  const has = (kind) => game.buildings.some((b) => b.powerId && POWER[b.powerId].kind === kind);
  const socPct = es.batStore > 0 ? Math.round((es.soc / es.batStore) * 100) : 0;
  const clock = real ? new Date(now).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : null;
  return (
    <div className="sheetWrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead"><span>Energie</span><button className="closeBtn" onClick={onClose}><X size={18} /></button></div>
        <div className="sheetBody">
          <div className="dayCard">
            {es.day ? <Sun size={22} color={C.gold} /> : <Moon size={22} color={C.blue} />}
            <div style={{ flex: 1 }}><div className="dayT">{es.day ? "Tag" : "Nacht"}{clock ? ` · ${clock}` : ""}</div><div className="daySub">Sonne {Math.round(sf * 100)}% · Wind {Math.round(wf * 100)}% · Netzpreis {price(es.gridP)}/kW</div></div>
          </div>
          <button className="toggleRow" onClick={() => act(actions.toggleRealClock)}>
            <div><div className="toggleT">Echte Tageszeit</div><div className="toggleS">{real ? "Solar folgt deiner Uhr" : "Schneller Spiel-Tag (~2 Min)"}</div></div>
            <div className={"switch" + (real ? " on" : "")}><div className="knob" /></div>
          </button>
          <div className="balCard">
            <div className="balRow"><span>Strombedarf (alle Städte)</span><b>{Math.round(es.demand)} kW</b></div>
            <div className="balBar">
              <div style={{ width: `${es.demand > 0 ? clamp((es.selfKW / es.demand) * 100, 0, 100) : 100}%`, background: C.teal }} />
              <div style={{ width: `${es.demand > 0 ? clamp((es.gridImport / es.demand) * 100, 0, 100) : 0}%`, background: C.rose }} />
            </div>
            <div className="balLegend"><span style={{ color: C.teal }}>● Eigen {Math.round(es.selfKW)} kW</span><span style={{ color: C.rose }}>● Netz {Math.round(es.gridImport)} kW</span></div>
            <div className="balCost"><span>Energiekosten</span><b>{money(es.cost * TICKS_PER_MIN)}/min</b></div>
            {es.feedIn > 0.5 && <div className="balCost sub"><span>Einspeisung ins Netz</span><b style={{ color: C.green }}>+{money(es.income * TICKS_PER_MIN)}/min</b></div>}
          </div>
          <div className="secLabel">Erzeugung</div>
          {es.solarCap > 0 && <SrcRow icon={Sun} color={C.gold} name="Photovoltaik" val={`${Math.round(es.solarGen)}/${Math.round(es.solarCap)} kW`} sub={es.day ? "aktiv" : "Nacht — inaktiv"} />}
          {es.windCap > 0 && <SrcRow icon={Wind} color={C.teal} name="Windräder" val={`${Math.round(es.windGen)}/${Math.round(es.windCap)} kW`} sub={`Wind ${Math.round(wf * 100)}%`} />}
          {es.gasCap > 0 && <SrcRow icon={Flame} color={C.rose} name="Gaskraftwerke" val={`${Math.round(es.gasUse)}/${Math.round(es.gasCap)} kW`} sub={es.oilUse > 0 ? `${(es.oilUse * TICKS_PER_MIN).toFixed(1)} Rohöl/min` : (es.oilShort ? "kein Rohöl in Lübeck" : "Standby")} />}
          {es.batStore > 0 && <SrcRow icon={BatteryCharging} color={C.blue} name="Speicher" val={`${socPct}% geladen`} sub={es.socAfter > es.soc ? "lädt" : es.socAfter < es.soc ? "entlädt" : `${Math.round(es.batStore)} kWh`} />}
          <SrcRow icon={Plug} color={es.gridImport > 0 ? C.rose : C.faint} name="Stromnetz" val={`${Math.round(es.gridImport)} kW`} sub={`Import zu ${price(es.gridP)}/kW`} />
          <div className="energyHint">
            {!has("solar") && !has("wind") && !has("gas")
              ? "Du beziehst allen Strom aus dem Netz — teuer. Baue über „Gebäude“ ein Kraftwerk, um Kosten zu senken."
              : "Solar deckt den Tag fast gratis. Für die Nacht brauchst du Speicher oder ein Gaskraftwerk — das verbrennt Rohöl aus deinem Lübecker Lager. Strom & Personal sind stadtübergreifend."}
          </div>
        </div>
      </div>
    </div>
  );
}
function SrcRow({ icon: Ic, color, name, val, sub }) {
  return (
    <div className="srcRow">
      <div className="srcIcon" style={{ background: color + "1e" }}><Ic size={16} color={color} /></div>
      <div style={{ flex: 1, minWidth: 0 }}><div className="srcName">{name}</div><div className="srcSub">{sub}</div></div>
      <div className="srcVal" style={{ color }}>{val}</div>
    </div>
  );
}

function OfflineSheet({ s, onClose }) {
  const up = s.cashDelta >= 0;
  return (
    <div className="sheetWrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead"><span>Willkommen zurück</span><button className="closeBtn" onClick={onClose}><X size={18} /></button></div>
        <div className="sheetBody">
          <div className="offHead"><Clock size={18} color={C.gold} /> Du warst <b>{awayStr(s.elapsed)}</b> weg{s.capped ? " (auf 12 Std begrenzt)" : ""} — dein Kontor lief weiter:</div>
          <div className="offGrid">
            <div className="offStat"><div className="offV" style={{ color: up ? C.green : C.rose }}>{up ? "+" : ""}{money(s.cashDelta)}</div><div className="offL">Bargeld</div></div>
            <div className="offStat"><div className="offV" style={{ color: s.nwDelta >= 0 ? C.green : C.rose }}>{s.nwDelta >= 0 ? "+" : ""}{money(s.nwDelta)}</div><div className="offL">Vermögen</div></div>
          </div>
          {s.produced.length > 0 ? (
            <>
              <div className="secLabel">Produziert</div>
              <div className="stockGrid">
                {s.produced.slice(0, 8).map(({ p, q }) => <div key={p.id} className="stockItem"><p.Icon size={15} color={p.color} /><span className="stockName">{p.name}</span><span className="stockQ">+{fl(q)}</span></div>)}
              </div>
            </>
          ) : <div className="empty">Kein laufender Ertrag — schalte an deinen Betrieben „Auto“ und „Verkauf“ ein, dann produzieren und verkaufen sie auch offline automatisch.</div>}
          {s.workersLost > 0 && <div className="warn" style={{ marginTop: 12 }}><AlertCircle size={12} /> {s.workersLost} Mitarbeiter haben wegen unbezahlter Löhne gekündigt.</div>}
          <button className="foundConfirm" style={{ marginTop: 16 }} onClick={onClose}><Check size={16} /> Weiter</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ sheets */
function BuildSheet({ game, companyId, defaultCity, act, onClose, onBuild, onBuildGen }) {
  const [cid, setCid] = useState(defaultCity);
  const cities = unlockedList(game);
  const inv = game.inventory[cid] || {};

  const Row = ({ def, makes, onBuildIt }) => {
    const mats = buildMats(def.buildCost);
    const affordCash = game.cash >= def.buildCost;
    const have = hasMats(inv, mats);
    const canBuild = affordCash && have;
    let shortCost = 0;
    for (const k of CMATS) { const s = (mats[k] || 0) - (inv[k] || 0); if (s > 0) shortCost += s * (game.market[cid][k]?.price || 0); }
    return (
      <div className="buildItem2">
        <div className="bi2Top">
          <div className="bIcon" style={{ background: def.color + "22", borderColor: def.color + "55" }}><def.Icon size={18} color={def.color} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bName">{def.building}</div>
            <div className="bMakes">{makes}</div>
          </div>
          <div className="buildCost" style={{ color: affordCash ? C.gold : C.faint }}>{money(def.buildCost)}</div>
        </div>
        <div className="matRow">
          {CMATS.map((k) => {
            const mp = PRODUCTS[k], need = mats[k] || 0, h = Math.floor(inv[k] || 0), ok = h >= need;
            return <span key={k} className="matChip" style={{ borderColor: ok ? C.line : C.rose + "66", color: ok ? C.muted : C.rose }}><mp.Icon size={11} color={mp.color} /> {need}{!ok && <b style={{ color: C.rose }}> /{h}</b>}</span>;
          })}
        </div>
        <div className="bi2Actions">
          {!have && <button className="matBuy" disabled={game.cash < shortCost} onClick={() => act(actions.buyMats, cid, mats)}><ShoppingCart size={13} /> Baustoffe kaufen ~{money(shortCost)}</button>}
          <button className="bi2Build" disabled={!canBuild} onClick={() => { onBuildIt(); onClose(); }}><Hammer size={14} /> Bauen</button>
        </div>
      </div>
    );
  };

  return (
    <div className="sheetWrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead"><span>Gebäude bauen</span><button className="closeBtn" onClick={onClose}><X size={18} /></button></div>
        <div className="sheetBody">
          <div className="fLabel">Stadt</div>
          <div className="chipRow" style={{ marginBottom: 8 }}>{cities.map((c) => <button key={c.id} className={"cChip wide" + (c.id === cid ? " on" : "")} onClick={() => setCid(c.id)}>{c.name}</button>)}</div>
          <div className="matHint"><Construction size={12} /> Gebäude brauchen Baustoffe (Stahlträger, Ziegel, Bretter, Fenster) — selbst herstellen oder hier kaufen. Angaben gelten für das Lager in {CITIES[cid].name}.</div>
          {[0, 1, 2, 3].map((t) => (
            <div key={t}>
              <div className="mGroupLabel">{TIER_LABEL[t]}</div>
              {PLIST.filter((p) => p.tier === t).map((p) => (
                <Row key={p.id} def={p} onBuildIt={() => onBuild(cid, p.id)}
                  makes={`${Object.keys(p.inputs).length === 0 ? "Rohstoff" : Object.entries(p.inputs).map(([k, v]) => `${v} ${PRODUCTS[k].name}`).join(" + ")} → ${p.name} ×${p.out}`} />
              ))}
            </div>
          ))}
          <div className="mGroupLabel">Energie</div>
          {POWER_LIST.map((pw) => (
            <Row key={pw.id} def={pw} onBuildIt={() => onBuildGen(cid, pw.id)}
              makes={pw.kind === "solar" ? `${pw.cap} kW · nur bei Tag` : pw.kind === "wind" ? `${pw.cap} kW · windabhängig` : pw.kind === "gas" ? `${pw.cap} kW · verbrennt Rohöl` : `${pw.cap} kW · ${pw.store} kWh Speicher`} />
          ))}
          <div className="energyHint">Strom & Personal wirken stadtübergreifend. Rohstoffe, Zwischenprodukte und Baustoffe müssen in derselben Stadt liegen wie der Betrieb.</div>
        </div>
      </div>
    </div>
  );
}

function FoundSheet({ game, onClose, onFound }) {
  const [name, setName] = useState("");
  const [focus, setFocus] = useState(FOCI[0]);
  const afford = game.cash >= FOUND_COST;
  return (
    <div className="sheetWrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead"><span>Firma gründen</span><button className="closeBtn" onClick={onClose}><X size={18} /></button></div>
        <div className="sheetBody">
          <label className="fLabel">Name</label>
          <input className="fInput" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Ostsee Werke" maxLength={28} />
          <label className="fLabel">Schwerpunkt</label>
          <div className="focusRow">{FOCI.map((f) => <button key={f} className={"focusBtn2" + (focus === f ? " on" : "")} onClick={() => setFocus(f)}>{f}</button>)}</div>
          <button className="foundConfirm" disabled={!afford} onClick={() => onFound(name.trim(), focus)}><Check size={16} /> Gründen <span className="foundCost">{money(FOUND_COST)}</span></button>
          {!afford && <div className="warn"><AlertCircle size={12} /> Nicht genug Bargeld.</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.app{width:100%;max-width:480px;min-height:100dvh;height:100dvh;display:grid;grid-template-columns:1fr;grid-template-rows:auto 1fr auto;grid-template-areas:"top" "main" "nav";background:${C.bg};color:${C.text};position:relative;overflow:hidden;box-shadow:0 0 60px rgba(0,0,0,.5)}
.top{grid-area:top}
.main{grid-area:main}
.nav{grid-area:nav}
.cash,.mPrice,.nwBig,.statV,.qVal,.op,.buildCost,.foundCost,.stockQ,.ctTimer,.repTop b,.bankRow b,.staffTop b,.staffCosts b,.srcVal,.balRow b,.balCost b,.transInfo b,.shipEta,.cmpBest,.cmpSpread{font-family:'JetBrains Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.top{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid ${C.line};background:linear-gradient(180deg,${C.panel},${C.bg})}
.brand{display:flex;align-items:center;gap:10px}
.brandMark{color:${C.gold};font-size:16px;filter:drop-shadow(0 0 6px ${C.gold}66)}
.brandName{font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:.16em;font-size:16px}
.brandSub{font-size:9.5px;color:${C.faint};letter-spacing:.05em;margin-top:1px}
.cashBox{text-align:right}
.cashRow{display:flex;align-items:center;gap:6px;justify-content:flex-end;position:relative}
.cash{font-weight:700;font-size:17px;color:${C.gold}}
.flash{position:absolute;top:-13px;right:0;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace;animation:floatUp 1.1s ease-out forwards}
@keyframes floatUp{0%{opacity:0;transform:translateY(4px)}20%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}
.nwRow{font-size:10px;color:${C.faint};margin-top:2px}.nwRow b{color:${C.muted};font-family:'JetBrains Mono',monospace}
.main{flex:1;overflow-y:auto;overflow-x:hidden}
.pad{padding:14px 14px 26px}
.nav{display:flex;border-top:1px solid ${C.line};background:${C.panel}}
.tabBtn{flex:1;background:none;border:none;color:${C.faint};padding:8px 0 10px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9px;font-weight:600;cursor:pointer;font-family:inherit;transition:color .15s}
.tabBtn.on{color:${C.gold}}
.tabBtn.on svg{filter:drop-shadow(0 0 8px ${C.gold}55)}
.tabIconWrap{position:relative}
.tabBadge{position:absolute;top:-5px;right:-9px;background:${C.gold};color:#20160a;font-size:8.5px;font-weight:700;min-width:14px;height:14px;border-radius:7px;display:flex;align-items:center;justify-content:center;padding:0 3px;font-family:'JetBrains Mono',monospace}
.tabBadge.warn{background:${C.rose};color:#fff}
.welcome{background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:16px;padding:16px;margin-bottom:16px}
.wTitle{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin-bottom:6px;color:${C.gold}}
.welcome p{font-size:13px;line-height:1.55;color:${C.muted};margin:0}.welcome b{color:${C.text}}
.staffBanner,.energyBanner{width:100%;display:flex;align-items:center;gap:11px;background:${C.panel};border:1px solid ${C.gold}44;border-radius:13px;padding:11px 13px;margin-bottom:10px;cursor:pointer;font-family:inherit;color:inherit;text-align:left}
.staffBanner.full{border-color:${C.line}}
.energyBanner{border-color:${C.line2}}
.staffBanner:active,.energyBanner:active{transform:scale(.99)}
.sbText{flex:1;min-width:0}.sbTitle{font-weight:600;font-size:13px}.sbSub{font-size:11px;color:${C.faint};margin-top:1px}
.cityPin{display:inline-flex;align-items:center;gap:2px;font-size:9.5px;color:${C.faint};font-weight:600;vertical-align:middle}
.coCard{background:${C.panel};border:1px solid ${C.line};border-radius:16px;margin-bottom:14px;overflow:hidden;margin-top:4px}
.coHead{display:flex;align-items:center;gap:9px;padding:13px}
.coIcon{width:34px;height:34px;border-radius:10px;background:${C.gold}18;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.coName{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.coMeta{font-size:11px;color:${C.faint};margin-top:1px}
.addBtn{display:flex;align-items:center;gap:4px;background:${C.raise};color:${C.text};border:1px solid ${C.line2};border-radius:9px;padding:7px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0}
.addBtn:active{transform:scale(.96)}
.coDel{width:34px;height:34px;border-radius:9px;border:1px solid ${C.line};background:transparent;color:${C.faint};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
.coDel:active{transform:scale(.94);color:${C.rose}}
.empty{padding:14px 4px;color:${C.faint};font-size:12.5px;line-height:1.5}
.bList{padding:0 11px 12px;display:flex;flex-direction:column;gap:9px}
.bCard{background:${C.panel2};border:1px solid ${C.line};border-radius:12px;padding:11px}
.bTop{display:flex;align-items:center;gap:10px}
.bIcon{width:36px;height:36px;border-radius:10px;border:1px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.bName{font-weight:600;font-size:13.5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.lvChip{font-size:9.5px;font-weight:700;color:${C.gold};background:${C.gold}18;border:1px solid ${C.gold}44;border-radius:5px;padding:1px 5px;font-family:'JetBrains Mono',monospace}
.bMakes{font-size:11px;color:${C.muted};margin-top:2px}.bMakes .x{color:${C.faint}}.bMakes .slow{color:${C.rose}}
.autoBtn{display:flex;align-items:center;gap:4px;background:transparent;color:${C.faint};border:1px solid ${C.line};border-radius:8px;padding:5px 8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0}
.autoBtn.on{color:${C.teal};border-color:${C.teal}66;background:${C.teal}14}
.autoBtn:active{transform:scale(.95)}
.bToggles{display:flex;flex-direction:column;gap:5px;flex-shrink:0}
.autoBtn.sell.on{color:${C.gold};border-color:${C.gold}66;background:${C.gold}14}
.sellNote{display:flex;align-items:center;gap:5px;font-size:10.5px;color:${C.gold};margin-top:8px;opacity:.9}
.genBar{height:8px;background:${C.bg};border-radius:5px;overflow:hidden;border:1px solid ${C.line};margin-top:10px}
.genFill{height:100%;border-radius:5px;transition:width .5s ease}
.inputs{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.inChip{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;border:1px solid ${C.line};border-radius:7px;padding:3px 6px}
.bActions{display:flex;gap:8px;margin-top:10px}
.startBtn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.startBtn .op{font-size:11px;opacity:.7;font-weight:600}
.startBtn:active{transform:scale(.98)}
.startBtn:disabled{background:${C.raise};color:${C.faint};cursor:not-allowed}
.iconBtn{width:40px;border:1px solid ${C.line2};background:${C.raise};color:${C.muted};border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.iconBtn:active{transform:scale(.95)}
.prog{margin-top:11px}
.progTrack{height:12px;background:${C.bg};border-radius:7px;overflow:hidden;border:1px solid ${C.line}}
.progFill{height:100%;background:linear-gradient(90deg,${C.teal},#8ef0e6);border-radius:7px;transition:width .4s linear;position:relative;overflow:hidden}
.progFill:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:sheen 1.4s linear infinite}
@keyframes sheen{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
.progText{font-size:11px;color:${C.muted};margin-top:5px;text-align:center}.progText b{color:${C.teal};font-family:'JetBrains Mono',monospace}
.warn{display:flex;align-items:center;gap:5px;font-size:11px;color:${C.rose};margin-top:8px;line-height:1.4}
.upBar{width:100%;display:flex;align-items:center;justify-content:space-between;margin-top:9px;background:transparent;border:1px solid ${C.line};border-radius:9px;padding:8px 11px;cursor:pointer;font-family:inherit;color:${C.muted}}
.upBar .upLeft{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}
.upBar .upRight{font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace}
.upBar:active{transform:scale(.99)}
.upBar:disabled{opacity:.5;cursor:not-allowed}
.upBar.max{justify-content:center;gap:6px;color:${C.faint};font-size:11.5px;cursor:default}
.foundBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:transparent;border:1px dashed ${C.line2};color:${C.muted};border-radius:14px;padding:13px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.foundBtn:active{transform:scale(.99)}
.foundCost{font-family:'JetBrains Mono',monospace;font-size:11px;color:${C.gold}}
.staffCard{background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:14px;padding:14px;margin-bottom:6px}
.staffTop{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600}.staffTop b{margin-left:auto;font-size:16px;color:${C.gold}}
.staffBar{height:8px;background:${C.bg};border-radius:5px;overflow:hidden;margin:11px 0 7px;border:1px solid ${C.line}}
.staffFill{height:100%;border-radius:5px;transition:width .4s ease}
.staffMeta{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:${C.muted};font-weight:600}
.staffCosts{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:${C.muted};margin-top:9px;padding-top:9px;border-top:1px solid ${C.line}}
.staffCosts.sub{margin-top:5px;padding-top:0;border:none;font-size:11px;color:${C.faint}}.staffCosts b{color:${C.text}}
.staffRow{display:flex;align-items:center;gap:11px;background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:11px;margin-bottom:8px}
.staffIcon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.staffInfo{flex:1;min-width:0}.staffName{font-weight:600;font-size:13.5px}
.staffN{color:${C.gold};font-family:'JetBrains Mono',monospace;font-size:12px;margin-left:2px}
.staffSub{font-size:10.5px;color:${C.faint};margin-top:1px}
.staffBtns{display:flex;gap:6px;flex-shrink:0}
.hireMini{width:38px;height:38px;border-radius:10px;border:1px solid ${C.line2};background:${C.raise};color:${C.muted};display:flex;align-items:center;justify-content:center;cursor:pointer}
.hireMini.plus{background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none}
.hireMini:active{transform:scale(.94)}.hireMini:disabled{opacity:.4;cursor:not-allowed}
.trainRow{display:flex;flex-direction:column;gap:7px;margin-top:4px}
.trainBtn{display:flex;align-items:center;gap:7px;background:${C.panel};border:1px solid ${C.line};color:${C.muted};border-radius:10px;padding:10px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.trainBtn b{margin-left:auto;color:${C.gold};font-family:'JetBrains Mono',monospace}
.trainBtn:active{transform:scale(.99)}.trainBtn:disabled{opacity:.45;cursor:not-allowed}
.staffHint,.energyHint,.transHint,.cmpHint{font-size:10.5px;color:${C.faint};line-height:1.5;margin-top:12px}
.cmpHint{margin-top:0;margin-bottom:8px}
.dayCard{display:flex;align-items:center;gap:13px;background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:14px;padding:14px;margin-bottom:11px}
.dayT{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px}.daySub{font-size:11px;color:${C.faint};margin-top:2px}
.balCard{background:${C.panel};border:1px solid ${C.line};border-radius:14px;padding:14px;margin-bottom:6px}
.balRow{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600}.balRow b{font-size:15px}
.balBar{display:flex;height:12px;background:${C.bg};border-radius:6px;overflow:hidden;border:1px solid ${C.line};margin:10px 0 8px}
.balBar div{height:100%;transition:width .4s ease}
.balLegend{display:flex;justify-content:space-between;font-size:11px;font-weight:600}
.balCost{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:${C.muted};margin-top:11px;padding-top:10px;border-top:1px solid ${C.line}}
.balCost.sub{margin-top:5px;padding-top:0;border:none;font-size:11.5px}.balCost b{color:${C.text}}
.srcRow{display:flex;align-items:center;gap:11px;background:${C.panel};border:1px solid ${C.line};border-radius:11px;padding:10px 12px;margin-bottom:7px}
.toggleRow{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;background:${C.panel};border:1px solid ${C.line2};border-radius:12px;padding:12px 14px;margin-bottom:11px;cursor:pointer;font-family:inherit;color:inherit;text-align:left}
.toggleRow:active{transform:scale(.99)}
.toggleT{font-weight:600;font-size:13px}
.toggleS{font-size:10.5px;color:${C.faint};margin-top:2px}
.switch{width:44px;height:26px;border-radius:14px;background:${C.raise};border:1px solid ${C.line2};position:relative;flex-shrink:0;transition:background .2s}
.switch.on{background:${C.teal}}
.knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:${C.text};transition:left .2s}
.switch.on .knob{left:20px;background:#062421}
.offHead{font-size:13px;color:${C.muted};line-height:1.5;display:flex;align-items:flex-start;gap:8px;margin-bottom:14px}
.offHead b{color:${C.text}}
.offGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px}
.offStat{background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:14px;text-align:center}
.offV{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:19px}
.offL{font-size:10.5px;color:${C.faint};margin-top:3px}
.srcIcon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.srcName{font-weight:600;font-size:13px}.srcSub{font-size:10.5px;color:${C.faint};margin-top:1px}
.srcVal{margin-left:auto;font-weight:700;font-size:13px}
.macroCard{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:14px;padding:12px 14px;margin-bottom:12px}
.macroLeft{flex:1;min-width:0}
.macroPhase{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px}
.macroBarWrap{position:relative;height:7px;background:${C.bg};border-radius:5px;margin-top:8px;border:1px solid ${C.line};overflow:hidden}
.macroZero{position:absolute;left:50%;top:0;bottom:0;width:1px;background:${C.line2}}
.macroBar{height:100%;border-radius:5px;transition:width .5s ease,background .5s ease}
.macroStats{display:flex;gap:16px;flex-shrink:0}
.macroStat{text-align:right}
.macroStat span{display:block;font-size:9.5px;color:${C.faint};text-transform:uppercase;letter-spacing:.05em}
.macroStat b{font-family:'JetBrains Mono',monospace;font-size:14px;color:${C.text}}
.cityTabs{display:flex;gap:6px;overflow-x:auto;margin-bottom:10px;padding-bottom:2px}.cityTab{flex-shrink:0;background:${C.panel};border:1px solid ${C.line};color:${C.muted};border-radius:9px;padding:8px 13px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
.cityTab.on{border-color:${C.gold}77;color:${C.gold};background:${C.gold}12}
.cityBar{display:flex;align-items:center;gap:6px;font-size:11px;color:${C.faint};margin-bottom:12px;flex-wrap:wrap}
.cityBar b{color:${C.text};font-size:12.5px}
.news{background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:10px 12px;margin-bottom:14px;display:flex;flex-direction:column;gap:7px}
.newsItem{display:flex;align-items:center;gap:8px;font-size:11.5px;color:${C.muted}}
.newsDot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.mGroup{margin-bottom:14px}
.mGroupLabel{font-size:11px;color:${C.faint};text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin:0 2px 7px;display:flex;align-items:center;gap:5px}
.mRow{background:${C.panel};border:1px solid ${C.line};border-radius:12px;margin-bottom:8px;overflow:hidden}
.mRow.open{border-color:${C.line2}}
.mRowMain{width:100%;display:flex;align-items:center;gap:10px;background:none;border:none;color:inherit;padding:10px 11px;cursor:pointer;font-family:inherit}
.mIcon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mNameWrap{min-width:66px;text-align:left}.mName{font-weight:600;font-size:13.5px}.mTag{font-size:10px;margin-top:1px}
.mPriceWrap{margin-left:auto;text-align:right}.mPrice{font-weight:700;font-size:14px}
.mBase{display:flex;align-items:center;gap:3px;justify-content:flex-end;font-size:9.5px;color:${C.faint};margin-top:1px;font-family:'JetBrains Mono',monospace}
.mChevron{transition:transform .2s;flex-shrink:0}.mRow.open .mChevron{transform:rotate(180deg)}
.trade{padding:0 11px 12px;border-top:1px solid ${C.line};margin-top:2px;padding-top:11px}
.qtyRow{display:flex;align-items:center;gap:7px;margin-bottom:9px;flex-wrap:wrap}
.qBtn{width:34px;height:34px;border-radius:9px;border:1px solid ${C.line2};background:${C.raise};color:${C.text};font-size:18px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center}
.qBtn:active{transform:scale(.94)}
.qVal{min-width:38px;text-align:center;font-size:15px;font-weight:700}
.qQuick{border:1px solid ${C.line};background:transparent;color:${C.muted};border-radius:8px;padding:7px 9px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}
.tradeBtns{display:flex;gap:8px}
.buyBtn,.sellBtn{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;border:none;border-radius:10px;padding:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.buyBtn span,.sellBtn span{font-size:11px;font-weight:600;font-family:'JetBrains Mono',monospace;opacity:.85}
.buyBtn{background:${C.raise};color:${C.text};border:1px solid ${C.line2}}
.sellBtn{background:linear-gradient(180deg,${C.teal},#1ea99b);color:#062421}
.buyBtn:active,.sellBtn:active{transform:scale(.98)}
.buyBtn:disabled,.sellBtn:disabled{opacity:.4;cursor:not-allowed}
.mapWrap{background:${C.sea};border:1px solid ${C.line2};border-radius:16px;overflow:hidden;margin-bottom:12px;padding:6px}
.mapSvg{width:100%;height:392px;display:block}
.focusCard{background:${C.panel};border:1px solid ${C.line2};border-radius:14px;padding:13px;margin-bottom:6px}
.focusHead{display:flex;align-items:center;gap:11px}
.focusPin{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.focusName{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;display:flex;align-items:center;gap:7px}
.homeTag{font-size:9px;font-weight:700;color:${C.gold};background:${C.gold}18;border-radius:5px;padding:1px 5px;letter-spacing:.03em}
.focusSpec{font-size:11px;color:${C.faint};margin-top:2px;line-height:1.4}
.focusActions{display:flex;align-items:center;gap:10px;margin-top:11px}
.focusStat{font-size:12px;color:${C.muted};font-weight:600}
.focusBtn{margin-left:auto;display:flex;align-items:center;gap:5px;background:${C.raise};border:1px solid ${C.line2};color:${C.text};border-radius:9px;padding:8px 13px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit}
.focusBtn:active{transform:scale(.97)}
.unlockBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:11px;background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.unlockBtn span{font-family:'JetBrains Mono',monospace}
.unlockBtn:disabled{background:${C.raise};color:${C.faint};cursor:not-allowed}
.transCard{background:${C.panel};border:1px solid ${C.line};border-radius:14px;padding:13px}
.transRow{display:flex;align-items:flex-start;gap:9px;margin-bottom:9px}
.transLbl{font-size:11px;color:${C.faint};font-weight:600;width:34px;flex-shrink:0;padding-top:7px}
.chipRow{display:flex;gap:6px;flex-wrap:wrap;flex:1}
.cChip{background:${C.raise};border:1px solid ${C.line2};color:${C.muted};border-radius:8px;padding:7px 11px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
.cChip.on{border-color:${C.gold}77;color:${C.gold};background:${C.gold}12}
.cChip.wide{padding:8px 12px}
.gChip{display:flex;align-items:center;gap:4px;background:${C.raise};border:1px solid ${C.line2};color:${C.muted};border-radius:8px;padding:6px 9px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'JetBrains Mono',monospace}
.gChip.on{border-color:${C.teal}77;color:${C.teal};background:${C.teal}12}
.transEmpty{font-size:11.5px;color:${C.faint};padding-top:7px}
.transInfo{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:${C.muted};margin:10px 0}.transInfo b{color:${C.text}}
.shipBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;background:linear-gradient(180deg,${C.teal},#1ea99b);color:#062421;border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.shipBtn:active{transform:scale(.98)}
.shipBtn:disabled{background:${C.raise};color:${C.faint};cursor:not-allowed}
.shipRow{display:flex;align-items:center;gap:10px;background:${C.panel};border:1px solid ${C.line};border-radius:11px;padding:10px 12px;margin-bottom:7px}
.shipTitle{font-size:12.5px;font-weight:600}
.shipRoute{color:${C.teal};font-family:'JetBrains Mono',monospace;font-size:11px;margin-left:4px}
.shipTrack{height:6px;background:${C.bg};border-radius:4px;overflow:hidden;border:1px solid ${C.line};margin-top:6px}
.shipFill{height:100%;background:linear-gradient(90deg,${C.teal},#8ef0e6);border-radius:4px;transition:width .4s linear}
.shipEta{display:flex;align-items:center;gap:4px;font-size:11px;color:${C.muted};flex-shrink:0}
.cmpList{display:flex;flex-direction:column;gap:6px}
.cmpRow{display:flex;align-items:center;gap:8px;background:${C.panel};border:1px solid ${C.line};border-radius:10px;padding:9px 11px}
.cmpName{font-size:12.5px;color:${C.muted};flex:1}
.cmpBest{font-size:12px;font-weight:700;color:${C.teal}}
.cmpSpread{font-size:11px;color:${C.gold};min-width:52px;text-align:right}
.repCard{background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:14px;padding:14px;margin-bottom:16px}
.repTop{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600}.repTop b{margin-left:auto;font-size:16px;color:${C.gold}}
.repMax{color:${C.faint};font-size:11px;font-family:'JetBrains Mono',monospace}
.repTrack{height:8px;background:${C.bg};border-radius:5px;overflow:hidden;margin:9px 0 7px;border:1px solid ${C.line}}
.repFill{height:100%;background:linear-gradient(90deg,${C.goldDim},${C.gold});border-radius:5px;transition:width .4s ease}
.repHint{font-size:10.5px;color:${C.faint};line-height:1.5}
.bankCard{background:${C.panel};border:1px solid ${C.line};border-radius:14px;padding:14px;margin-bottom:12px}
.bankTop{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;margin-bottom:10px}
.bankRate{margin-left:auto;font-size:10px;color:${C.faint};font-weight:500}
.bankRow{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:${C.muted};padding:3px 0}.bankRow b{color:${C.text}}
.bankBtns{display:flex;gap:7px;margin-top:11px}
.loanBtn{flex:1;background:${C.raise};border:1px solid ${C.line2};color:${C.text};border-radius:9px;padding:9px 6px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}
.loanBtn.repay{background:transparent;color:${C.muted}}
.loanBtn:active{transform:scale(.97)}.loanBtn:disabled{opacity:.4;cursor:not-allowed}
.secLabel{font-size:11px;color:${C.faint};text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin:16px 2px 9px;display:flex;align-items:center;gap:5px}
.goalList{display:flex;flex-direction:column;gap:7px}
.goalItem{display:flex;align-items:center;gap:9px;background:${C.panel};border:1px solid ${C.line};border-radius:10px;padding:10px 12px}
.goalItem.done{border-color:${C.green}33;background:linear-gradient(90deg,${C.green}0d,${C.panel})}
.goalLabel{font-size:12.5px;color:${C.muted}}.goalItem.done .goalLabel{color:${C.text}}
.goalReward{margin-left:auto;font-size:11px;font-weight:700;color:${C.gold};font-family:'JetBrains Mono',monospace}
.ctCard{background:${C.panel};border:1px solid ${C.line};border-radius:13px;padding:12px;margin-bottom:9px;position:relative}
.ctCard.active{border-color:${C.gold}44;background:linear-gradient(180deg,${C.panel2},${C.panel})}
.ctBadge{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 7px;border-radius:6px;margin-bottom:9px}
.ctBadge.sell{background:${C.gold}18;color:${C.gold}}
.ctBadge.supply{background:${C.teal}18;color:${C.teal}}
.ctHead{display:flex;align-items:center;gap:10px}
.ctTitle{font-weight:600;font-size:14px}.ctClient{color:${C.faint};font-weight:400;font-size:12px}
.ctSub{font-size:11.5px;color:${C.muted};margin-top:2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap}.ctSub b{color:${C.text}}
.ctTimer{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:${C.muted};flex-shrink:0}.ctTimer.urgent{color:${C.rose}}
.ctProgWrap{display:flex;align-items:center;gap:9px;margin:11px 0}
.ctProgTrack{flex:1;height:9px;background:${C.bg};border-radius:5px;overflow:hidden;border:1px solid ${C.line}}
.ctProgFill{height:100%;border-radius:5px;transition:width .3s ease}
.ctProgTxt{font-size:11px;color:${C.muted};font-family:'JetBrains Mono',monospace;min-width:44px;text-align:right}
.deliverBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a}
.deliverBtn:active{transform:scale(.98)}
.deliverBtn:disabled{background:${C.raise};color:${C.faint};cursor:not-allowed}
.ctFoot{display:flex;align-items:center;justify-content:space-between;margin-top:11px;gap:10px}
.ctMeta{font-size:10.5px;color:${C.faint}}
.acceptBtn{background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none;border-radius:9px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0}
.acceptBtn.buy{background:linear-gradient(180deg,${C.teal},#1ea99b);color:#062421}
.acceptBtn:active{transform:scale(.97)}.acceptBtn:disabled{opacity:.4;cursor:not-allowed}
.nwCard{background:linear-gradient(135deg,${C.panel2},${C.panel});border:1px solid ${C.line2};border-radius:16px;padding:16px;margin-bottom:12px}
.nwLabel{font-size:11px;color:${C.faint};text-transform:uppercase;letter-spacing:.08em}
.nwBig{font-size:30px;font-weight:700;color:${C.gold};margin:4px 0 12px}
.nwBreak{display:flex;flex-direction:column;gap:6px}
.nwBreak span{display:flex;align-items:center;gap:7px;font-size:12px;color:${C.muted}}
.nwBreak b{margin-left:auto;font-family:'JetBrains Mono',monospace;color:${C.text}}
.statGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.stat{background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px}
.statV{font-size:15px;font-weight:700}.statL{font-size:10.5px;color:${C.faint}}
.stockGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stockItem{display:flex;align-items:center;gap:7px;background:${C.panel};border:1px solid ${C.line};border-radius:10px;padding:9px 11px}
.stockName{font-size:12.5px;color:${C.muted}}.stockQ{margin-left:auto;font-weight:700;font-size:14px}
.resetBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent;border:1px solid ${C.rose}44;color:${C.rose};border-radius:12px;padding:11px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;margin-top:22px}
.foot{text-align:center;font-size:10.5px;color:${C.faint};margin-top:10px}
.toast{position:absolute;left:14px;right:14px;bottom:74px;z-index:30;display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,${C.panel2},${C.raise});border:1px solid ${C.gold}55;border-radius:14px;padding:13px 15px;box-shadow:0 10px 30px rgba(0,0,0,.5);animation:toastIn .35s cubic-bezier(.2,.8,.2,1)}
@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.toastT{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:${C.gold}}
.toastL{font-size:11.5px;color:${C.muted};margin-top:1px}
.sheetWrap{position:absolute;inset:0;background:rgba(3,8,14,.62);backdrop-filter:blur(3px);display:flex;align-items:flex-end;z-index:20;animation:fade .2s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.sheet{width:100%;background:${C.bg};border-top:1px solid ${C.line2};border-radius:22px 22px 0 0;max-height:85%;display:flex;flex-direction:column;animation:slideUp .26s cubic-bezier(.2,.8,.2,1)}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sheetHead{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 10px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;border-bottom:1px solid ${C.line}}
.closeBtn{background:${C.raise};border:1px solid ${C.line2};color:${C.muted};width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.sheetBody{padding:12px 14px 24px;overflow-y:auto}
.buildItem{width:100%;display:flex;align-items:center;gap:11px;background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:11px;margin-bottom:8px;cursor:pointer;font-family:inherit;color:inherit}
.buildItem2{background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:11px;margin-bottom:8px}
.bi2Top{display:flex;align-items:center;gap:11px}
.matRow{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.matChip{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;border:1px solid ${C.line};border-radius:7px;padding:3px 7px;font-family:'JetBrains Mono',monospace}
.bi2Actions{display:flex;gap:7px;margin-top:10px}
.bi2Build{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none;border-radius:9px;padding:9px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}
.bi2Build:disabled{background:${C.raise};color:${C.faint};cursor:not-allowed}
.bi2Build:active{transform:scale(.98)}
.matBuy{display:flex;align-items:center;justify-content:center;gap:5px;background:${C.raise};border:1px solid ${C.line2};color:${C.text};border-radius:9px;padding:9px 11px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.matBuy:disabled{opacity:.45;cursor:not-allowed}
.matBuyMini{display:inline-flex;align-items:center;gap:3px;background:${C.raise};border:1px solid ${C.line2};color:${C.muted};border-radius:7px;padding:3px 7px;font-size:10.5px;font-weight:600;cursor:pointer;font-family:'JetBrains Mono',monospace;margin-left:auto}
.matBuyMini:disabled{opacity:.45;cursor:not-allowed}
.matHint{font-size:10.5px;color:${C.faint};line-height:1.5;margin-bottom:12px;display:flex;align-items:flex-start;gap:6px}
.buildItem:active{transform:scale(.99)}.buildItem:disabled{opacity:.45;cursor:not-allowed}
.fLabel{display:block;font-size:11px;color:${C.faint};text-transform:uppercase;letter-spacing:.06em;margin:4px 2px 6px}
.fInput{width:100%;background:${C.panel};border:1px solid ${C.line2};color:${C.text};border-radius:11px;padding:12px;font-size:14px;font-family:inherit;margin-bottom:14px;outline:none}
.fInput:focus{border-color:${C.gold}77}
.focusRow{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}
.focusBtn2{border:1px solid ${C.line};background:${C.panel};color:${C.muted};border-radius:9px;padding:8px 12px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit}
.focusBtn2.on{border-color:${C.gold}77;color:${C.gold};background:${C.gold}12}
.foundConfirm{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(180deg,${C.gold},${C.goldDim});color:#20160a;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.foundConfirm:disabled{opacity:.45;cursor:not-allowed}.foundConfirm .foundCost{color:#20160a;opacity:.7}
.main::-webkit-scrollbar,.sheetBody::-webkit-scrollbar,.cityTabs::-webkit-scrollbar{width:0;height:0}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media (min-width:680px){
  .app{max-width:740px}
  .pad{max-width:700px;margin:0 auto}
  .statGrid{grid-template-columns:repeat(3,1fr)}
  .stockGrid{grid-template-columns:repeat(3,1fr)}
  .mapSvg{height:440px}
  .sheetWrap{align-items:center}
  .sheet{max-width:560px;margin:0 auto;border-radius:20px;max-height:84%}
}
@media (min-width:1024px){
  .app{max-width:1240px;grid-template-columns:236px 1fr;grid-template-rows:auto 1fr;grid-template-areas:"top top" "nav main"}
  .nav{flex-direction:column;border-top:none;border-right:1px solid ${C.line};align-items:stretch;gap:4px;padding:14px 10px;background:${C.panel}}
  .tabBtn{flex-direction:row;justify-content:flex-start;gap:14px;padding:12px 15px;font-size:13.5px;border-radius:11px;color:${C.muted}}
  .tabBtn span{font-size:13.5px}
  .tabBtn.on{background:${C.gold}14;color:${C.gold}}
  .tabIconWrap{display:flex;align-items:center}
  .pad{max-width:900px;margin:0 auto;padding:22px 26px 44px}
  .statGrid{grid-template-columns:repeat(4,1fr)}
  .stockGrid{grid-template-columns:repeat(4,1fr)}
  .goalList{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .mapWrap{max-width:620px;margin:0 auto 12px}
  .mapSvg{height:520px}
  .toast{left:auto;right:24px;bottom:24px;max-width:360px}
}
@media (min-width:1024px) and (hover:hover){
  .coCard:hover,.mRow:hover,.ctCard:hover{border-color:${C.line2}}
}
`;
