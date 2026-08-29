import { Header } from "@/components/Header";

export default function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-8">
      <Header title={title} subtitle={subtitle} />
      <p className="text-slate-500">Coming soon for hackathon MVP.</p>
    </div>
  );
}
