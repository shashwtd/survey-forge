export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#08070e] to-[#000003]">
          <div className="absolute w-full rounded-[50%] top-0 -translate-y-1/2 blur-3xl opacity-20 bg-[#3f4da8] h-32"></div>
            <div className="w-full max-w-sm bg-white/5 rounded-lg border border-white/10 p-8 backdrop-blur-sm shadow-[0_0_25px_-5px_rgba(0,0,0,0.6)] shadow-black/40">
                {children}
            </div>
        </main>
    );
}
