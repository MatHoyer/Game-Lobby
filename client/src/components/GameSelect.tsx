import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const GameSelect: React.FC<{ values: string[]; handleSelect: (value: string) => void }> = ({
  values,
  handleSelect,
}) => {
  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a game" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {values.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
