import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StagingBanner } from "@/components/StagingGate";

export const Route = createFileRoute("/ca")({
  component: CanadaLayout,
});

function CanadaLayout() {
  return (
    <>
      <StagingBanner />
      <Outlet />
    </>
  );
}
