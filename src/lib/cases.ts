export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Evidence {
  id: string;
  type: "email" | "chat" | "receipt" | "log" | "transaction";
  title: string;
  source: string;
  timestamp: string;
  preview: string;
  flagged: boolean;
}

export interface FeatureWeight {
  feature: string;
  weight: number; // 0..1
  reasoning: string;
  biased?: boolean;
}

export interface Case {
  id: string;
  citizenName: string;
  citizenId: string;
  predictedCrime: string;
  riskScore: number; // 0..100
  status: "pending" | "auditing" | "cleared";
  flaggedAt: string;
  district: string;
  aiSummary: string;
  triggers: string[];
  suspiciousPhrases: string[];
  features: FeatureWeight[];
  evidence: Evidence[];
  biasWarning?: string;
}

import casesData from "../../data/cases.json";

const SEED_CASES: Case[] = casesData as Case[];

// Keep a synchronous export for compatibility with existing loaders/UI.
export const cases: Case[] = SEED_CASES;

// SQLite (sql.js) backend: initialize in background and seed the DB so the project can
// optionally use SQL for queries. If sql.js isn't installed or fails to init, we silently
// continue using the in-memory `cases` array.
let _SQL: any = null;
let _db: any = null;
let _dbReady = false;

async function ensureDb() {
  if (_dbReady) return;
  try {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({ locateFile: (file: string) => `/sql-wasm.wasm` });
    _SQL = SQL;

    // Try to fetch an existing binary DB served under /data/cases.db. If present,
    // load it into sql.js so the browser uses the durable DB. Otherwise, create
    // a fresh in-memory DB and seed it from `SEED_CASES`.
    try {
      const res = await fetch('/data/cases.db');
      if (res.ok) {
        const bytes = new Uint8Array(await res.arrayBuffer());
        _db = new SQL.Database(bytes);
        _dbReady = true;
        return;
      }
    } catch (e) {
      // fetch failed; fall back to in-memory DB
    }

    _db = new SQL.Database();

    _db.run(
      `CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        citizenName TEXT,
        citizenId TEXT,
        predictedCrime TEXT,
        riskScore INTEGER,
        status TEXT,
        flaggedAt TEXT,
        district TEXT,
        aiSummary TEXT,
        triggers TEXT,
        suspiciousPhrases TEXT,
        features TEXT,
        evidence TEXT,
        biasWarning TEXT
      )`
    );

    // check whether table already populated
    const res2 = _db.exec("SELECT COUNT(1) AS cnt FROM cases");
    const cnt = res2?.[0]?.values?.[0]?.[0] ?? 0;
    if (cnt === 0) {
      _db.run('BEGIN');
      const insertSql = `INSERT INTO cases (id,citizenName,citizenId,predictedCrime,riskScore,status,flaggedAt,district,aiSummary,triggers,suspiciousPhrases,features,evidence,biasWarning) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      for (const c of SEED_CASES) {
        _db.run(insertSql, [
          c.id,
          c.citizenName,
          c.citizenId,
          c.predictedCrime,
          c.riskScore,
          c.status,
          c.flaggedAt,
          c.district,
          c.aiSummary,
          JSON.stringify(c.triggers),
          JSON.stringify(c.suspiciousPhrases),
          JSON.stringify(c.features),
          JSON.stringify(c.evidence),
          c.biasWarning ?? null,
        ]);
      }
      _db.run('COMMIT');
    }

    _dbReady = true;
  } catch (err) {
    // sql.js not available or failed to init; keep using in-memory seed
    _dbReady = false;
  }
}

export async function getAllCasesFromDb(): Promise<Case[]> {
  await ensureDb();
  if (!_dbReady) return cases;
  const rows = _db.exec('SELECT * FROM cases');
  if (!rows || rows.length === 0) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals: any[]) => {
    const obj: any = {};
    cols.forEach((c: string, i: number) => (obj[c] = vals[i]));
    return {
      ...obj,
      riskScore: Number(obj.riskScore),
      triggers: JSON.parse(obj.triggers || '[]'),
      suspiciousPhrases: JSON.parse(obj.suspiciousPhrases || '[]'),
      features: JSON.parse(obj.features || '[]'),
      evidence: JSON.parse(obj.evidence || '[]'),
    } as Case;
  });
}

export async function getCaseFromDb(id: string): Promise<Case | undefined> {
  await ensureDb();
  if (!_dbReady) return cases.find((c) => c.id === id);
  const stmt = _db.prepare('SELECT * FROM cases WHERE id = ?');
  const ok = stmt.getAsObject([id]);
  stmt.free && stmt.free();
  if (!ok || !ok.id) return undefined;
  return {
    ...ok,
    riskScore: Number(ok.riskScore),
    triggers: JSON.parse(ok.triggers || '[]'),
    suspiciousPhrases: JSON.parse(ok.suspiciousPhrases || '[]'),
    features: JSON.parse(ok.features || '[]'),
    evidence: JSON.parse(ok.evidence || '[]'),
  } as Case;
}

// Backwards-compatible synchronous accessor used by routes/loaders.
export function getCase(id: string): Case | undefined {
  return cases.find((c) => c.id === id);
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function riskColor(score: number): string {
  const lvl = riskLevel(score);
  return {
    critical: "danger",
    high: "secondary",
    medium: "warning",
    low: "success",
  }[lvl];
}
