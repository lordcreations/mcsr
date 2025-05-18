import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brazilStates } from "@/lib/countries";
import Image from "next/image";

interface ProfileStateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  disabled?: boolean;
}

export function ProfileStateSelector({ selectedState, onStateChange, disabled = false }: ProfileStateSelectorProps) {
  return (
    <Select
      value={selectedState}
      onValueChange={onStateChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select your state" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {brazilStates.map((state) => (
          <SelectItem key={state.code} value={state.code}>
            <div className="flex items-center gap-2">
              <Image
                src={`/flags/states/${state.code.toUpperCase()}.svg`}
                alt={state.name}
                width={16}
                height={12}
                className="rounded"
                onError={(e) => {
                  
                  if (state.code !== "unknown") {
                    (e.target as HTMLImageElement).src = "/flags/BR.svg";
                  } else {
                    (e.target as HTMLImageElement).src = "/flags/unknown.svg";
                  }
                }}
              />
              <span>{state.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}