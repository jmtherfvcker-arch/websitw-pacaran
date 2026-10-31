"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Music2, Volume2, VolumeX, Pause, Play, Mail, Star, Sparkles, Gift, X, ChevronUp, RotateCcw, Cloud, Moon, Sun } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import Reveal from "@/components/Reveal";
import Teddy from "@/components/Teddy";
import {
  eggDoubleClick, eggFooter, eggHiddenSticker, eggIllustrationClick, eggSmallHeart, eggTitleFive,
  finalButton, finalClosing, finalGiftLabel, finalMessage, finalPsst, finalRestart,
  footerDate, footerMain, footerSmall, letterClosedText, letterClosing, loveCards, loveLetter, loveNotes,
  memory, musicPaused, musicPlaying, quiz, quizImperfect, quizPerfect, quizRetry, quizWrongReaction,
  songMeaning, tinyQuestion, type NoteIconName,
} from "@/data/content";

const floaters = ["♡", "✦", "✿", "⋆", "♡", "✧", "୨୧", "♡"];
const risers = [
  { c: "♡", l: 6, s: 18, d: 14, w: 0 }, { c: "✿", l: 15, s: 22, d: 18, w: 4 }, { c: "♡", l: 26, s: 14, d: 12, w: 7 },
  { c: "✧", l: 37, s: 16, d: 16, w: 2 }, { c: "♡", l: 48, s: 24, d: 20, w: 9 }, { c: "✦", l: 58, s: 14, d: 13, w: 5 },
  { c: "♡", l: 68, s: 20, d: 17, w: 11 }, { c: "✿", l: 77, s: 16, d: 15, w: 1 }, { c: "♡", l: 86, s: 26, d: 19, w: 6 },
  { c: "✧", l: 93, s: 15, d: 14, w: 10 },
];
const noteIcons = { cloud: Cloud, heart: Heart, moon: Moon, sun: Sun };
function NoteIcon({ name, size = 26 }: { name: NoteIconName; size?: number }) {
  const Icon = noteIcons[name];
  return <Icon size={size} strokeWidth={1.6} />;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizReaction, setQuizReaction] = useState("");
  const [quizWrong, setQuizWrong] = useState(0);
  const [quizLocked, setQuizLocked] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [finalOpen, setFinalOpen] = useState(false);
  const [psst, setPsst] = useState(false);
  const [secret, setSecret] = useState("");
  const [titleClicks, setTitleClicks] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [photoOk, setPhotoOk] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const secretTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = () => setProgress(audio.currentTime || 0);
    const loaded = () => setDuration(audio.duration || 0);
    const fail = () => setAudioUnavailable(true);
    audio.addEventListener("timeupdate", time);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("error", fail);
    audio.volume = muted ? 0 : 0.45;
    return () => {
      audio.removeEventListener("timeupdate", time);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("error", fail);
    };
  }, [muted, entered]);

  // coba autoplay; kalau diblokir browser, musik mulai saat tombol masuk diklik
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio.play().then(() => { setPlaying(true); setHasStarted(true); }).catch(() => {});
  }, []);

  // cek foto berdua ada atau tidak
  useEffect(() => {
    const img = new Image();
    img.onload = () => setPhotoOk(true);
    img.src = "/images/foto-kita.jpg";
  }, []);

  // pesan psst muncul beberapa detik setelah hadiah dibuka
  useEffect(() => {
    if (!finalOpen) { setPsst(false); return; }
    const t = window.setTimeout(() => setPsst(true), 8000);
    return () => window.clearTimeout(t);
  }, [finalOpen]);

  useEffect(() => {
    const chars = ["♡", "♥", "✿", "✦", "✧"];
    const spawn = (x: number, y: number, cls: string, char: string, dx = 0) => {
      const el = document.createElement("span");
      el.className = cls;
      el.textContent = char;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--dx", `${dx}px`);
      document.body.appendChild(el);
      window.setTimeout(() => el.remove(), 1200);
    };
    const onDown = (e: PointerEvent) => {
      for (let i = 0; i < 4; i++) spawn(e.clientX, e.clientY, "click-heart", chars[Math.floor(Math.random() * chars.length)], (Math.random() - 0.5) * 90);
    };
    let last = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last < 90) return;
      last = now;
      spawn(e.clientX, e.clientY, "trail-sparkle", Math.random() > 0.5 ? "✦" : "♡", (Math.random() - 0.5) * 30);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); };
  }, []);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try { await audio.play(); setPlaying(true); setHasStarted(true); setAudioUnavailable(false); }
    catch { setPlaying(false); setAudioUnavailable(true); }
  };
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else await startMusic();
  };
  const burst = () => confetti({ particleCount: 45, spread: 68, origin: { y: 0.68 }, colors: ["#f5b8ca", "#d96c91", "#fff3e8", "#c94f70"] });
  const formatTime = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const revealSecret = (message: string) => {
    window.clearTimeout(secretTimer.current);
    setSecret(message);
    secretTimer.current = window.setTimeout(() => setSecret(""), Math.min(14000, Math.max(3800, message.length * 60)));
  };

  const answerQuiz = (i: number) => {
    if (quizLocked) return;
    const q = quiz[quizIndex];
    setQuizLocked(true);
    if (i !== q.answer) {
      setQuizWrong(v => v + 1);
      setQuizReaction(quizWrongReaction);
      window.setTimeout(() => { setQuizReaction(""); setQuizLocked(false); }, 1900);
      return;
    }
    setQuizReaction(q.reaction);
    window.setTimeout(() => {
      setQuizReaction("");
      setQuizLocked(false);
      if (quizIndex === quiz.length - 1) { setQuizDone(true); if (quizWrong === 0) burst(); }
      else setQuizIndex(v => v + 1);
    }, 3400);
  };
  const resetQuiz = () => { setQuizIndex(0); setQuizDone(false); setQuizReaction(""); setQuizWrong(0); setQuizLocked(false); };

  const musicStatus = audioUnavailable ? "lagunya belum bisa diputar" : playing ? musicPlaying : hasStarted ? musicPaused : siteConfig.trackArtist;

  return <main>
    <audio ref={audioRef} src="/music/our-song.mp3" loop preload="auto" />
    <div className="ambient" aria-hidden="true">{floaters.map((item, i) => <span key={i} className={`floater f${i}`}>{item}</span>)}{risers.map((r, i) => <span key={`r${i}`} className="riser" style={{ left: `${r.l}%`, fontSize: r.s, animationDuration: `${r.d}s`, animationDelay: `-${r.w}s` }}>{r.c}</span>)}</div>
    <div className="scroll-progress" aria-hidden="true" />

    <AnimatePresence>
      {!entered && <motion.div className="welcome" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .7 }}>
        <motion.div className="welcome-card" initial={{ opacity: 0, y: 30, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 14, delay: .1 }}>
          <div className="envelope-art"><span>♡</span></div>
          <p className="eyebrow">permisi, ada yang spesial mau lewat...</p>
          <h1>hey, {siteConfig.recipientName}.</h1>
          <p className="welcome-copy">ngga perlu mikir macem-macem, bukan mau nagih apa-apa. mas cuma pengen kasih sesuatu yang bisa kamu buka kapan aja, terutama saat lagi kangen sama mas. cieee</p>
          <button className="button primary" onClick={() => { setEntered(true); startMusic(); burst(); }}>masuk sini, sayang</button>
          <small>paling enak sambil nyalain suara ♪</small>
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    {entered && <>
      <nav className="nav-pill" aria-label="Main navigation">
        <button className="brand" onClick={() => { setTitleClicks(v => { const next = v + 1; if (next >= 5) { revealSecret(eggTitleFive); burst(); return 0; } return next; }); jump("home"); }} aria-label="Home and secret title">♡ little us</button>
        <div className="nav-links"><button onClick={() => jump("letter")}>surat</button><button onClick={() => jump("little-things")}>kartu</button><button onClick={() => jump("universe")}>universe</button><button onClick={() => jump("notes")}>amplop</button></div>
      </nav>
      <section className="hero section-wrap" id="home">
        <motion.button className="hero-sticker sticker-left" onClick={() => revealSecret(eggHiddenSticker)} aria-label="Stiker rahasia" animate={{ rotate: [-8, -3, -8], y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity }}>♡</motion.button>
        <div className="hero-copy"><p className="eyebrow">dari mas Jonathan, buat {siteConfig.partnerName}</p><h1>hey, <em>cantik.</em></h1><p>ngga ada alasan khusus, mas cuma pengen bikin sesuatu buat kamu. lagian, punya pacar secantik kamu masa ngga dipamerin sedikit? ya kan?</p><span className="hand-note">iya, mas tahu mas romantis. ngga perlu dikagumi berlebihan.</span><button className="button primary" onClick={() => jump("letter")}>lanjut yuk, masih ada lagi, sayang <Heart size={16} fill="currentColor" /></button></div>
        <motion.div className="hero-art" onClick={() => revealSecret(eggIllustrationClick)} onDoubleClick={() => revealSecret(eggDoubleClick)} animate={{ y: [0, -9, 0], rotate: [2, -1, 2] }} transition={{ duration: 5, repeat: Infinity }}><div className="sunburst">✦</div><div className="big-heart">♡</div><div className="hero-teddy"><Teddy size={220} /></div><span className="hero-caption">titipan dari mas</span><span className="tiny-star star-one">✦</span><span className="tiny-star star-two">✧</span></motion.div>
        <button className="heart-tap" onClick={() => revealSecret(eggSmallHeart)} aria-label="Reveal a secret message"><Heart size={18} fill="currentColor" /> ketuk, ada rahasia</button>
      </section>

      <section className="section-wrap letter-section" id="letter"><Reveal className="section-heading"><span className="section-kicker">01 / surat dari mas</span><h2>a little letter for my <em>favorite boy.</em></h2><p>mas nulisnya pelan-pelan, jadi bacanya juga jangan buru-buru, ya.</p></Reveal>
        <motion.div className={`letter-paper ${letterOpen ? "opened" : ""}`} layout><div className="paper-tape">♡</div><div className="paper-top">untuk {siteConfig.partnerName} <span>✿</span></div>{letterOpen ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}><div className="letter-body">{loveLetter.split("\n\n").map((t, i) => <motion.p key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .28, duration: .7 }}>{t}</motion.p>)}</div><motion.p className="letter-closing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 + loveLetter.split("\n\n").length * .28, duration: .8 }}>{letterClosing}</motion.p><motion.p className="signature" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 + loveLetter.split("\n\n").length * .28, duration: .8 }}>with love,<br /><b>— {siteConfig.senderName}</b></motion.p></motion.div> : <div className="closed-letter"><div className="sealed-envelope"><Mail size={44} strokeWidth={1.2} /><span>♡</span></div><p>{letterClosedText}</p></div>}<button className="button outline" onClick={() => { setLetterOpen(!letterOpen); if (!letterOpen) burst(); }}>{letterOpen ? "lipat lagi suratnya ♡" : "buka suratnya ♡"}</button></motion.div>
      </section>

      <section className="section-wrap" id="little-things"><Reveal className="section-heading"><span className="section-kicker">02 / hal-hal kecil</span><h2>things i <em>adore about you</em> ♡</h2><p>ketuk tiap kartu. iya, semuanya. jangan males.</p></Reveal><div className="love-grid">{loveCards.map((card, i) => <Reveal key={card.title} delay={i * .1} className="reveal-cell"><motion.button className={`love-card card-${i} ${flipped.includes(i) ? "is-flipped" : ""}`} onClick={() => setFlipped(old => old.includes(i) ? old.filter(x => x !== i) : [...old, i])} whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2, scale: 1.02 }} whileTap={{ scale: .95 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}><span className="card-icon">{card.icon}</span>{flipped.includes(i) ? <><span className="card-label">dari mas</span><p>{card.message}</p><span className="card-hint">ketuk buat balik ↺</span></> : <><span className="card-label">alasan no. {String(i + 1).padStart(2, "0")}</span><h3>{card.title}</h3><span className="card-hint">ketuk, ada pesan buat kamu ♡</span></>}</motion.button></Reveal>)}</div></section>

      <section className="section-wrap universe-section" id="universe"><Reveal className="section-heading"><span className="section-kicker">03 / satu foto, dulu</span><h2>our little <em>universe</em> ♡</h2><p>baru ada satu foto bareng, tapi mas simpen baik-baik. nanti koleksinya nambah, ya.</p></Reveal><div className="memory-grid single"><Reveal className="reveal-cell"><button className="memory-card memory-pink" onClick={() => revealSecret(memory.toast)}><div className={`memory-art ${photoOk ? "has-photo" : ""}`}>{photoOk ? <img src="/images/foto-kita.jpg" alt="foto kita berdua" /> : <Teddy size={120} />}</div><b>{memory.title}</b><small>{memory.caption}</small><span className="memory-date">{memory.label}</span></button></Reveal></div></section>

      <section className="section-wrap notes-section" id="notes"><Reveal className="section-heading"><span className="section-kicker">04 / kapan pun kamu butuh</span><h2>open when <em>you need it</em> ♡</h2><p>pilih satu. tiap amplop ada isinya.</p></Reveal><div className="notes-grid">{loveNotes.map((note, i) => <Reveal key={note.title} delay={i * .12} className="reveal-cell"><motion.button className={`note-envelope note-${note.color}`} onClick={() => setActiveNote(i)} whileHover={{ y: -10, rotate: i % 2 ? 3 : -3, scale: 1.04 }} whileTap={{ scale: .94 }} transition={{ type: "spring", stiffness: 280, damping: 14 }}><span className="note-icon"><NoteIcon name={note.icon} /></span><span className="envelope-flap">♡</span><b>{note.title}</b><small>buka pelan-pelan</small></motion.button></Reveal>)}</div></section>

      <section className="section-wrap quiz-section" id="quiz"><Reveal className="section-heading"><span className="section-kicker">05 / love quiz</span><h2>how well do you know <em>your mas?</em></h2><p>tiga pertanyaan aja. ngga usah tegang, ini bukan ujian nasional.</p></Reveal><div className="quiz-box">{quizDone ? <div className="quiz-result"><div className="result-heart">♡</div><h3>{quizWrong === 0 ? "lulus, nilai sempurna" : "hampir, tapi belum"}</h3><p className="result-msg">{quizWrong === 0 ? quizPerfect : quizImperfect}</p><button className="button primary" onClick={resetQuiz}>{quizRetry} <RotateCcw size={15} /></button></div> : <><div className="quiz-progress"><span>PERTANYAAN {quizIndex + 1} DARI {quiz.length}</span><div><i style={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }} /></div></div><motion.div key={quizIndex} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, ease: "easeOut" }}><h3>{quiz[quizIndex].question}</h3><div className="quiz-options">{quiz[quizIndex].options.map((option, i) => <button key={option} disabled={quizLocked} onClick={() => answerQuiz(i)}>{option}<span>♡</span></button>)}</div></motion.div><AnimatePresence>{quizReaction && <motion.p className="quiz-reaction" initial={{ opacity: 0, y: 10, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>{quizReaction}</motion.p>}</AnimatePresence></>}</div></section>

      <section className="section-wrap question-section"><motion.div className="question-card" initial={{ opacity: 0, y: 40, scale: .96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}><span className="section-kicker">06 / satu pertanyaan kecil</span><div className="question-heart">♡</div><h2>a very important <em>question.</em></h2><p className="question-text">{tinyQuestion.question}</p>{!questionAnswer ? <div className="question-actions"><button className="button primary" onClick={() => setQuestionAnswer(tinyQuestion.yesReply)}>{tinyQuestion.yes}</button><button className="button outline" onClick={() => setQuestionAnswer(tinyQuestion.noReply)}>{tinyQuestion.no}</button></div> : <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><p className="answer-text">{questionAnswer}</p><button className="button primary" onClick={() => jump("final")}>{tinyQuestion.next}</button></motion.div>}</motion.div></section>

      <section className="final-section" id="final"><motion.div className="final-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}><span className="section-kicker">07 / kejutan terakhir</span><div className="gift-illustration"><Gift size={72} strokeWidth={1.15} /><span>♡</span></div><h2>one last thing, <em>just for you.</em></h2><p>{finalGiftLabel}</p>{!finalOpen ? <button className="button primary" onClick={() => { setFinalOpen(true); burst(); }}>{finalButton} <Sparkles size={16} /></button> : <motion.div className="final-message" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 140, damping: 16 }}><div className="final-body">{finalMessage.split("\n\n").map((t, i) => <motion.p key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + i * .3, duration: .7 }}>{t}</motion.p>)}</div><motion.p className="final-closing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 + finalMessage.split("\n\n").length * .3, duration: .9 }}>{finalClosing}</motion.p><div className="signature">always yours,<br /><b>{siteConfig.senderName}.</b></div><AnimatePresence>{psst && <motion.div className="psst-card" initial={{ opacity: 0, y: 16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 140, damping: 16 }}>{finalPsst}</motion.div>}</AnimatePresence><div className="final-actions"><button className="button outline" onClick={() => setFinalOpen(false)}>tutup kejutannya ↺</button><button className="button primary" onClick={() => { setFinalOpen(false); setEntered(false); setLetterOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{finalRestart} ↑</button></div></motion.div>}</motion.div></section>

      <footer><button className="footer-star" onClick={() => revealSecret(eggFooter)} aria-label="Open a hidden message"><Star size={17} fill="currentColor" /></button><p>{footerMain}</p><small>{footerSmall}</small><small>created by {siteConfig.senderName}</small><small>{footerDate}</small><p className="song-note"><b>{siteConfig.trackTitle}, {siteConfig.trackArtist}.</b> {songMeaning}</p></footer>

      <div className="music-widget"><div className={`vinyl ${playing ? "spinning" : ""}`}><Music2 size={17} /></div><div className="music-meta"><b>{siteConfig.trackTitle}</b><small>{musicStatus}</small><div className="audio-progress"><i style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} /></div><small>{formatTime(progress)} / {duration ? formatTime(duration) : "--:--"}</small></div><button onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button><button onClick={() => setMuted(v => !v)} aria-label={muted ? "Unmute music" : "Mute music"}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button></div>
    </>}

    <AnimatePresence>{activeNote !== null && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveNote(null); }} onKeyDown={(e) => { if (e.key === "Escape") setActiveNote(null); }} tabIndex={-1}><motion.div className="note-modal" initial={{ y: 40, scale: .9, rotate: -2 }} animate={{ y: 0, scale: 1, rotate: 0 }} exit={{ y: 20, scale: .95, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}><button className="modal-close" onClick={() => setActiveNote(null)} aria-label="Close note"><X size={18} /></button><span className="note-modal-icon"><NoteIcon name={loveNotes[activeNote].icon} size={34} /></span><h3>{loveNotes[activeNote].title}</h3><p>{loveNotes[activeNote].message}</p><button className="button primary" onClick={() => setActiveNote(null)}>tutup amplopnya ♡</button></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{secret && <motion.div className="secret-toast" initial={{ opacity: 0, x: "-50%", y: -20, scale: .9 }} animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }} exit={{ opacity: 0, x: "-50%", y: -10, scale: .95 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}><Heart size={16} fill="currentColor" /><span>{secret}</span></motion.div>}</AnimatePresence>
    <button className="back-top" onClick={() => jump("home")} aria-label="Back to top"><ChevronUp size={18} /></button>
  </main>;
}
