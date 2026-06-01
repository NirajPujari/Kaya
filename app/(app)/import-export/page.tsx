"use client";
import { useState, useRef } from "react";
import { Download, Upload, Database, AlertTriangle, Check, RefreshCw } from "lucide-react";

export default function ImportExportPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<"templates" | "full">("templates");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/import-export/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ironlog-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleFileImport(file: File) {
    setImporting(true);
    setImportResult(null);
    setImportError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/import-export/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: json, mode: importMode }),
      });
      const result = await res.json();
      if (result.success) {
        const counts = Object.entries(result.data)
          .map(([k, v]) => `${v} ${k}`)
          .join(", ");
        setImportResult(`Successfully imported: ${counts}`);
      } else {
        setImportError(String(result.error));
      }
    } catch (e) {
      setImportError("Invalid JSON file: " + String(e));
    } finally {
      setImporting(false);
    }
  }

  async function handleSeed() {
    setImporting(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setImportResult(json.message);
      } else {
        setImportError(json.error);
      }
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">Import & Export</h2>
        <p className="text-(--text-muted) text-sm mt-1">Backup and restore your workout data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export section */}
        <div className="workout-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl btn-fire flex items-center justify-center">
              <Download size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Export Data</h3>
              <p className="text-xs text-(--text-muted)">Download your full database as JSON</p>
            </div>
          </div>
          <p className="text-sm text-(--text-secondary) mb-4">
            Exports all workout logs, exercise logs, personal records, rest days, settings, and workout templates.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full btn-fire py-3 font-bold flex items-center justify-center gap-2"
          >
            {exporting ? (
              <><RefreshCw size={16} className="animate-spin" /> Exporting...</>
            ) : (
              <><Download size={16} /> Export Full Database</>
            )}
          </button>
        </div>

        {/* Import section */}
        <div className="workout-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-(--accent-blue)/20 border border-(--accent-blue)/30 flex items-center justify-center">
              <Upload size={18} className="text-(--accent-blue)" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Import Data</h3>
              <p className="text-xs text-(--text-muted)">Restore from a JSON backup</p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            {(["templates", "full"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setImportMode(mode)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize border ${
                  importMode === mode
                    ? "border-(--accent-blue)/50 bg-(--accent-blue)/10 text-(--accent-blue)"
                    : "border-(--border-default) text-(--text-muted)"
                }`}
              >
                {mode === "templates" ? "Templates Only" : "Full Restore"}
              </button>
            ))}
          </div>

          {importMode === "full" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-900/20 border border-amber-500/30 mb-4">
              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Full restore will add all data from the backup. Duplicate records may be created.
              </p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileImport(file);
            }}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="w-full py-3 rounded-xl border-2 border-dashed border-(--border-default) text-(--text-secondary) hover:border-(--accent-blue)/50 hover:text-(--accent-blue) transition-all font-medium flex items-center justify-center gap-2 mb-3"
          >
            {importing ? (
              <><RefreshCw size={16} className="animate-spin" /> Importing...</>
            ) : (
              <><Upload size={16} /> Choose JSON File</>
            )}
          </button>

          {/* Result messages */}
          {importResult && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-900/20 border border-green-500/30">
              <Check size={14} className="text-green-400 shrink-0 mt-0.5" />
              <p className="text-xs text-green-300">{importResult}</p>
            </div>
          )}
          {importError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{importError}</p>
            </div>
          )}
        </div>

        {/* Seed data */}
        <div className="workout-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-(--accent-green)/20 border border-(--accent-green)/30 flex items-center justify-center">
              <Database size={18} className="text-(--accent-green)" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Seed Sample Data</h3>
              <p className="text-xs text-(--text-muted)">Load the 4-day PPL training split</p>
            </div>
          </div>
          <p className="text-sm text-(--text-secondary) mb-4">
            Populates the exercise library and creates a 4-day Upper/Lower + Push/Pull workout plan. Safe to run multiple times.
          </p>
          <button
            onClick={handleSeed}
            disabled={importing}
            className="w-full py-3 rounded-xl border border-(--accent-green)/30 bg-(--accent-green)/10 text-(--accent-green) hover:bg-(--accent-green)/20 transition-all font-medium flex items-center justify-center gap-2"
          >
            {importing ? (
              <><RefreshCw size={16} className="animate-spin" /> Seeding...</>
            ) : (
              <><Database size={16} /> Load Sample Data</>
            )}
          </button>
        </div>

        {/* Data format info */}
        <div className="workout-card p-6">
          <h3 className="font-bold text-foreground mb-3">Export Format</h3>
          <pre className="text-xs text-(--text-muted) bg-(--bg-elevated) rounded-lg p-4 overflow-auto font-mono leading-relaxed">
{`{
  "version": "1.0",
  "exportedAt": "2024-01-01T00:00:00Z",
  "data": {
    "workoutTemplates": [...],
    "workoutLogs": [...],
    "exerciseLogs": [...],
    "personalRecords": [...],
    "restDays": [...],
    "settings": [...]
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
