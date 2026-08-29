import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import type { ProjectState } from "./types";
import { initialState } from "./seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "project-state.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getProjectState(): ProjectState {
  ensureDataDir();
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as ProjectState;
  }
  saveProjectState(initialState);
  return initialState;
}

export function saveProjectState(state: ProjectState) {
  ensureDataDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function resetProjectState() {
  saveProjectState(structuredClone(initialState));
  return getProjectState();
}

const XLSX_PATH = path.join(
  process.cwd(),
  "chimpmanager_ai_hackathon_demo_database.xlsx"
);

export function loadCrmFromExcel(): Record<string, unknown[]> | null {
  if (!fs.existsSync(XLSX_PATH)) return null;

  const workbook = XLSX.readFile(XLSX_PATH);
  const sheets: Record<string, unknown[]> = {};

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    sheets[sheetName] = XLSX.utils.sheet_to_json(sheet);
  }

  return sheets;
}

export function getExcelSheetNames(): string[] {
  if (!fs.existsSync(XLSX_PATH)) return [];
  const workbook = XLSX.readFile(XLSX_PATH);
  return workbook.SheetNames;
}
