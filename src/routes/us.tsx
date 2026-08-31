import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/us")({
  component: () => <Outlet />,
});
