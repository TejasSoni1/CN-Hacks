import { NextResponse } from "next/server";
import { getProjectState, getExcelSheetNames, loadCrmFromExcel } from "@/lib/store";

export async function GET() {
  const state = getProjectState();
  const excel = loadCrmFromExcel();
  const sheetNames = getExcelSheetNames();

  return NextResponse.json({
    sheetNames,
    excelLoaded: !!excel,
    excelRowCounts: excel
      ? Object.fromEntries(
          Object.entries(excel).map(([k, v]) => [k, (v as unknown[]).length])
        )
      : null,
    crmCounts: {
      organizations: state.organizations.length,
      contacts: state.contacts.length,
      employees: state.employees.length,
      projects: state.projects.length,
      meetings: state.meetings.length,
      requirements: state.requirements.length,
      risks: state.risks.length,
      dependencies: state.dependencies.length,
    },
  });
}
