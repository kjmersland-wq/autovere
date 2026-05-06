import { useSafetyIntelligence } from "@/hooks/use-safety-intelligence";
import { SafetyConfidence, OwnershipIntelligence } from "@/components/SafetyOwnership";
import type { Car } from "@/data/cars";

export const SafetyOwnershipBlock = ({ car }: { car: Car }) => {
  const { data, loading } = useSafetyIntelligence(car.name, car.type, car.lifestyle);
  return (
    <>
      <SafetyConfidence data={data} loading={loading} />
      <OwnershipIntelligence data={data} loading={loading} carName={car.name} />
    </>
  );
};
