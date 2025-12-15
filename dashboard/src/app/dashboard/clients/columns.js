"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = void 0;
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const link_1 = __importDefault(require("next/link"));
exports.columns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
                </button_1.Button>);
        },
        cell: ({ row }) => {
            const client = row.original;
            return (<div className="flex items-center gap-3">
                    <avatar_1.Avatar>
                        <avatar_1.AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}/>
                        <avatar_1.AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</avatar_1.AvatarFallback>
                    </avatar_1.Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-xs text-muted-foreground">{client.phone}</span>
                    </div>
                </div>);
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return (<badge_1.Badge variant={status === 'active' ? 'default' : 'secondary'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </badge_1.Badge>);
        },
    },
    {
        accessorKey: "goal",
        header: "Goal",
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
            return new Date(row.getValue("created_at")).toLocaleDateString();
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;
            return (<dropdown_menu_1.DropdownMenu>
                    <dropdown_menu_1.DropdownMenuTrigger asChild>
                        <button_1.Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                        </button_1.Button>
                    </dropdown_menu_1.DropdownMenuTrigger>
                    <dropdown_menu_1.DropdownMenuContent align="end">
                        <dropdown_menu_1.DropdownMenuLabel>Actions</dropdown_menu_1.DropdownMenuLabel>
                        <dropdown_menu_1.DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.phone)}>
                            Copy Phone
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuSeparator />
                        <dropdown_menu_1.DropdownMenuItem asChild>
                            <link_1.default href={`/dashboard/clients/${client.id}`}>View Details</link_1.default>
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuItem>Edit Plan</dropdown_menu_1.DropdownMenuItem>
                    </dropdown_menu_1.DropdownMenuContent>
                </dropdown_menu_1.DropdownMenu>);
        },
    },
];
