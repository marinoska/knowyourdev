import { useMemo } from "react";
import { Select, Option, FormLabel, FormControl } from "@mui/joy";
import { SCOPE_NAMES, ScopeType } from "@kyd/common/api";
import { SxProps } from "@mui/joy/styles/types";

const ALL_SCOPES = 'all' as const;

type ScopeSelectProps = {
    label: string;
    data: { scope: ScopeType }[]; // Source data for the list of scopes
    selectedScope: ScopeType | null;
    onScopeChange: (newScope: ScopeType | null) => void;
    sx?: SxProps;
}

export const ScopeSelect = ({label, data, selectedScope, onScopeChange, sx}: ScopeSelectProps) => {
    const scopeCodes = useMemo(
        () => Array.from(new Set(data.map(({scope}) => scope))),
        [data]
    );

    const handleScopeChange = (newValue: ScopeType | typeof ALL_SCOPES) => {
        onScopeChange(newValue === ALL_SCOPES ? null : newValue);
    };

    return (
        <FormControl sx={sx}>
            <FormLabel>{label}</FormLabel>

            <Select
                value={selectedScope || ALL_SCOPES}
                onChange={(_e, newValue) => handleScopeChange(newValue as ScopeType | typeof ALL_SCOPES)}
            >
                <Option value={ALL_SCOPES}>All</Option>

                {scopeCodes.map(scopeCode => (
                    <Option key={scopeCode} value={scopeCode}>
                        {SCOPE_NAMES[scopeCode]}
                    </Option>
                ))}
            </Select>
        </FormControl>
    );
};