"use strict";
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
exports.default = WorkoutEditorPage;
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const badge_1 = require("@/components/ui/badge");
const workout_editor_wrapper_1 = require("@/components/dashboard/workout-editor-wrapper");
function getClientAndPlan(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        const { data: member } = yield supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single();
        const { data: workoutPlan } = yield supabase
            .from('workout_plans')
            .select('*')
            .eq('member_id', id)
            .eq('status', 'active')
            .single();
        if (!member)
            return null;
        return { member, workoutPlan };
    });
}
function WorkoutEditorPage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        const data = yield getClientAndPlan(params.id);
        if (!data) {
            (0, navigation_1.notFound)();
        }
        const { member, workoutPlan } = data;
        return (<div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
                <div className="flex items-center gap-4">
                    <button_1.Button variant="ghost" size="icon" asChild>
                        <link_1.default href={`/dashboard/clients/${member.id}`}>
                            <lucide_react_1.ArrowLeft className="w-5 h-5"/>
                        </link_1.default>
                    </button_1.Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold">Custom Workout Plan</h1>
                            <badge_1.Badge variant="secondary">Client-Specific</badge_1.Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For {member.name} • {member.goal.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button_1.Button variant="outline">Save as Template</button_1.Button>
                    <button_1.Button>
                        <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                        Save Changes
                    </button_1.Button>
                </div>
            </div>

            {/* Main Content Area */}
            <workout_editor_wrapper_1.WorkoutEditorWrapper initialData={workoutPlan || { plan_data: { days_per_week: 4, schedule: [] } }} member={member}/>
        </div>);
    });
}
