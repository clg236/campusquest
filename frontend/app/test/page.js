// DataTable.jsx
"use client";

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
} from '@mantine/core'; 

// Function to dynamically generate column definitions based on data keys
const generateColumns = (data) => {
  if (!data || data.length === 0) return [];

  const sampleRecord = data[0];
  return Object.keys(sampleRecord).map(key => ({
    accessorKey: key,
    header: () => key.toUpperCase(),
    cell: info => info.getValue(),
  }));
};

// Dummy data for testing purposes
const dummyData = [
  { id: "1", amount: 100, status: "pending this is a huge cell. pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.pending this is a huge cell.", email: "user1@example.com" },
  { id: "2", amount: 200, status: "success", email: "user2@example.com" },
  { id: "3", amount: 150, status: "failed", email: "user3@example.com" },
];

export default function TestDataTable() {
  // Dynamically generate columns based on dummy data
  const columns = React.useMemo(() => generateColumns(dummyData), [dummyData]);
  const data = React.useMemo(() => dummyData, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <Table.Th>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Th>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
