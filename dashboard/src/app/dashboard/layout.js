"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const supabase_1 = require("@/lib/supabase");
const navigation_2 = require("next/navigation");
function DashboardLayout({ children, }) {
    const pathname = (0, navigation_1.usePathname)();
    const router = (0, navigation_2.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const handleSignOut = () => __awaiter(this, void 0, void 0, function* () {
        yield supabase.auth.signOut();
        router.push('/login');
    });
    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: lucide_react_1.LayoutDashboard },
        { href: '/dashboard/clients', label: 'Clients', icon: lucide_react_1.Users },
        { href: '/dashboard/requests', label: 'Requests', icon: lucide_react_1.MessageSquare },
        { href: '/dashboard/payments', label: 'Payments', icon: lucide_react_1.CreditCard },
        { href: '/dashboard/plans', label: 'Plans', icon: lucide_react_1.FileText },
        { href: '/dashboard/settings', label: 'Settings', icon: lucide_react_1.Settings },
    ];
    return (<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary">DailyFit AI</h1>
                    <p className="text-xs text-muted-foreground">Trainer Dashboard</p>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (<link_1.default key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Icon className="w-5 h-5"/>
                                <span className="font-medium">{item.label}</span>
                            </link_1.default>);
        })}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button_1.Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleSignOut}>
                        <lucide_react_1.LogOut className="w-5 h-5"/>
                        Sign Out
                    </button_1.Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>);
}
