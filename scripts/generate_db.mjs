#!/usr/bin/env node
import fs from 'fs';

async function main() {
  try {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    db.run(
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

    const raw = fs.readFileSync(new URL('../data/cases.json', import.meta.url), 'utf8');
    const cases = JSON.parse(raw);

    db.run('BEGIN');
    const insertSql = `INSERT OR REPLACE INTO cases (id,citizenName,citizenId,predictedCrime,riskScore,status,flaggedAt,district,aiSummary,triggers,suspiciousPhrases,features,evidence,biasWarning) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    for (const c of cases) {
      db.run(insertSql, [
        c.id,
        c.citizenName,
        c.citizenId,
        c.predictedCrime,
        c.riskScore,
        c.status,
        c.flaggedAt,
        c.district,
        c.aiSummary,
        JSON.stringify(c.triggers || []),
        JSON.stringify(c.suspiciousPhrases || []),
        JSON.stringify(c.features || []),
        JSON.stringify(c.evidence || []),
        c.biasWarning ?? null,
      ]);
    }
    db.run('COMMIT');

    const data = db.export();
    const outPath = new URL('../data/cases.db', import.meta.url);
    fs.writeFileSync(outPath, Buffer.from(data));
    console.log('Wrote data/cases.db');

    // Also ensure a copy is placed under public/ so the dev server can serve it.
    try {
      const publicDir = new URL('../public/data/', import.meta.url);
      fs.mkdirSync(publicDir, { recursive: true });
      const publicOut = new URL('../public/data/cases.db', import.meta.url);
      fs.writeFileSync(publicOut, Buffer.from(data));
      console.log('Wrote public/data/cases.db');
    } catch (e) {
      console.warn('Could not write public/data/cases.db:', e?.message || e);
    }

    // Try to copy the sql-wasm.wasm from the installed sql.js package into public/
    try {
      const candidatePaths = [
        '../node_modules/sql.js/dist/sql-wasm.wasm',
        '../../node_modules/sql.js/dist/sql-wasm.wasm',
        '../node_modules/sql.js/dist/sql-wasm-browser.wasm',
      ];
      let copied = false;
      for (const p of candidatePaths) {
        try {
          const src = new URL(p, import.meta.url);
          const dest = new URL('../public/sql-wasm.wasm', import.meta.url);
          fs.copyFileSync(src, dest);
          console.log('Copied', src.pathname, 'to public/sql-wasm.wasm');
          copied = true;
          break;
        } catch (err) {
          // try next
        }
      }
      if (!copied) console.warn('sql-wasm.wasm not found in node_modules; please copy it to public/sql-wasm.wasm manually if running the app in the browser.');
    } catch (e) {
      console.warn('Failed to copy sql-wasm.wasm:', e?.message || e);
    }
  } catch (err) {
    console.error('Failed to generate DB:', err);
    process.exit(1);
  }
}

main();
