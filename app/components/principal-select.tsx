import { principals } from "~/lib/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  name?: string;
  defaultValue?: string;
}

export function PrincipalSelect({ name = "principal", defaultValue }: Props) {
  return (
    <Select name={name} required defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(principals).map((key) => {
          const p = principals[key];
          return (
            <SelectItem key={key} value={key}>
              {`${p.id} - ${p.roles.join(", ")} - ${p.attr.region ?? ""} ${
                p.attr.department
              }`}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
