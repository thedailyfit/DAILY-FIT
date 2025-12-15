"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlansLayout;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
function PlansLayout({ children, }) {
    const pathname = (0, navigation_1.usePathname)();
    return (<div className="space-y-6">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <link_1.default href="/dashboard/plans/diets" className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "ghost" }), pathname === "/dashboard/plans/diets"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline", "justify-start")}>
                            Diet Plans
                        </link_1.default>
                        <link_1.default href="/dashboard/plans/workouts" className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "ghost" }), pathname === "/dashboard/plans/workouts"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline", "justify-start")}>
                            Workout Plans
                        </link_1.default>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>);
}
