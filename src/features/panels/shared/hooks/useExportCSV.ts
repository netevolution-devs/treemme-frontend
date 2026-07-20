import type {MRT_ColumnDef, MRT_RowData} from "material-react-table";

const getValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split(".").reduce<unknown>((acc, key) => {
        if (acc != null && typeof acc === "object") {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
};

export const useExportCSV = <T extends MRT_RowData>() => {
    return (columns: MRT_ColumnDef<T>[], data: T[], filename = "export.csv") => {

        const headers = columns.map((column) => column.header);
        const rows = data.map((row) =>
            columns.map((column) => {
                const raw = column.accessorKey
                    ? getValue(row as unknown as Record<string, unknown>, column.accessorKey)
                    : "";
                return raw;
            })
        );

        const csvContent = [headers, ...rows]
            .map((row) =>
                row.map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};  