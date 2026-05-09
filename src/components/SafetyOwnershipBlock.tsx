import { useSafetyIntelligence } from "@/hooks/use-safety-intelligence";
import { SafetyConfidence, OwnershipIntelligence } from "@/components/SafetyOwnership";
import { RequirePremium } from "@/components/RequirePremium";
import { usePremium } from "@/hooks/usePremium";
import type { Car } from "@/data/cars";

export const SafetyOwnershipBlock = ({ car }: { car: Car }) => {
  const { isPremium } = usePremium();
  const { data, loading } = useSafetyIntelligence(car.name, car.type, car.lifestyle, isPremium);
  return (
    <RequirePremium fallbackHeightClassName="min-h-[420px]">
      <SafetyConfidence data={data} loading={loading} />
      <OwnershipIntelligence data={data} loading={loading} carName={car.name} />
    </RequirePremium>
  );
};
