"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const React = __importStar(require("react"));
const react_table_1 = require("@tanstack/react-table");
const table_1 = require("@/components/ui/table");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
function DataTable({ columns, data, }) {
    var _a, _b, _c;
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        onSortingChange: setSorting,
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        state: {
            sorting,
            columnFilters,
        },
    });
    return (<div>
            <div className="flex items-center py-4">
                <input_1.Input placeholder="Filter names..." value={(_b = (_a = table.getColumn("name")) === null || _a === void 0 ? void 0 : _a.getFilterValue()) !== null && _b !== void 0 ? _b : ""} onChange={(event) => { var _a; return (_a = table.getColumn("name")) === null || _a === void 0 ? void 0 : _a.setFilterValue(event.target.value); }} className="max-w-sm"/>
            </div>
            <div className="rounded-md border">
                <table_1.Table>
                    <table_1.TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (<table_1.TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                return (<table_1.TableHead key={header.id}>
                                            {header.isPlaceholder
                        ? null
                        : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                                        </table_1.TableHead>);
            })}
                            </table_1.TableRow>))}
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {((_c = table.getRowModel().rows) === null || _c === void 0 ? void 0 : _c.length) ? (table.getRowModel().rows.map((row) => (<table_1.TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (<table_1.TableCell key={cell.id}>
                                            {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
                                        </table_1.TableCell>))}
                                </table_1.TableRow>))) : (<table_1.TableRow>
                                <table_1.TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </table_1.TableCell>
                            </table_1.TableRow>)}
                    </table_1.TableBody>
                </table_1.Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <button_1.Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </button_1.Button>
            </div>
        </div>);
}
