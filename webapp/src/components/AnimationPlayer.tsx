/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DURATION = 60_000; // 60 seconds

const narrationSegments = [
  {
    start: 0,
    text:
      "Namaste bachcho! Aaj hum milkar Zippy naam ke gilahari ke saath Sooraj ki taakat ko samjhenge."
  },
  {
    start: 10,
    text:
      "Jab sooraj ugta hai, tab prakash aur garmi humein bina kisi paise ke milti hai. Zippy roz subah Sooraj ko namaste bolta hai."
  },
  {
    start: 20,
    text:
      "School mein Zippy ko pata chalta hai ki solar panels dhoop ko bijli mein badal dete hain. Yah bijli se fans, lights aur tablets chal sakte hain."
  },
  {
    start: 30,
    text:
      "Ghar par Zippy apne parivar ko batata hai ki solar panels se hum paani ko saaf kar sakte hain, khana garam kar sakte hain aur pedon ko bachaa sakte hain."
  },
  {
    start: 40,
    text:
      "Gaon mein sab bachche milkar chhat par solar panel lagane mein madad karte hain. Saath ka kaam hi asli shakti hai."
  },
  {
    start: 50,
    text:
      "Yaad rakho, jab hum bijli bachate hain to hum dharti Maa ko khush rakhte hain. Tum bhi ghar par lights band karke aur dhoop ka istemal karke energy hero ban sakte ho!"
  }
];

type Scene = {
  start: number;
  end: number;
  title: string;
  message: string;
};

const scenes: Scene[] = [
  {
    start: 0,
    end: 15,
    title: "सूरज की नमस्ते",
    message: "नन्हा ज़िप्पी हर सुबह सूरज की रोशनी में खुश होकर कूदता है।"
  },
  {
    start: 15,
    end: 30,
    title: "स्कूल में खोज",
    message: "टीचर बताती हैं कि सोलर पैनल सूरज की रोशनी को काम की बिजली बनाते हैं।"
  },
  {
    start: 30,
    end: 45,
    title: "घर पर बदलाव",
    message: "परिवार सीखता है कि बिजली बचाकर धरती मां की देखभाल कैसे करें।"
  },
  {
    start: 45,
    end: 60,
    title: "बचपन के एनर्जी हीरो",
    message: "दोस्त मिलकर सोलर मिशन पूरा करते हैं और हर कोई ग्रीन हीरो बनता है।"
  }
];

export function AnimationPlayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const timeoutRefs = useRef<number[]>([]);
  const requestRef = useRef<number>();

  const currentScene = useMemo(() => {
    const seconds = elapsed / 1000;
    return (
      scenes.find((scene) => seconds >= scene.start && seconds < scene.end) ||
      scenes[scenes.length - 1]
    );
  }, [elapsed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const draw = (time: number) => {
      if (!startedAt) {
        return;
      }
      const progress = Math.min((time - startedAt) / DURATION, 1);
      setElapsed((time - startedAt));

      const seconds = progress * 60;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, width, height, progress);
      drawSun(ctx, width, height, seconds);
      drawHills(ctx, width, height);
      drawCharacters(ctx, width, height, seconds);
      drawPanels(ctx, width, height, seconds);
      drawBirds(ctx, width, height, seconds);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(draw);
      } else {
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, startedAt]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const handleResize = () => {
      const ratio = 16 / 9;
      const { clientWidth } = canvas.parentElement ?? { clientWidth: 960 };
      canvas.width = clientWidth;
      canvas.height = clientWidth / ratio;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPlaying]);

  const stopNarration = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
    }
  };

  const startNarration = () => {
    if (typeof window === "undefined") {
      return;
    }
    stopNarration();
    narrationSegments.forEach((segment) => {
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = "hi-IN";
      utterance.rate = 1;
      const id = window.setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, segment.start * 1000);
      timeoutRefs.current.push(id);
    });
  };

  const handleStart = () => {
    const now = performance.now();
    setStartedAt(now);
    setElapsed(0);
    setIsPlaying(true);
    startNarration();
  };

  const handleReset = () => {
    stopNarration();
    setIsPlaying(false);
    setStartedAt(null);
    setElapsed(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const progressPercent = Math.min((elapsed / DURATION) * 100, 100);

  return (
    <section className="flex flex-col gap-6 items-center w-full">
      <div className="w-full max-w-5xl rounded-3xl border border-orange-200 bg-white/80 p-6 shadow-xl backdrop-blur">
        <div className="relative w-full overflow-hidden rounded-2xl border border-sunrise-200 bg-sky-100">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-auto aspect-video"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white p-4">
            <h2 className="text-2xl font-semibold drop-shadow-md">
              {currentScene.title}
            </h2>
            <p className="text-base md:text-lg opacity-90">{currentScene.message}</p>
          </div>
        </div>

        <div className="mt-4 h-3 rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-sunrise-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="inline-block h-3 w-3 rounded-full bg-sunrise-400" />
            <span className="text-sm md:text-base">
              कुल समय: 60 सेकंड • 16:9 एनीमेशन • हिंदी वॉइसओवर
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleStart}
              disabled={isPlaying}
              className="rounded-full bg-sunrise-500 px-5 py-2 text-white shadow hover:bg-sunrise-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isPlaying ? "चल रहा है..." : "एनीमेशन शुरू करें"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-sunrise-500 px-5 py-2 text-sunrise-600 hover:bg-sunrise-50"
            >
              दोबारा देखें
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  const dawnColor = { r: 255, g: 225, b: 170 };
  const noonColor = { r: 135, g: 206, b: 250 };
  const sunsetColor = { r: 255, g: 183, b: 94 };

  const phase =
    progress < 0.5 ? progress * 2 : Math.max(0, (1 - progress) * 2);
  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const skyTop =
    progress < 0.5
      ? `rgb(${mix(dawnColor.r, noonColor.r, phase)}, ${mix(dawnColor.g, noonColor.g, phase)}, ${mix(dawnColor.b, noonColor.b, phase)})`
      : `rgb(${mix(noonColor.r, sunsetColor.r, phase)}, ${mix(noonColor.g, sunsetColor.g, phase)}, ${mix(noonColor.b, sunsetColor.b, phase)})`;

  skyGradient.addColorStop(0, skyTop);
  skyGradient.addColorStop(1, "rgb(240, 253, 255)");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);
}

function drawSun(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number
) {
  const angle = (seconds / 60) * Math.PI;
  const radius = Math.min(width, height) * 0.09;
  const sunX = width * 0.2 + Math.cos(angle) * width * 0.3;
  const sunY = height * 0.75 - Math.sin(angle) * height * 0.5;

  const sunGradient = ctx.createRadialGradient(
    sunX,
    sunY,
    radius * 0.2,
    sunX,
    sunY,
    radius
  );
  sunGradient.addColorStop(0, "rgba(255, 240, 180, 1)");
  sunGradient.addColorStop(1, "rgba(255, 166, 30, 0.7)");
  ctx.beginPath();
  ctx.fillStyle = sunGradient;
  ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawHills(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.fillStyle = "#5bbf73";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.75);
  ctx.quadraticCurveTo(width * 0.25, height * 0.6, width * 0.5, height * 0.75);
  ctx.quadraticCurveTo(width * 0.75, height * 0.9, width, height * 0.7);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#3f9142";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.82);
  ctx.quadraticCurveTo(width * 0.3, height * 0.68, width * 0.6, height * 0.85);
  ctx.quadraticCurveTo(width * 0.85, height * 0.95, width, height * 0.8);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
}

function drawCharacters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number
) {
  const baseY = height * 0.78;
  const zippyX = width * 0.35 + Math.sin(seconds / 4) * 20;
  const friendX = width * 0.55 + Math.cos(seconds / 5) * 18;

  drawKid(ctx, zippyX, baseY, "#ff8a65", "#ffe0b2");
  drawKid(ctx, friendX, baseY, "#4fc3f7", "#ffecb3");
}

function drawKid(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  shirtColor: string,
  faceColor: string
) {
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.ellipse(x, baseY - 30, 24, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.arc(x, baseY - 70, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4e342e";
  ctx.beginPath();
  ctx.arc(x, baseY - 80, 20, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = "#3e2723";
  ctx.beginPath();
  ctx.arc(x - 6, baseY - 75, 3, 0, Math.PI * 2);
  ctx.arc(x + 6, baseY - 75, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, baseY - 65, 8, 0, Math.PI);
  ctx.stroke();
}

function drawPanels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number
) {
  const progress = Math.min(Math.max((seconds - 15) / 45, 0), 1);
  const panelWidth = 160;
  const panelHeight = 80;
  const baseX = width * 0.1;
  const baseY = height * 0.68;
  const gap = 40;

  for (let i = 0; i < 3; i += 1) {
    const appear = Math.min(progress * 3 - i, 1);
    if (appear <= 0) continue;
    const x = baseX + i * (panelWidth + gap);
    const tilt = 12;

    ctx.save();
    ctx.translate(x, baseY + i * 2);
    ctx.rotate((-tilt * Math.PI) / 180);

    ctx.fillStyle = `rgba(30, 136, 229, ${appear})`;
    ctx.fillRect(0, 0, panelWidth, panelHeight);

    ctx.strokeStyle = `rgba(21, 101, 192, ${appear})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, panelWidth, panelHeight);

    ctx.strokeStyle = `rgba(255, 255, 255, ${appear * 0.6})`;
    ctx.lineWidth = 1;
    for (let col = 1; col < 4; col += 1) {
      ctx.beginPath();
      ctx.moveTo((panelWidth / 4) * col, 0);
      ctx.lineTo((panelWidth / 4) * col, panelHeight);
      ctx.stroke();
    }

    for (let row = 1; row < 3; row += 1) {
      ctx.beginPath();
      ctx.moveTo(0, (panelHeight / 3) * row);
      ctx.lineTo(panelWidth, (panelHeight / 3) * row);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawBirds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number
) {
  const birdCount = 5;
  const amplitude = height * 0.05;

  ctx.strokeStyle = "rgba(70, 37, 23, 0.8)";
  ctx.lineWidth = 2.5;

  for (let i = 0; i < birdCount; i += 1) {
    const t = (seconds / 10 + i * 0.2) % 2;
    const x = ((t / 2) * width + i * 120) % width;
    const y =
      height * 0.2 +
      Math.sin((seconds + i * 15) / 5) * amplitude +
      (i % 2 === 0 ? 0 : amplitude * 0.5);
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.quadraticCurveTo(x, y - 8, x + 10, y);
    ctx.quadraticCurveTo(x, y - 4, x - 10, y);
    ctx.stroke();
  }
}
