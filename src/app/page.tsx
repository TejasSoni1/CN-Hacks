import { ChimpManagerApp } from "@/components/app/ChimpManagerApp";
import { getProjectState } from "@/lib/store";

export default function HomePage() {
  const initialState = getProjectState();
  return <ChimpManagerApp initialState={initialState} />;
}
