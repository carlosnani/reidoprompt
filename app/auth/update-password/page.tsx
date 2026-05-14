import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#050505] overflow-hidden">
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-green-neon/5 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(72,255,36,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(72,255,36,0.4) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
