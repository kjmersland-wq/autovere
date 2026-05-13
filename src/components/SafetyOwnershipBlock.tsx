import { useSafetyIntelligence } from "@/hooks/use-safety-intelligence";
import { SafetyConfidence, OwnershipIntelligence } from "@/components/SafetyOwnership";
import type { Car } from "@/data/cars";
import { useLoc } from "@/lib/loc";

export const SafetyOwnershipBlock = ({ car }: { car: Car }) => {
  const { l } = useLoc();
  const { data, loading } = useSafetyIntelligence(car.name, l(car.type), l(car.lifestyle));
  return (
    <>
      <SafetyConfidence data={data} loading={loading} />
      <OwnershipIntelligence data={data} loading={loading} carName={car.name} />
    </>
  );
};
