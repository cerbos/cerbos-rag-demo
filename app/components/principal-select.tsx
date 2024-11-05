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
}

export function PrincipalSelect({ name = "principal" }: Props) {
  return (
    <Select name={name} required>
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(principals).map((key) => {
          const p = principals[key];
          return (
            <SelectItem key={key} value={key}>
              {`${p.id} - ${JSON.stringify(p.roles)} - ${p.attr.region ?? ""} ${
                p.attr.department
              }`}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
