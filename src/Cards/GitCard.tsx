import { Dropdown, useId, Option, TabList, Tab, TabValue, SelectTabEvent, SelectTabData, DataGrid, TableColumnDefinition, createTableColumn, TableCellLayout, DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell, Label, Button, DataGridProps, TableRowId, Input} from "@fluentui/react-components"
import { useState } from "react";

import {
    BranchFork24Regular,
    DocumentAdd24Regular,
    StackAdd24Regular,
    ArrowStepInRight24Regular,
    ArrowAutofitUp24Regular,
    ArrowOutlineUpRight24Regular
  } from "@fluentui/react-icons";

type FileCell = {
    label: string;
    icon: JSX.Element;
};

type Item = {
    file: FileCell;
};

export const GitCard = () => {
    const dropdownId = useId("dropdown");
    const [selectedValue, setSelectedValue] =
    useState<TabValue>("conditions");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const Branch = () => {
        return (
            <div
                style={{display: "flex", flexDirection: "column"}}
            >
                <Label htmlFor="branch-dropdown">Branch from:</Label>
                <Dropdown
                    id="branch-dropdown"
                    placeholder="Select an animal"
                >
                    <Option key={'main'}>
                        main
                    </Option>
                    <Option key={'user/feature1'}>
                        user/feature1
                    </Option>
                </Dropdown>
                <Button style={{marginTop: 20}} appearance="primary">Auto Create Branch (ChatGPT named)</Button>
            </div>
        );
    };
    const Commit = () => {
        const items: Item[] = [
            {
              file: { label: "new_folder/file1", icon: <DocumentAdd24Regular /> },
            },
            {
              file: { label: "new_folder/file2", icon: <DocumentAdd24Regular /> },
            },
            {
              file: { label: "new_folder/file3", icon: <DocumentAdd24Regular /> },
            },
            {
              file: { label: "modified_file1", icon: <ArrowAutofitUp24Regular /> },
            },
            {
              file: { label: "modified_file2", icon: <ArrowAutofitUp24Regular /> },
            },
            {
              file: { label: "modified_file4", icon: <ArrowAutofitUp24Regular /> },
            },
          ];

        const columns: TableColumnDefinition<Item>[] = [
            createTableColumn<Item>({
              columnId: "file",
              compare: (a, b) => {
                return a.file.label.localeCompare(b.file.label);
              },
              renderHeaderCell: () => {
                return "File";
              },
              renderCell: (item) => {
                return (
                  <TableCellLayout media={item.file.icon}>
                    {item.file.label}
                  </TableCellLayout>
                );
              },
            }),
        ];

        const [selectedRows, setSelectedRows] = useState(
            new Set<TableRowId>([])
          );

          const onSelectionChange: DataGridProps["onSelectionChange"] = (e, data) => {
            setSelectedRows(data.selectedItems);
          };
            
        return (
            <div
                style={{display: "flex", flexDirection: "column"}}
            >
                <Button style={{marginTop: 20}} appearance="primary">{selectedRows.size === 0 ? "Add all and commit" : (selectedRows.size === items.length ? "Commit all" : "Commit selected")}</Button>
                <Input style={{marginTop: 5}} placeholder="ChatGPT Generated commit message" />
                <DataGrid
                    style={{marginTop: 20}}
                    items={items}
                    columns={columns}
                    selectionMode="multiselect"
                    selectedItems={selectedRows}
                    onSelectionChange={onSelectionChange}
                    >
                    <DataGridHeader>
                        <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<Item>>
                        {({ item, rowId }) => (
                        <DataGridRow<Item>
                            key={rowId}
                            selectionCell={{ "aria-label": "Select row" }}
                        >
                            {({ renderCell }) => (
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </div>
        );
    };
    const Push = () => {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <Button style={{marginTop: 20}} appearance="primary">Push to remote</Button>
                <Button style={{marginTop: 10}}>Open Branch</Button>
                <Button style={{marginTop: 10}}>Create PR</Button>
            </div>
        );
    };

    return (
        <div
            style={{display: "flex", flexDirection: "column"}}
        >
            <Label htmlFor={`${dropdownId}`}>Select repository</Label>
            <Dropdown
                aria-labelledby={`${dropdownId}`}
                placeholder=""
                appearance="outline"
            >
                <Option>UX Repo</Option>
                <Option>API Repo</Option>
            </Dropdown>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab id="branch" icon={<BranchFork24Regular />} value="branch">
                Branch
                </Tab>
                <Tab id="commit" icon={<StackAdd24Regular />} value="commit">
                Commit
                </Tab>
                <Tab id="push" icon={<ArrowOutlineUpRight24Regular />} value="push">
                Push
                </Tab>
            </TabList>
            <div style={{margin: 10}}>
                {selectedValue === "branch" && <Branch />}
                {selectedValue === "commit" && <Commit />}
                {selectedValue === "push" && <Push />}
            </div>
        </div>
    )
}