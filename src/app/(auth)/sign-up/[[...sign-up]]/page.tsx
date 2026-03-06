import Link from "next/link";

export default function Page() {
    return (
        <div className="flex h-screen w-full flex-col gap-4 items-center justify-center bg-green-50/30">
            <div className="bg-white p-8 rounded-xl shadow-sm border max-w-sm w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Sign Up (Demo)</h2>
                <p className="text-slate-500 mb-6 text-sm">Authentication is bypassed for this local demo. Just proceed to the dashboard!</p>
                <Link href="/dashboard" className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
                    Go To Dashboard
                </Link>
            </div>
        </div>
    );
}
