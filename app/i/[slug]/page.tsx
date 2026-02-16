"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const paginas = ["inicio", "evento", "galeria", "dresscode", "confirmar", "regalo"] as const;
type Pagina = typeof paginas[number];

export default function Invitacion() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  /* =========================
     ESTADOS (TODOS ARRIBA)
  ========================= */
  const [valido, setValido] = useState<boolean | null>(null);
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [rsvpExistente, setRsvpExistente] = useState<string | null>(null);

  const [paginaActual, setPaginaActual] = useState<Pagina>("inicio");
  const [direccion, setDireccion] = useState<"left" | "right">("right");

  const [asistira, setAsistira] = useState<null | boolean>(null);
  const [mensajeRSVP, setMensajeRSVP] = useState("");

  const [play, setPlay] = useState(false);
  const [fotoAbierta, setFotoAbierta] = useState<string | null>(null);
const [tiempoRestante, setTiempoRestante] = useState("");


  /* =========================
     VALIDAR INVITADO (GET)
  ========================= */
useEffect(() => {
  const fechaEvento = new Date("2026-03-14T19:00:00"); // 14 marzo 2026 · 7:00 PM

  const actualizarContador = () => {
    const ahora = new Date().getTime();
    const diferencia = fechaEvento.getTime() - ahora;

    if (diferencia <= 0) {
      setTiempoRestante("🎉 ¡Hoy es el gran día!");
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor(
      (diferencia % (1000 * 60 * 60)) / (1000 * 60)
    );
    const segundos = Math.floor(
      (diferencia % (1000 * 60)) / 1000
    );

    setTiempoRestante(
      `${dias} días · ${horas} h · ${minutos} min · ${segundos} s`
    );
  };

  actualizarContador(); // ejecutar de inmediato
  const interval = setInterval(actualizarContador, 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const validarInvitado = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycby7XMKtF-4oypi_1N28Tp79Gk2wWC99hAC0H6g2Ik3iEfZDgXFepwa6CwjZGfLi_ql35A/exec?slug=" +
            slug
        );
        const data = await res.json();

        if (data.valido) {
          setValido(true);
          setNombreInvitado(data.nombre);
          setRsvpExistente(data.rsvp ?? null);
        } else {
          setValido(false);
        }
      } catch {
        setValido(false);
      }
    };

    validarInvitado();
  }, [slug]);

  /* =========================
     CONFETI (solo si es válido)
  ========================= */
  useEffect(() => {
    if (valido) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ED2024", "#ffffff"],
      });
    }
  }, [valido]);

  /* =========================
     SONIDO PASAR PÁGINA
  ========================= */
  const playPageSound = () => {
    const audio = document.getElementById("page") as HTMLAudioElement;
    audio?.play();
  };

  /* =========================
     MÚSICA
  ========================= */
  const toggleMusic = async () => {
    const audio = document.getElementById("musica") as HTMLAudioElement;
    if (!audio) return;

    audio.volume = 0.4;
    if (play) audio.pause();
    else await audio.play();

    setPlay(!play);
  };

  /* =========================
     RSVP (POST)
  ========================= */
  const rsvpEndpoint =
    "https://script.google.com/macros/s/AKfycby7XMKtF-4oypi_1N28Tp79Gk2wWC99hAC0H6g2Ik3iEfZDgXFepwa6CwjZGfLi_ql35A/exec";

  const enviarRSVP = async (respuesta: boolean) => {
    try {
      await fetch(rsvpEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitado: nombreInvitado,
          respuesta: respuesta ? "Sí" : "No",
        }),
      });

      setAsistira(respuesta);
      setRsvpExistente(respuesta ? "Sí" : "No");

      if (respuesta) {
        setMensajeRSVP(
          "💖 ¡Gracias por confirmar! Te esperamos con mucha ilusión."
        );
        confetti({ particleCount: 60, spread: 60 });
      } else {
        setMensajeRSVP("🤍 Gracias por avisarnos, lo apreciamos mucho.");
      }
    } catch (error) {
      console.error("Error RSVP", error);
    }
  };
  /* =========================
   PDF – GENERAR INVITACIÓN
========================= */
const generarPDF = async () => {
  const element = document.getElementById("pdf-invitacion");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Invitacion_XV_${nombreInvitado}.pdf`);
};

  /* =========================
     NAVEGACIÓN LIBRO
  ========================= */
  const idx = paginas.indexOf(paginaActual);

  const siguiente = () => {
    if (idx < paginas.length - 1) {
      setDireccion("right");
      setPaginaActual(paginas[idx + 1]);
      playPageSound();
    }
  };

  const anterior = () => {
    if (idx > 0) {
      setDireccion("left");
      setPaginaActual(paginas[idx - 1]);
      playPageSound();
    }
  };

  const pageClass =
    direccion === "right"
      ? "page-right page-shadow"
      : "page-left page-shadow";

  /* =========================
     RETURNS CONDICIONALES
  ========================= */
  if (valido === null) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Cargando invitación…
      </p>
    );
  }

  if (valido === false) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white/90 p-8 rounded-3xl shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#ED2024] mb-4">
            Invitación no válida
          </h1>
          <p className="text-gray-600">
            Este enlace no corresponde a una invitación activa.
          </p>
        </div>
      </main>
    );
  }
const fotos = [
  "/galeria/anahi1.png",
  "/galeria/anahi2.png",
  "/galeria/anahi3.png",
  
  // agrega aquí todas las reales
];

  /* =========================
     UI PRINCIPAL
  ========================= */

  return (
<main
  className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
style={{
  background: `
    radial-gradient(circle at top, #ffffff 0%, #F7F5F2 30%, #EFE7E0 100%),
    linear-gradient(
      135deg,
      rgba(237,32,36,0.18),
      rgba(155,28,28,0.28)
    )
  `
}}

>
{/* Luces decorativas */}
<div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-[#ED2024]/20 rounded-full blur-3xl -z-10"></div>
<div className="absolute bottom-[-140px] right-[-140px] w-96 h-96 bg-[#9B1C1C]/20 rounded-full blur-3xl -z-10"></div>

      {/* Audios */}
      <audio id="musica" loop preload="auto">
        <source src="/musica.mp3" type="audio/mpeg" />
      </audio>
      <audio id="page-sound" preload="auto">
        <source src="/page.mp3" type="audio/mpeg" />
      </audio>

      {/* Botón música */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-20 bg-white/80 px-4 py-2 rounded-full shadow"
      >
        {play ? "⏸ Música" : "🔊 Música"}
      </button>

      {/* Card */}
      <div
  className="
    relative
    w-full max-w-md
    bg-white/85
    backdrop-blur
    rounded-[2.2rem]
    p-10
    text-center
    shadow-[0_25px_70px_rgba(155,28,28,0.35)]
    border border-white/60
  "
>

      {/* Flor esquina superior izquierda */}
<img
  src="/decoraciones/flor-esquina.png"
  alt=""
 className="
    absolute
    -bottom-0 -left-0
    w-28
    opacity-40
    pointer-events-none
    rotate 0
    scale--[-1]
  "
/>

{/* Flor esquina inferior derecha */}
<img
  src="/decoraciones/flor-esquina.png"
  alt=""
  className="
    absolute
    top-0 right-0
    w-28
    rotate-180
    opacity-40
    pointer-events-none
  "
/>

      <h1
  className="text-3xl mb-3 tracking-wide"
  style={{
    fontFamily: "Playfair Display, serif",
    color: "#9B1C1C",
  }}
>
  Mis XV Años
</h1>
<div className="flex justify-center mb-6">
  <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent"></div>
</div>


        <h2 className="text-lg italic text-gray-700 mb-8">
  Querido(a){" "}
  <span className="text-[#ED2024] font-medium">
    {nombreInvitado}
  </span>
</h2>

        {/* INICIO */}
       {paginaActual === "inicio" && (
  <div className={pageClass}>
    <div
      className="
        bg-white/80
        rounded-4xl
        px-8 py-6
        shadow-[0_12px_35px_rgba(155,28,28,0.18)]
        space-y-4
      "
    >
      <p className="text-gray-700">
        Te espero para celebrar conmigo este día tan especial 💖
      </p>

      <p className="text-sm text-gray-600 tracking-wide">
        14 de Marzo de 2026 · 7:00 PM
      </p>
    </div>
  </div>
)}
        {/* EVENTO */}
        {paginaActual === "evento" && (
  <div className={`${pageClass} space-y-6`}>
  <div
    className="
      bg-white/80
      rounded-2xl
      px-8 py-6
      shadow-[0_12px_35px_rgba(155,28,28,0.18)]
      space-y-6
      text-center
    "
  >
    {/* MISA */}
    <div>
      <p className="font-semibold text-[#9B1C1C]">
        ⛪ Misa
      </p>
      <p className="text-gray-700">
        06:00 PM · Parroquia San Pablo
      </p>
    </div>

    {/* RECEPCIÓN */}
    <div>
      <p className="font-semibold text-[#9B1C1C]">
        🎉 Recepción
      </p>
      <p className="text-gray-700">
        07:00 PM – 09:00 PM · Salón Auditorio
      </p>
    </div>

    {/* UBICACIÓN GENERAL */}
    <div>
      <p className="text-gray-600 text-sm">
        📍 Balleza, Chihuahua
      </p>
    </div>

    {/* CONTADOR */}
    <p className="text-sm font-semibold tracking-wide text-[#9B1C1C]">
      ⏳ <span className="text-[#C9A24D]">{tiempoRestante}</span>
    </p>

      {/* Acciones */}
      <div className="pt-4 space-y-4">
        {/* Maps */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Salon+Auditorio+Municipal+Balleza+Chihuahua"
          target="_blank"
          className="
            flex items-center justify-center gap-2
            px-6 py-3
            rounded-full
            border border-[#ED2024]/40
            text-[#9B1C1C]
            bg-white/80
            hover:bg-[#ED2024]/10
            transition
          "
        >
          📍 Ver ubicación en Google Maps
        </a>

        {/* Calendar */}
        <a
          href={
            "https://calendar.google.com/calendar/render?action=TEMPLATE" +
            "&text=XV+de+Keiry+Anahi+Armendariz+Sanchez" +
            "&dates=20260314T190000/20260315T020000" +
            "&details=Mis+XV+Anos" +
            "&location=Salon+Auditorio+Municipal+Balleza+Chihuahua"
          }
          target="_blank"
          className="
            flex items-center justify-center gap-2
            px-6 py-3
            rounded-full
            border border-[#ED2024]/40
            text-[#9B1C1C]
            bg-white/80
            hover:bg-[#ED2024]/10
            transition
          "
        >
          📅 Agregar al calendario
        </a>
      </div>
    </div>
  </div>
)}

{/* DRESS CODE */}
{paginaActual === "dresscode" && (
  <div className={pageClass}>
    <div
      className="
        bg-white/80
        rounded-2xl
        px-6 py-8
        shadow-[0_12px_35px_rgba(155,28,28,0.18)]
        space-y-6
        text-center
      "
    >
      <h2 className="text-2xl font-semibold text-red-800">
        Dress Code
      </h2>

      <div className="space-y-4 text-gray-600">
        <p>
          Nos encantará verte lucir espectacular en tonos elegantes
          y acordes a una noche muy especial ✨
        </p>

        <p className="italic">
          NOTA: El color rojo ha sido reservado con mucho cariño
          para la quinceañera ❤️
        </p>
      </div>
    </div>
  </div>
)}


       {/* CONFIRMAR */}
{paginaActual === "confirmar" && (
  <div className={pageClass}>
    <div
      className="
        bg-white/80
        rounded-2xl
        px-8 py-6
        shadow-[0_12px_35px_rgba(155,28,28,0.18)]
        space-y-6
      "
    >
      {rsvpExistente ? (
        <>
          <p className="text-[#9B1C1C] font-medium text-center">
            💌 Ya hemos registrado tu respuesta:{" "}
            <strong>{rsvpExistente}</strong>.
            <br />¡Gracias!
          </p>

          {rsvpExistente === "Sí" && (
            <>
              {/* BOTÓN PDF */}
              <button
                onClick={generarPDF}
                className="
                  mt-4
                  px-6 py-3
                  rounded-full
                  bg-gradient-to-r from-[#C9A24D] to-[#ED2024]
                  text-white
                  shadow
                  hover:scale-105
                  transition
                  w-full
                "
              >
                📄 Descargar invitación en PDF
                <span className="block text-xs font-light mt-1">
                  Guárdala como recuerdo o imprímela
                </span>
              </button>

              {/* VIDEO DE AGRADECIMIENTO */}
              <div className="mt-6">
                <video
                  src="/video/gracias.mp4"
                  autoPlay
                  controls
                  playsInline
                  className="
                    w-full
                    rounded-2xl
                    shadow-xl
                    border border-white/50
                  "
                />
              </div>
            </>
          )}
        </>
      ) : asistira === null ? (
        <>
          <p className="text-center">
            ¿Me acompañarás en este día tan especial?
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => enviarRSVP(true)}
              className="
                px-6 py-2
                rounded-full
                bg-gradient-to-r from-[#ED2024] to-[#9B1C1C]
                text-white
                shadow
                hover:scale-105
                transition
              "
            >
              Sí asistiré 💃
            </button>

            <button
              onClick={() => enviarRSVP(false)}
              className="
                px-6 py-2
                rounded-full
                border border-[#ED2024]
                text-[#9B1C1C]
                hover:bg-[#ED2024]/10
                transition
              "
            >
              No podré asistir 🤍
            </button>
          </div>
        </>
      ) : (
        <p className="text-[#9B1C1C] font-medium text-center">
          {mensajeRSVP}
        </p>
      )}
    </div>
  </div>
)}

   {/* REGALO */}
{paginaActual === "regalo" && (
  <div className={`${pageClass} flex flex-col items-center space-y-8`}>
    
    <div
      className="
        bg-white/85
        rounded-2xl
        px-8 py-10
        shadow-[0_12px_35px_rgba(155,28,28,0.18)]
        text-center
        space-y-6
        max-w-md
      "
    >
      <h2 className="text-2xl font-semibold text-[#9B1C1C]">
        Con cariño
      </h2>

      <p className="text-gray-700">
        El mejor regalo será contar con tu presencia en este día tan especial.
      </p>

      <p className="text-gray-600 italic">
        Pero si deseas tener un detalle adicional, durante la celebración
        habrá un buzón dispuesto con cariño para recibir sobres.
      </p>

      {/* SOBRE ANIMADO */}
      <div className="flex justify-center pt-4">
        <div className="envelope-elegant"></div>
      </div>
    </div>

  </div>
)}

        {/* GALERÍA */}
{paginaActual === "galeria" && (
  <div className={pageClass}>
    <div
      className="
        bg-white/80
        rounded-2xl
        px-6 py-6
        shadow-[0_12px_35px_rgba(155,28,28,0.18)]
        space-y-4
      "
    >
      <p className="italic text-gray-600 text-center">
        Algunos recuerdos especiales ✨
      </p>

      <div className="grid grid-cols-3 gap-4">

  {/* Foto grande izquierda */}
  <button
    onClick={() => setFotoAbierta(fotos[0])}
    className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow"
  >
    <img
      src={fotos[0]}
      alt="Anahi Principal"
      className="w-full h-full object-cover hover:scale-105 transition duration-300"
    />
  </button>

  {/* Foto derecha arriba */}
  <button
    onClick={() => setFotoAbierta(fotos[1])}
    className="overflow-hidden rounded-2xl shadow"
  >
    <img
      src={fotos[1]}
      alt="Anahi2"
      className="w-full h-full object-cover hover:scale-105 transition duration-300"
    />
  </button>

  {/* Foto derecha abajo */}
  <button
    onClick={() => setFotoAbierta(fotos[2])}
    className="overflow-hidden rounded-2xl shadow"
  >
    <img
      src={fotos[2]}
      alt="Anahi3"
      className="w-full h-full object-cover hover:scale-105 transition duration-300"
    />
  </button>

</div>

    </div>
  </div>
)}


        {/* NAVEGACIÓN */}
        <div className="flex justify-between mt-8">
          <button
            onClick={anterior}
            disabled={idx === 0}
            className="
  text-sm
  text-[#9B1C1C]
  hover:text-[#ED2024]
  transition
"

          >
            ← Anterior
          </button>
{paginaActual === "regalo" ? (
  <button
    onClick={() => window.location.href = `/i/${slug}`}
    className="
      px-8 py-3
      rounded-full
      text-white
      font-medium
      tracking-wide
      bg-gradient-to-r from-[#9B1C1C] to-[#ED2024]
      shadow-[0_8px_25px_rgba(155,28,28,0.45)]
      hover:scale-105
      transition
    "
  >
    Regresar al inicio ✨
  </button>
) : (

 
  <button
    onClick={siguiente}
    disabled={idx === paginas.length - 1}
    className="
      px-8 py-3
      rounded-full
      text-white
      font-medium
      tracking-wide
      bg-gradient-to-r from-[#ED2024] to-[#9B1C1C]
      shadow-[0_8px_25px_rgba(155,28,28,0.45)]
      hover:scale-105
      transition
    "
  >
    Siguiente →
  </button>
)}

        </div>
      </div>
      {fotoAbierta && (
  <div
    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
    onClick={() => setFotoAbierta(null)}
  >
    <img
      src={fotoAbierta}
      className="max-h-[85vh] rounded-2xl shadow-2xl"
    />
  </div>
)}
{/* PDF OCULTO – SOLO PARA GENERAR */}
{/* PDF OCULTO – INVITACIÓN XV FORMAL PREMIUM */}
      {/* ===============================
   PDF OCULTO – INVITACIÓN XV FINAL
================================ */}
<div
  id="pdf-invitacion"
  style={{
    width: "794px", // A4
    height: "1123px",
    position: "absolute",
    left: "-9999px",
    top: 0,
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  }}
>
  {/* === FUENTES INCRUSTADAS === */}
  <style>
    {`
      @font-face {
        font-family: 'GreatVibes';
        src: url('/fonts/GreatVibes-Regular.ttf') format('truetype');
      }

      @font-face {
        font-family: 'Playfair';
        src: url('/fonts/PlayfairDisplay-Regular.ttf') format('truetype');
      }

      @font-face {
        font-family: 'PlayfairItalic';
        src: url('/fonts/PlayfairDisplay-Italic.ttf') format('truetype');
      }
    `}
  </style>

  {/* CONTENEDOR PRINCIPAL */}
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      fontFamily: "Playfair, serif",
      color: "#2b2b2b",
      overflow: "hidden",
    }}
  >
    {/* MARCO COMPLETO */}
    <img
      src="/pdf/marco.png"
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />

    {/* TEXTO (DENTRO DEL ESPEJO) */}
    <div
      style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        padding: "260px 100px 140px", // controla altura del texto
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* FRASE SUPERIOR */}
      <p
        style={{
          fontFamily: "PlayfairItalic, serif",
          fontSize: "17px",
          lineHeight: "1.8",
          marginBottom: "4px",
        }}
      >
        Hay momentos en la vida que son especiales por sí solos,
        <br />
        pero compartirlos con quienes más queremos
        <br />
        los vuelve inolvidables…
      </p>

      {/* TEXTO FORMAL */}
      <p
        style={{
          fontSize: "17px",
          letterSpacing: "1px",
          marginBottom: "6px",
        }}
      >
        CON LA BENDICIÓN DE DIOS Y EL AMOR DE MIS PADRES,
      </p>

      {/* NOMBRE PRINCIPAL */}
      <h1
        style={{
          fontFamily: "GreatVibes, cursive",
          fontSize: "60px",
          color: "#9B1C1C",
          marginBottom: "10px",
        }}
      >
        Keiry Anahí
        <br />
        Armendáriz Sánchez
      </h1>

      {/* TEXTO INVITACIÓN */}
      <p
        style={{
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        te invito a celebrar conmigo
        <br />
        mis XV años.
      </p>

      {/* DATOS DEL EVENTO */}
      <p
        style={{
          fontSize: "17px",
          lineHeight: "1.8",
        }}
      >
        <strong>Sábado 14 de marzo de 2026</strong>
        <br />
        Misa: 06:00 PM · Parroquia San Pablo
        <br />
        Recepción & Baile: <br /> 07:00 PM - 02:00 AM<br />
        Balleza, Chih.
      </p>
    
    </div>
    {/* INVITADO PERSONALIZADO – ESQUINA INFERIOR DERECHA */}
<div
  style={{
    position: "absolute",
    bottom: "30px",   // subir o bajar el bloque
    right: "50px",     // mover hacia dentro o fuera
    zIndex: 4,
    textAlign: "right",
    maxWidth: "420px",
  }}
>
  <p
    style={{
      fontFamily: "PlayfairItalic, serif",
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "-6px",
      color: "#121111",
    }}
  >
    Será un gusto que nos pueda acompañar
  </p>

  <p
    style={{
      fontFamily: "GreatVibes, cursive",
      fontSize: "35px",
      color: "#9B1C1C",
      lineHeight: "1.2",
    }}
  >
    {nombreInvitado}
  </p>
</div>


    {/* IMAGEN DEL VESTIDO – ESQUINA INFERIOR IZQUIERDA */}
    <div
      style={{
        position: "absolute",
        bottom: "-90px",
        left: "-80px",
        zIndex: 3,
      }}
    >
      <img
        src="/pdf/vestido.png"
        alt="XV Años"
        style={{
          width: "450px",
          height: "auto",
          filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.3))",
        }}
      />
    </div>
  </div>
</div>


    </main>
  );
}
