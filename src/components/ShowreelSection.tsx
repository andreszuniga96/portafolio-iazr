import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const videos = [
  {
    title: "Zolaris Platform UI/UX",
    type: "mp4",
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4",
  },
  {
    title: "Cinematic Rendering HLS",
    type: "hls",
    src: "https://stream.mux.com/jPyJ2YM6Nlly7U6EyfxM01tz4D4uPE3gyJ4PYuvY62Wg.m3u8",
  },
  {
    title: "Dashboard Analytics 3D",
    type: "mp4",
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4",
  },
  {
    title: "Mobile Optimization",
    type: "mp4",
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4",
  }
];

const VideoPlayer = ({ src, type, isActive, isMuted }: { src: string; type: string; isActive: boolean; isMuted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (type === "hls") {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, type]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => console.log("Autoplay prevented"));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      loop
      playsInline
      muted={isMuted}
      className={`w-full h-full object-cover transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"}`}
    />
  );
};

const ShowreelSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-switch videos if they are just playing without sound manually (optional, but requested feature film layout)
  // We'll keep it manual with nice UI but auto-playing.
  
  return (
    <section className="relative w-full h-[90vh] bg-background border-y border-stroke/50 overflow-hidden group">
      
      {/* Videos */}
      <div className="absolute inset-0 bg-black">
        {videos.map((vid, index) => (
          <div key={index} className="absolute inset-0">
            <VideoPlayer 
              src={vid.src} 
              type={vid.type} 
              isActive={activeVideo === index && isPlaying} 
              isMuted={isMuted}
            />
          </div>
        ))}
      </div>

      {/* Cinematic Letterbox (Black Bars) */}
      <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-black z-10 transition-transform duration-700 transform origin-top" />
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-black z-10 transition-transform duration-700 transform origin-bottom" />

      {/* Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        
        {/* Top UI */}
        <div className="flex justify-between items-start pt-4 md:pt-12">
          <div className="pointer-events-auto">
            <span className="text-xs font-outfit text-white font-bold uppercase tracking-[0.2em] bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Showreel 2026
            </span>
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
             <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
          </div>
        </div>

        {/* Bottom UI */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-4 md:pb-12 pointer-events-auto">
          
          <div className="w-full md:w-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeVideo}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.5 }}
               >
                 <h2 className="text-3xl md:text-5xl font-display text-white mb-2 drop-shadow-lg">
                   {videos[activeVideo].title}
                 </h2>
                 <p className="text-sm font-outfit text-white/70 tracking-widest uppercase">
                   0{activeVideo + 1} / 0{videos.length}
                 </p>
               </motion.div>
             </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
             <button
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-background hover:scale-105 transition-transform"
             >
               {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-1" fill="currentColor" />}
             </button>
             
             <div className="flex gap-2 px-4">
                {videos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVideo(i)}
                    className="relative py-2 group cursor-pointer"
                  >
                    <div className={`h-1 rounded-full transition-all duration-300 ${activeVideo === i ? "w-8 bg-white" : "w-2 bg-white/30 group-hover:bg-white/60"}`} />
                  </button>
                ))}
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ShowreelSection;
