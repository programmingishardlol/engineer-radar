import { Dashboard } from "@/components/Dashboard";
import { getMockUpdates } from "@/lib/mockUpdates";
import { sourceRegistry } from "@/lib/sources";

export default function Home() {
  const updates = getMockUpdates();

  return <Dashboard initialUpdates={updates} sources={sourceRegistry} />;
}
