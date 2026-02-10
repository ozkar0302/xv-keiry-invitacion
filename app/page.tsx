"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const searchParams = useSearchParams();
  const invitado = searchParams.get("invitado");

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

      {/* Fondo base con degradado perla */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at top, #FFFFFF 0%, #F7F6F2 40%, #EFEDE7 100%)",
        }}
      />

      {/* Luces decorativas */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-[#ED2024]/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-[#ED2024]/15 rounded-full blur-3xl -z-10"></div>

      {/* Card principal */}
      <div
        className="
          relative
          w-full max-w-md
          bg-white/90
          backdrop-blur
          rounded-[2.2rem]
          shadow-[0_25px_70px_rgba(155,28,28,0.35)]
          p-10
          text-center
          border border-white/60
        "
      >
        {/* Línea decorativa */}
        <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#ED2024] to-transparent mx-auto mb-8 rounded-full"></div>

        <h1
          className="text-4xl mb-4 tracking-wide"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#9B1C1C",
          }}
        >
          Mis XV Años
        </h1>

        {/* Nombre */}
        <h2
          className="text-2xl mb-6 text-gray-800 leading-snug font-bold italic"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Keiry Anahí <br />
          Armendáriz Sánchez
        </h2>

        <p className="mb-6 text-gray-600 tracking-wide">
          14 de Marzo de 2026 <br />
          7:00 PM
        </p>

        <p className="italic mb-10 text-gray-500">
          “Hay momentos que brillan para siempre”
        </p>

        {/* Botón inteligente */}
        <Link
  href={
    invitado
      ? `/i/${invitado}?from=landing`
      : "/"
  }
  className="
    inline-flex items-center justify-center
    px-12 py-4
    rounded-full
    text-white
    text-sm
    font-medium
    tracking-wide
    bg-gradient-to-r from-[#ED2024] to-[#9B1C1C]
    shadow-[0_10px_30px_rgba(155,28,28,0.45)]
    hover:scale-105
    hover:shadow-[0_14px_40px_rgba(155,28,28,0.6)]
    transition
  "
>
  Entrar a la invitación ✨
</Link>

      </div>
    </main>
  );
}
