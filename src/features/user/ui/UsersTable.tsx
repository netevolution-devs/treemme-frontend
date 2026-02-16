import React, {useEffect, useMemo, useRef, useState} from "react";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions.ts";
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import type {ITableUserRow} from "@features/user/model/ITableUserRow.ts";
import {useTranslation} from "react-i18next";
import {Box, Button, Chip, Stack, Divider, type SxProps} from "@mui/material";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateUserDialog from "./components/CreateUserDialog";
import {openDialog} from "@shared/ui/dialog/dialogHelper";
import UpdateUserDialog from "./components/UpdateUserDialog";
import {useSearchCombinedFilter} from "@features/search/useSearchFilter.ts";
import SearchBar from "@features/search/SearchBar.tsx";

interface Props {
    users: ITableUserRow[];
    isLoading?: boolean;
    displayToolbar?: boolean;
    layoutSticky?: boolean;
    maxTableContainerHeight?: string;
    sx?: SxProps;
}

const UsersTable: React.FC<Props> = ({
                                         users,
                                         isLoading,
                                         displayToolbar = true,
                                         layoutSticky = false,
                                         maxTableContainerHeight = "100%",
                                         sx,
                                     }) => {
    const {t} = useTranslation(["common"]);

    const overrideOptions: Partial<MRT_TableOptions<ITableUserRow>> = {
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                setSelectedUserCode(row.original.userCode);
                openDialog(updateDialogRef);
            },
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
            },
        }),
        muiTableContainerProps: () => ({
            sx: {
                maxHeight: maxTableContainerHeight,
            }
        }),
    };
    const defaultMrtOptions = useDefaultMrtOptions<ITableUserRow>(overrideOptions);

    const createDialogRef = useRef<IDialogActions>(null);
    const updateDialogRef = useRef<IDialogActions>(null);

    const [selectedUserCode, setSelectedUserCode] = useState<string>("");

    const {searchText, setSearchText, filteredData} = useSearchCombinedFilter<ITableUserRow>(
        users,
        ["firstName", "lastName"]
    )

    const columns = useMemo<MRT_ColumnDef<ITableUserRow>[]>(
        () => [
            {
                accessorKey: "firstName",
                header: t("common:table.firstname"),
                filterFn: "contains",
                size: 0,
            },
            {
                accessorKey: "lastName",
                header: t("common:table.lastname"),
                filterFn: "contains",
            },
            {
                accessorKey: "role",
                header: t("common:table.roles"),
                filterFn: "contains",
                Cell: ({row}) => (
                    <Box sx={{display: "flex", gap: 1}}>
                        {row.original.roles.map((userRole) => (
                            <Chip
                                key={userRole.role.id}
                                label={userRole.role.name}
                                size="small"
                                color="primary"
                            />
                        ))}
                    </Box>
                )
            },
            {
                accessorKey: "email",
                header: t("common:table.email"),
                filterFn: "contains",
            },
        ],
        [t]
    );

    const table = useMaterialReactTable<ITableUserRow>({
        ...defaultMrtOptions,
        columns,
        data: filteredData || [],
        enableRowActions: false,
        autoResetPageIndex: false,
        state: {
            isLoading: !!isLoading
        },
        enableStickyHeader: layoutSticky,
        enableStickyFooter: layoutSticky,
        enableEditing: false,
        enableTopToolbar: displayToolbar,
        renderTopToolbarCustomActions: () => (
            <Stack sx={{justifyContent: "space-between", width: "100%", gap: 2, mb: 2}}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Button
                        sx={{height: 30, px: 1, pr: 1.5, width: 200}}
                        variant="contained"
                        onClick={() => openDialog(createDialogRef)}
                    >
                        <PersonAddIcon fontSize="small" sx={{mr: 0.4}}/>
                        {t("common:table.actions.create-user")}
                    </Button>
                    <SearchBar
                        value={searchText}
                        onChange={setSearchText}
                        placeholder={t("common:search.search-label")}
                        maxWidth={400}
                    />
                </Box>
                <Divider/>
            </Stack>
        )
    });

    useEffect(() => {
        if (selectedUserCode) {
            openDialog(updateDialogRef);
        }
    }, [selectedUserCode]);

    return (
        <Box sx={{px: 3, pt: 2, ...sx}}>
            <MaterialReactTable table={table}/>

            <CreateUserDialog
                ref={createDialogRef}
            />
            <UpdateUserDialog
                ref={updateDialogRef}
                userCode={selectedUserCode}
            />
        </Box>
    )
};

export default UsersTable;
