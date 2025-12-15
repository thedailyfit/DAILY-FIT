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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function LoginPage() {
    const [isSignUp, setIsSignUp] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [name, setName] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [message, setMessage] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const handleAuth = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            if (isSignUp) {
                // Sign Up Flow
                const { data: authData, error: authError } = yield supabase.auth.signUp({
                    email,
                    password,
                });
                if (authError)
                    throw authError;
                if (authData.user) {
                    // Create Trainer Record
                    const { error: dbError } = yield supabase
                        .from('trainers')
                        .insert([
                        {
                            trainer_id: authData.user.id,
                            name: name,
                            email: email, // Assuming there's an email column, or we rely on auth
                            specialization: 'General Fitness', // Default
                            whatsapp_id: '', // To be filled later
                        }
                    ]);
                    if (dbError) {
                        console.error("Error creating trainer record:", dbError);
                        // Continue anyway as auth was successful, but warn
                    }
                    setMessage("Registration successful! Please check your email to confirm your account.");
                    setIsSignUp(false); // Switch back to login
                }
            }
            else {
                // Login Flow
                const { error } = yield supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error)
                    throw error;
                router.push('/dashboard');
            }
        }
        catch (err) {
            setError(err.message || "An error occurred");
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <card_1.Card className="w-full max-w-md">
                <card_1.CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            {isSignUp ? <lucide_react_1.UserPlus className="w-6 h-6 text-primary"/> : <lucide_react_1.Lock className="w-6 h-6 text-primary"/>}
                        </div>
                    </div>
                    <card_1.CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? 'Trainer Registration' : 'Trainer Login'}
                    </card_1.CardTitle>
                    <card_1.CardDescription className="text-center">
                        {isSignUp ? 'Create a new account to manage clients' : 'Enter your credentials to access the dashboard'}
                    </card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (<div className="space-y-2">
                                <label_1.Label htmlFor="name">Full Name</label_1.Label>
                                <input_1.Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp}/>
                            </div>)}
                        <div className="space-y-2">
                            <label_1.Label htmlFor="email">Email</label_1.Label>
                            <input_1.Input id="email" type="email" placeholder="trainer@dailyfit.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="space-y-2">
                            <label_1.Label htmlFor="password">Password</label_1.Label>
                            <input_1.Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        {error && (<div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>)}
                        {message && (<div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded">
                                {message}
                            </div>)}
                        <button_1.Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button_1.Button>
                    </form>

                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setMessage(null);
        }} className="text-sm text-primary hover:underline">
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </card_1.CardContent>
                <card_1.CardFooter className="text-center text-sm text-gray-500 justify-center">
                    Protected Area. Authorized Personnel Only.
                </card_1.CardFooter>
            </card_1.Card>
        </div>);
}
