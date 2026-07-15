import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  Zap, FlaskConical, Atom, Send, X, Menu, ChevronRight, ChevronDown, BookOpen,
  MessageCircle, Sparkles, GraduationCap, CircuitBoard, Magnet, Lightbulb,
  Globe2, TestTube, Layers, ArrowLeft, Loader2, RotateCcw, Languages, FileCheck2
} from "lucide-react";
import { SUBJECTS_DATA } from "./data.js";

/* ============================================================================
   ICON MAP — resolve iconKey strings from data.js to actual components
   ============================================================================ */
const ICONS = { Zap, FlaskConical, Atom, GraduationCap, CircuitBoard, Magnet, Lightbulb, Globe2, TestTube, Layers, Sparkles };

const SUBJECT_ICON = { physique: Zap, chimie: FlaskConical, svt: GraduationCap };

function buildSubjects() {
  const out = {};
  Object.values(SUBJECTS_DATA).forEach(subj => {
    out[subj.id] = {
      ...subj,
      icon: SUBJECT_ICON[subj.id] || Atom,
      chapters: subj.chapters.map(ch => ({ ...ch, icon: ICONS[ch.iconKey] || Atom }))
    };
  });
  return out;
}

const SUBJECTS = buildSubjects();
const NAV_PAGES = { HOME: "home", CHAPTER: "chapter", REVISION: "revision" };

// Adresse de l'API du chat IA.
// - En production sur Vercel : "/api/chat" est servi automatiquement par api/chat.js
// - En développement local avec "npm run dev" : Vite proxy /api vers le serveur
//   Express local (voir vite.config.js et server/index.js)
const API_BASE_URL = "";

/* ============================================================================
   UI STRINGS — interface en français, nav + footer en arabe
   ============================================================================ */
const UI = {
  brand: "Mayes Smei",
  home: "Accueil",
  askAi: "Demander à l'assistant",
  lesson: "Cours",
  revision: "Révision",
  chapters: "chapitres",
  startPhysique: "Commencer la physique",
  startChimie: "Commencer la chimie",
  heroEyebrow: "Programme officiel · Ministère de l'Éducation · 2ème année",
  heroTitleSub: "Ton espace pour la physique, la chimie et les SVT",
  heroDesc: "Tous les chapitres de 2ème année Sciences réunis, expliqués clairement, avec un assistant IA qui répond à tes questions, des schémas 3D interactifs et des séances de révision par chapitre.",
  featureAiTitle: "Un assistant dans chaque cours",
  featureAiDesc: "Pose une question sur un point que tu n'as pas compris, réponse immédiate.",
  feature3dTitle: "Schémas 3D interactifs",
  feature3dDesc: "Circuits, atomes, molécules — ils bougent devant toi pour mieux visualiser.",
  featureRevTitle: "Révision par chapitre",
  featureRevDesc: "Questions rapides après chaque chapitre, avec indices et aide IA.",
  askAboutPoint: "Poser une question sur ce point",
  explainMore: "Explication simplifiée",
  hideExplainMore: "Masquer l'explication",
  revisionHead: "Révision — ",
  revisionDesc: "Réponds mentalement d'abord, puis ouvre l'indice pour vérifier. Bloqué(e) ? Demande à l'assistant.",
  showHint: "Voir l'indice",
  hideHint: "Masquer l'indice",
  askAboutIt: "Poser une question",
  aiGreetingCtx: (ctx) => `Bonjour ! Je suis là pour t'aider à comprendre "${ctx}". Pose-moi une question sur le cours, je peux expliquer, donner des exemples, ou résumer un point.`,
  aiGreeting: "Bonjour ! Pose-moi une question de physique, chimie ou SVT. Je peux expliquer, résumer, ou donner des exemples.",
  aiPlaceholder: "Écris ta question ici...",
  aiThinking: "Réflexion...",
  aiError: "Erreur de connexion. Vérifie ta connexion et réessaie.",
};

/* ============================================================================
   3D HERO — Orbiting electron / molecule field (Three.js, ambient, mouse-reactive)
   ============================================================================ */
function HeroCanvas() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const nucleusGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleus);

    const nucleusGlowGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const nucleusGlowMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.15 });
    scene.add(new THREE.Mesh(nucleusGlowGeo, nucleusGlowMat));

    const colors = [0x22d3ee, 0x84e67a, 0xfb923c];
    const orbits = [];
    const radii = [2.1, 3.0, 3.9];
    radii.forEach((radius, idx) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.45, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(96);
      const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
      const mat = new THREE.LineBasicMaterial({ color: colors[idx % colors.length], transparent: true, opacity: 0.28 });
      const ring = new THREE.Line(geo, mat);
      ring.rotation.x = 0.4 + idx * 0.55;
      ring.rotation.y = idx * 0.9;
      ring.rotation.z = idx * 0.3;
      scene.add(ring);

      const electronGeo = new THREE.SphereGeometry(0.11, 16, 16);
      const electronMat = new THREE.MeshBasicMaterial({ color: colors[idx % colors.length] });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      scene.add(electron);

      orbits.push({ ring, electron, radius, speed: 0.35 + idx * 0.18, offset: idx * 2.1 });
    });

    const starCount = 220;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x9fb4d8, size: 0.035, transparent: true, opacity: 0.55 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    mount.addEventListener("mousemove", handleMouse);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      targetRotX += (mouseY * 0.25 - targetRotX) * 0.03;
      targetRotY += (mouseX * 0.35 - targetRotY) * 0.03;

      scene.rotation.x = targetRotX;
      scene.rotation.y = targetRotY + t * 0.05;

      orbits.forEach(o => {
        const angle = t * o.speed + o.offset;
        const local = new THREE.Vector3(Math.cos(angle) * o.radius, Math.sin(angle) * o.radius * 0.45, 0);
        local.applyEuler(o.ring.rotation);
        o.electron.position.copy(local);
      });

      nucleus.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04);
      stars.rotation.y = t * 0.01;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("mousemove", handleMouse);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}

/* ============================================================================
   Small reusable 3D schema viewer for lesson pages (per-chapter scene)
   ============================================================================ */
function SchemaCanvas({ kind, accent = "#22D3EE" }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const accentColor = new THREE.Color(accent);

    if (kind === "circuits") {
      const loopPts = [[-2, 1, 0], [2, 1, 0], [2, -1, 0], [-2, -1, 0], [-2, 1, 0]].map(p => new THREE.Vector3(...p));
      const loopGeo = new THREE.BufferGeometry().setFromPoints(loopPts);
      group.add(new THREE.Line(loopGeo, new THREE.LineBasicMaterial({ color: 0x8fa3c9 })));
      const nodePositions = [[-2, 1, 0], [2, 1, 0], [2, -1, 0], [-2, -1, 0]];
      nodePositions.forEach(p => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: accentColor }));
        m.position.set(...p);
        group.add(m);
      });
      const zig = [];
      for (let i = 0; i <= 8; i++) zig.push(new THREE.Vector3(-0.8 + i * 0.2, (i % 2 === 0 ? 0.25 : -0.25) + 1, 0));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(zig), new THREE.LineBasicMaterial({ color: accentColor })));
      const dots = [];
      for (let i = 0; i < 6; i++) {
        const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        group.add(d);
        dots.push(d);
      }
      const perim = 16;
      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        dots.forEach((d, i) => {
          const p = ((t * 0.6 + i / dots.length) % 1) * perim;
          let x, y;
          if (p < 4) { x = -2 + p; y = 1; }
          else if (p < 8) { x = 2; y = 1 - (p - 4); }
          else if (p < 12) { x = 2 - (p - 8); y = -1; }
          else { x = -2; y = -1 + (p - 12); }
          d.position.set(x, y, 0.05);
        });
        group.rotation.y = Math.sin(t * 0.25) * 0.15;
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (kind === "atom") {
      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      group.add(nucleus);
      const shellRadii = [1.1, 1.8, 2.5];
      const electronsPerShell = [2, 4, 3];
      const shellData = [];
      shellRadii.forEach((r, si) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 100), new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.35 }));
        ring.rotation.x = Math.PI / 2 + si * 0.5;
        ring.rotation.y = si * 0.7;
        group.add(ring);
        const electrons = [];
        for (let i = 0; i < electronsPerShell[si]; i++) {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: accentColor }));
          group.add(e);
          electrons.push({ mesh: e, offset: (i / electronsPerShell[si]) * Math.PI * 2 });
        }
        shellData.push({ ring, electrons, radius: r, speed: 0.4 - si * 0.08 });
      });
      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        shellData.forEach(s => {
          s.electrons.forEach(e => {
            const angle = t * s.speed + e.offset;
            const local = new THREE.Vector3(Math.cos(angle) * s.radius, Math.sin(angle) * s.radius, 0);
            local.applyEuler(s.ring.rotation);
            e.mesh.position.copy(local);
          });
        });
        group.rotation.y = t * 0.08;
        nucleus.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (kind === "molecule") {
      const centerAtom = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), new THREE.MeshBasicMaterial({ color: accentColor }));
      group.add(centerAtom);
      const satellites = [[1.4, 0.8, 0], [-1.4, 0.8, 0], [0, -1.2, 0.6]];
      satellites.forEach(pos => {
        const atom = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        atom.position.set(...pos);
        group.add(atom);
        const bondGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...pos)]);
        group.add(new THREE.Line(bondGeo, new THREE.LineBasicMaterial({ color: 0x8fa3c9 })));
      });
      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.35;
        group.rotation.x = Math.sin(t * 0.2) * 0.2;
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      const points = [];
      for (let i = 0; i <= 100; i++) points.push(new THREE.Vector3(-3 + (i / 100) * 6, 0, 0));
      const waveGeo = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: accentColor })));
      const clock = new THREE.Clock();
      const posAttr = waveGeo.attributes.position;
      const animate = () => {
        const t = clock.getElapsedTime();
        for (let i = 0; i <= 100; i++) {
          const x = -3 + (i / 100) * 6;
          posAttr.setY(i, Math.sin(x * 2.2 + t * 2) * 0.6);
        }
        posAttr.needsUpdate = true;
        group.rotation.y = Math.sin(t * 0.2) * 0.1;
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [kind, accent]);

  return <div ref={mountRef} className="schema-canvas" />;
}

/* ============================================================================
   AI CHAT PANEL — Claude API integration
   ============================================================================ */
function AiChatPanel({ open, onClose, context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: context ? UI.aiGreetingCtx(context) : UI.aiGreeting }]);
    }
  }, [open]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text: q }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const systemPrompt = `Tu es un professeur tunisien de physique-chimie et SVT pour la 2ème année secondaire (baccalauréat tunisien). Réponds en français clair et pédagogique, adapté au programme officiel tunisien. ${context ? `Contexte actuel : l'élève étudie "${context}".` : ""} Sois précis scientifiquement, concis, et encourageant. Utilise des exemples de la vie courante quand c'est utile.`;

      // Le navigateur appelle notre propre serveur (server/index.js), qui relaie
      // vers l'API Anthropic avec la clé secrète côté serveur. Voir README.md.
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }))
        })
      });
      const data = await response.json();
      const textBlock = (data.content || []).find(c => c.type === "text");
      const replyText = textBlock ? textBlock.text : "Désolé, je n'ai pas pu répondre. Réessaie.";
      setMessages(prev => [...prev, { role: "assistant", text: replyText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: UI.aiError }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, context]);

  return (
    <>
      <div className={`chat-overlay ${open ? "chat-overlay--open" : ""}`} onClick={onClose} />
      <aside className={`chat-panel ${open ? "chat-panel--open" : ""}`} aria-hidden={!open}>
        <div className="chat-panel__head">
          <div className="chat-panel__head-title">
            <Sparkles size={18} strokeWidth={2.2} />
            <span>Assistant</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        {context && (
          <div className="chat-panel__context">
            <BookOpen size={13} />
            <span>{context}</span>
          </div>
        )}
        <div className="chat-panel__messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-msg--${m.role}`}>{m.text}</div>
          ))}
          {loading && (
            <div className="chat-msg chat-msg--assistant chat-msg--loading">
              <Loader2 size={15} className="spin" /> {UI.aiThinking}
            </div>
          )}
        </div>
        <div className="chat-panel__input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder={UI.aiPlaceholder}
            className="chat-input"
          />
          <button className="chat-send" onClick={send} disabled={loading || !input.trim()} aria-label="Envoyer">
            <Send size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

/* ============================================================================
   REVISION / DVR — quiz-style per-chapter review
   ============================================================================ */
function buildQuizForChapter(chapter) {
  return chapter.sections.map((s, idx) => ({
    id: `${chapter.id}-${idx}`,
    q: `Explique brièvement : ${s.h}`,
    hint: s.body.slice(0, 110) + "…"
  }));
}

function RevisionView({ chapter, onAskAi }) {
  const [revealed, setRevealed] = useState({});
  const toggle = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  const hasRealExercises = Array.isArray(chapter.exercises) && chapter.exercises.length > 0;

  if (hasRealExercises) {
    return (
      <div className="revision">
        <div className="revision__head">
          <h3>{UI.revisionHead}{chapter.titleFr}</h3>
          <p>Essaie de résoudre chaque exercice toi-même avant d'ouvrir la correction.</p>
        </div>
        <div className="revision__list">
          {chapter.exercises.map((ex, i) => {
            const id = `${chapter.id}-ex-${i}`;
            return (
              <div className="revision-card" key={id}>
                <div className="revision-card__num">{String(i + 1).padStart(2, "0")}</div>
                <div className="revision-card__body">
                  <div className="revision-card__q">{ex.q}</div>
                  {revealed[id] && (
                    <div className="revision-card__hint revision-card__solution">
                      <strong>Correction :</strong> {ex.solution}
                      {ex.qAr && (
                        <div className="revision-card__solution-ar" dir="rtl">
                          <div className="revision-card__ar-label"><Languages size={12} /> بالعربية</div>
                          <div className="revision-card__q-ar">{ex.qAr}</div>
                          <div>{ex.solutionAr}</div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="revision-card__actions">
                    <button className="chip-btn" onClick={() => toggle(id)}>
                      {revealed[id] ? "Masquer la correction" : "Voir la correction"}
                    </button>
                    <button className="chip-btn chip-btn--ai" onClick={() => onAskAi(`${chapter.titleFr} — exercice : ${ex.q}`)}>
                      <MessageCircle size={13} /> {UI.askAboutIt}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const quiz = buildQuizForChapter(chapter);
  return (
    <div className="revision">
      <div className="revision__head">
        <h3>{UI.revisionHead}{chapter.titleFr}</h3>
        <p>{UI.revisionDesc}</p>
      </div>
      <div className="revision__list">
        {quiz.map((item, i) => (
          <div className="revision-card" key={item.id}>
            <div className="revision-card__num">{String(i + 1).padStart(2, "0")}</div>
            <div className="revision-card__body">
              <div className="revision-card__q">{item.q}</div>
              {revealed[item.id] && <div className="revision-card__hint">{item.hint}</div>}
              <div className="revision-card__actions">
                <button className="chip-btn" onClick={() => toggle(item.id)}>
                  {revealed[item.id] ? UI.hideHint : UI.showHint}
                </button>
                <button className="chip-btn chip-btn--ai" onClick={() => onAskAi(`${chapter.titleFr}: ${item.q}`)}>
                  <MessageCircle size={13} /> {UI.askAboutIt}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   LESSON / CHAPTER VIEW
   ============================================================================ */
function schemaKindFor(chapterId) {
  if (chapterId === "circuits") return "circuits";
  if (chapterId === "matiere") return "atom";
  if (chapterId === "solutions" || chapterId === "organique") return "molecule";
  return "wave";
}

function LessonCard({ section, index, subject, onAskAi }) {
  const [showMore, setShowMore] = useState(false);
  const [showAr, setShowAr] = useState(false);
  return (
    <article className="lesson-card">
      <div className="lesson-card__head">
        <span className="lesson-card__index" style={{ background: subject.accentDim, color: subject.accent }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{section.h}</h3>
      </div>
      <p className="lesson-card__body">{section.body}</p>

      {showMore && (
        <div className="lesson-card__more">
          <div className="lesson-card__more-label">
            <Languages size={13} /> Explication simplifiée
          </div>
          <p>{section.bodySimple}</p>
        </div>
      )}

      {showAr && section.bodyAr && (
        <div className="lesson-card__ar" dir="rtl">
          <div className="lesson-card__ar-label">
            <Languages size={13} /> بالعربية
          </div>
          {section.hAr && <h4>{section.hAr}</h4>}
          <p>{section.bodyAr}</p>
        </div>
      )}

      <div className="lesson-card__actions">
        <button
          className="lesson-card__ask"
          style={{ borderColor: subject.accentDim, color: subject.accent }}
          onClick={() => onAskAi(`${subject.labelFr} — ${section.h}`)}
        >
          <MessageCircle size={14} /> {UI.askAboutPoint}
        </button>
        <button
          className="lesson-card__toggle-ar"
          onClick={() => setShowMore(v => !v)}
        >
          <Languages size={14} /> {showMore ? UI.hideExplainMore : UI.explainMore}
        </button>
        {section.bodyAr && (
          <button
            className="lesson-card__toggle-trad"
            onClick={() => setShowAr(v => !v)}
          >
            <Languages size={14} /> {showAr ? "Masquer l'arabe" : "Traduction arabe"}
          </button>
        )}
      </div>
    </article>
  );
}

function ChapterView({ subject, chapter, mode, onAskAi }) {
  const Icon = chapter.icon;
  const kind = schemaKindFor(chapter.id);

  if (mode === "revision") {
    return <RevisionView chapter={chapter} onAskAi={onAskAi} />;
  }

  return (
    <div className="chapter">
      <div className="chapter__hero">
        <div className="chapter__hero-text">
          <div className="chapter__eyebrow" style={{ color: subject.accent }}>
            <Icon size={16} /> {subject.labelFr} · {chapter.hours}
          </div>
          <h2 className="chapter__title">{chapter.titleFr}</h2>
        </div>
        <SchemaCanvas kind={kind} accent={subject.accent} />
      </div>

      <div className="chapter__sections">
        {chapter.sections.map((s, i) => (
          <LessonCard key={i} section={s} index={i} subject={subject} onAskAi={onAskAi} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   SIDEBAR NAV — interface entièrement en français
   ============================================================================ */
function Sidebar({ activeSubject, setActiveSubject, activeChapter, setActiveChapter, mode, setMode, collapsed, setCollapsed }) {
  const [expanded, setExpanded] = useState({ [activeSubject]: true });
  const selectSubject = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark"><Atom size={20} /></div>
          {!collapsed && (
            <div className="sidebar__brand-text">
              <strong>{UI.brand}</strong>
              <span>Sciences physiques · Bac 2</span>
            </div>
          )}
        </div>
        <button className="icon-btn sidebar__collapse" onClick={() => setCollapsed(!collapsed)} aria-label="Ouvrir/fermer le menu">
          <Menu size={16} />
        </button>
      </div>

      <div className="sidebar__scroll">
        {Object.values(SUBJECTS).map(subj => {
          const SubjIcon = subj.icon;
          const isOpen = expanded[subj.id];
          return (
            <div className="sidebar__subject" key={subj.id}>
              <button className="sidebar__subject-btn" onClick={() => selectSubject(subj.id)} style={{ "--accent": subj.accent }}>
                <span className="sidebar__subject-icon" style={{ background: subj.accentDim }}>
                  <SubjIcon size={16} color={subj.accent} />
                </span>
                {!collapsed && (
                  <>
                    <span className="sidebar__subject-label">
                      <strong>{subj.labelFr}</strong>
                    </span>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="sidebar__chapters">
                  {subj.chapters.map(ch => {
                    const ChIcon = ch.icon;
                    const active = activeSubject === subj.id && activeChapter === ch.id;
                    return (
                      <div key={ch.id} className={`sidebar__chapter-group ${active ? "sidebar__chapter-group--active" : ""}`}>
                        <button
                          className="sidebar__chapter-btn"
                          onClick={() => { setActiveSubject(subj.id); setActiveChapter(ch.id); setMode("lesson"); }}
                          style={active ? { borderColor: subj.accent, color: subj.accent } : {}}
                        >
                          <ChIcon size={13} />
                          <span>{ch.titleFr}</span>
                        </button>
                        {active && (
                          <div className="sidebar__submodes">
                            <button
                              className={`sidebar__mode-btn ${mode === "lesson" ? "sidebar__mode-btn--active" : ""}`}
                              onClick={() => setMode("lesson")}
                              style={mode === "lesson" ? { color: subj.accent } : {}}
                            >
                              <BookOpen size={12} /> Cours
                            </button>
                            <button
                              className={`sidebar__mode-btn ${mode === "revision" ? "sidebar__mode-btn--active" : ""}`}
                              onClick={() => setMode("revision")}
                              style={mode === "revision" ? { color: subj.accent } : {}}
                            >
                              <FileCheck2 size={12} /> Devoir
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/* ============================================================================
   HOME PAGE
   ============================================================================ */
function HomePage({ onEnter }) {
  return (
    <div className="home">
      <div className="home__hero">
        <HeroCanvas />
        <div className="home__hero-content">
          <div className="home__eyebrow">{UI.heroEyebrow}</div>
          <h1 className="home__title">
            <span className="home__title-line">{UI.brand}</span>
            <span className="home__title-sub">{UI.heroTitleSub}</span>
          </h1>
          <p className="home__desc">{UI.heroDesc}</p>
          <div className="home__cta-row">
            <button className="btn-primary" onClick={() => onEnter("physique", "circuits")}>
              {UI.startPhysique} <ChevronRight size={16} />
            </button>
            <button className="btn-ghost" onClick={() => onEnter("chimie", "matiere")}>
              {UI.startChimie}
            </button>
          </div>
        </div>
      </div>

      <div className="home__grid">
        {Object.values(SUBJECTS).map(subj => {
          const Icon = subj.icon;
          return (
            <div
              className="subject-card"
              key={subj.id}
              style={{ "--accent": subj.accent, "--accentDim": subj.accentDim }}
              onClick={() => onEnter(subj.id, subj.chapters[0].id)}
            >
              <div className="subject-card__icon" style={{ background: subj.accentDim }}>
                <Icon size={22} color={subj.accent} />
              </div>
              <h3>{subj.labelFr}</h3>
              <p>{subj.chapters.length} {UI.chapters} au programme</p>
              <ul className="subject-card__chapters">
                {subj.chapters.slice(0, 4).map(ch => (
                  <li key={ch.id}>{ch.titleFr}</li>
                ))}
              </ul>
              <div className="subject-card__footer">
                <span>{subj.chapters.length} {UI.chapters}</span>
                <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="home__features">
        <div className="feature-row">
          <div className="feature-item">
            <Sparkles size={20} />
            <h4>{UI.featureAiTitle}</h4>
            <p>{UI.featureAiDesc}</p>
          </div>
          <div className="feature-item">
            <CircuitBoard size={20} />
            <h4>{UI.feature3dTitle}</h4>
            <p>{UI.feature3dDesc}</p>
          </div>
          <div className="feature-item">
            <RotateCcw size={20} />
            <h4>{UI.featureRevTitle}</h4>
            <p>{UI.featureRevDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN APP
   ============================================================================ */
export default function PhysicsHub() {
  const [page, setPage] = useState(NAV_PAGES.HOME);
  const [activeSubject, setActiveSubject] = useState("physique");
  const [activeChapter, setActiveChapter] = useState("circuits");
  const [mode, setMode] = useState("lesson");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const enterSubject = (subjId, chId) => {
    setActiveSubject(subjId);
    setActiveChapter(chId);
    setMode("lesson");
    setPage(NAV_PAGES.CHAPTER);
  };

  const subject = SUBJECTS[activeSubject];
  const chapter = subject.chapters.find(c => c.id === activeChapter) || subject.chapters[0];

  const openAi = (ctx) => {
    setChatContext(ctx || null);
    setChatOpen(true);
  };

  return (
    <div className="app-root">
      <style>{STYLES}</style>

      <button className="mobile-nav-toggle" onClick={() => setMobileNavOpen(v => !v)} aria-label="Menu">
        <Menu size={20} />
      </button>

      <div className={`mobile-nav-overlay ${mobileNavOpen ? "mobile-nav-overlay--open" : ""}`} onClick={() => setMobileNavOpen(false)} />

      <div className={`sidebar-wrap ${mobileNavOpen ? "sidebar-wrap--open" : ""}`}>
        <Sidebar
          activeSubject={activeSubject}
          setActiveSubject={(id) => { setActiveSubject(id); setPage(NAV_PAGES.CHAPTER); }}
          activeChapter={activeChapter}
          setActiveChapter={(id) => { setActiveChapter(id); setPage(NAV_PAGES.CHAPTER); setMobileNavOpen(false); }}
          mode={mode}
          setMode={setMode}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <main className="main-content">
        <header className="topbar">
          <button className="topbar__home" onClick={() => setPage(NAV_PAGES.HOME)}>
            <ArrowLeft size={15} /> {UI.home}
          </button>
          <div className="topbar__crumbs">
            {page === NAV_PAGES.CHAPTER && (
              <>
                <span style={{ color: subject.accent }}>{subject.labelFr}</span>
                <ChevronRight size={13} />
                <span>{chapter.titleFr}</span>
              </>
            )}
          </div>
          <button className="topbar__ai-btn" onClick={() => openAi(page === NAV_PAGES.CHAPTER ? `${chapter.titleFr}` : null)}>
            <Sparkles size={15} /> {UI.askAi}
          </button>
        </header>

        <div className="content-scroll">
          {page === NAV_PAGES.HOME ? (
            <HomePage onEnter={enterSubject} />
          ) : (
            <ChapterView subject={subject} chapter={chapter} mode={mode} onAskAi={openAi} />
          )}
        </div>
      </main>

      <AiChatPanel open={chatOpen} onClose={() => setChatOpen(false)} context={chatContext} />
    </div>
  );
}

/* ============================================================================
   STYLES
   ============================================================================ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Tajawal:wght@400;500;700;800&display=swap');

* { box-sizing: border-box; }

.app-root {
  --bg: #0A0F1D;
  --bg-elevated: #101830;
  --bg-card: #131C36;
  --border: #223055;
  --text: #E8ECF4;
  --text-dim: #8B97B8;
  --text-faint: #5C6A8C;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  direction: ltr;
  position: relative;
  overflow-x: hidden;
}

.app-root, .app-root * { scrollbar-width: thin; scrollbar-color: #2c3a63 transparent; }
.app-root ::-webkit-scrollbar { width: 8px; height: 8px; }
.app-root ::-webkit-scrollbar-thumb { background: #2c3a63; border-radius: 8px; }

.chevron-rtl { transform: scaleX(-1); }

/* ---------- Sidebar ---------- */
.sidebar-wrap { flex-shrink: 0; }
.sidebar {
  width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, #0D1428 0%, #0A0F1D 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  font-family: 'Inter', sans-serif;
}
.sidebar--collapsed { width: 76px; }

.sidebar__top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 16px; border-bottom: 1px solid var(--border);
}
.sidebar__brand { display: flex; align-items: center; gap: 10px; }
.sidebar__brand-mark {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #22D3EE22, #84E67A22);
  border: 1px solid #22D3EE44;
  display: flex; align-items: center; justify-content: center;
  color: #22D3EE; flex-shrink: 0;
}
.sidebar__brand-text { display: flex; flex-direction: column; line-height: 1.3; }
.sidebar__brand-text strong { font-family: 'Space Grotesk', sans-serif; font-size: 15px; letter-spacing: 0.3px; }
.sidebar__brand-text span { font-size: 11px; color: var(--text-faint); }

.icon-btn {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid var(--border);
  color: var(--text-dim); cursor: pointer; transition: all 0.15s ease;
}
.icon-btn:hover { background: var(--bg-card); color: var(--text); }

.sidebar__scroll { flex: 1; overflow-y: auto; padding: 10px 10px 20px; }

.sidebar__subject { margin-bottom: 4px; }
.sidebar__subject-btn {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 10px; border-radius: 12px; border: none;
  background: transparent; cursor: pointer; text-align: left;
  color: var(--text); transition: background 0.15s ease;
}
.sidebar__subject-btn:hover { background: var(--bg-card); }
.sidebar__subject-icon {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.sidebar__subject-label { display: flex; flex-direction: column; flex: 1; line-height: 1.35; text-align: left; }
.sidebar__subject-label strong { font-size: 13.5px; }
.sidebar__subject-label em { font-size: 10.5px; color: var(--text-faint); font-style: normal; }

.sidebar__chapters { padding: 4px 6px 8px 6px; display: flex; flex-direction: column; gap: 2px; }
.sidebar__chapter-group { border-radius: 10px; overflow: hidden; }
.sidebar__chapter-group--active { background: #ffffff06; }
.sidebar__chapter-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 8px 10px 8px 30px; border-radius: 10px; border: 1px solid transparent;
  background: transparent; color: var(--text-dim); font-size: 12.5px;
  cursor: pointer; text-align: left; transition: all 0.15s ease;
}
.sidebar__chapter-btn:hover { color: var(--text); }
.sidebar__submodes { display: flex; gap: 6px; padding: 2px 10px 8px 30px; }
.sidebar__mode-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; padding: 4px 8px; border-radius: 20px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text-faint); cursor: pointer; font-family: 'Inter', sans-serif;
}
.sidebar__mode-btn--active { border-color: currentColor; }

/* ---------- Mobile nav ---------- */
.mobile-nav-toggle {
  display: none; position: fixed; top: 14px; left: 14px; z-index: 55;
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--bg-card); border: 1px solid var(--border);
  color: var(--text); align-items: center; justify-content: center;
}
.mobile-nav-overlay { display: none; }

/* ---------- Main content (français, LTR) ---------- */
.main-content { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 28px; border-bottom: 1px solid var(--border);
  background: #0A0F1DCC; backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 10;
}
.topbar__home {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: none; color: var(--text-dim);
  font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif;
}
.topbar__home:hover { color: var(--text); }
.topbar__crumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-dim); }
.topbar__ai-btn {
  display: flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #22D3EE18, #84E67A18);
  border: 1px solid #22D3EE55; color: #22D3EE;
  padding: 8px 16px; border-radius: 20px; font-size: 13px;
  cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600;
  transition: all 0.15s ease;
}
.topbar__ai-btn:hover { background: #22D3EE28; }

.content-scroll { flex: 1; overflow-y: auto; }

/* ---------- Home ---------- */
.home__hero { position: relative; height: 560px; overflow: hidden; border-bottom: 1px solid var(--border); }
.hero-canvas { position: absolute; inset: 0; z-index: 0; }
.home__hero-content {
  position: relative; z-index: 1; height: 100%;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 60px; max-width: 720px; pointer-events: none;
}
.home__eyebrow {
  font-size: 12px; letter-spacing: 0.5px; color: #84E67A;
  font-family: 'Inter', sans-serif; margin-bottom: 18px;
  border: 1px solid #84E67A44; display: inline-block; padding: 5px 12px;
  border-radius: 20px; background: #84E67A11; width: fit-content;
}
.home__title { margin: 0 0 18px; }
.home__title-line {
  display: block; font-family: 'Space Grotesk', sans-serif;
  font-size: 64px; font-weight: 700; line-height: 1;
  background: linear-gradient(135deg, #ffffff 30%, #22D3EE 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  letter-spacing: -1px;
}
.home__title-sub { display: block; font-size: 20px; font-weight: 500; color: var(--text-dim); margin-top: 10px; }
.home__desc { font-size: 15px; color: var(--text-dim); line-height: 1.8; margin-bottom: 30px; max-width: 560px; }
.home__cta-row { display: flex; gap: 14px; pointer-events: all; }

.btn-primary {
  display: flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #22D3EE, #0EA5C4);
  color: #061018; border: none; padding: 13px 26px; border-radius: 12px;
  font-size: 14.5px; font-weight: 700; cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 30px -8px #22D3EE66;
  transition: transform 0.15s ease;
}
.btn-primary:hover { transform: translateY(-2px); }
.btn-ghost {
  display: flex; align-items: center; gap: 8px;
  background: transparent; border: 1px solid var(--border); color: var(--text);
  padding: 13px 26px; border-radius: 12px; font-size: 14.5px; font-weight: 600;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all 0.15s ease;
}
.btn-ghost:hover { border-color: #84E67A88; color: #84E67A; }

.home__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 50px 60px; }
.subject-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 18px; padding: 26px; cursor: pointer;
  transition: all 0.2s ease; position: relative; overflow: hidden;
}
.subject-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 16px 40px -20px var(--accent); }
.subject-card__icon {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
}
.subject-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; margin: 0 0 2px; }
.subject-card p { font-size: 13px; color: var(--text-faint); margin: 0 0 16px; font-family: 'Tajawal', sans-serif; }
.subject-card__chapters { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.subject-card__chapters li { font-size: 12.5px; color: var(--text-dim); padding-left: 14px; position: relative; }
.subject-card__chapters li::before {
  content: ''; position: absolute; left: 0; top: 7px;
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
}
.subject-card__footer {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; color: var(--accent); font-weight: 600;
  padding-top: 14px; border-top: 1px solid var(--border);
}

.home__features { padding: 10px 60px 70px; }
.feature-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.feature-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px; padding: 24px; color: #22D3EE; }
.feature-item h4 { color: var(--text); font-size: 15px; margin: 12px 0 6px; font-family: 'Space Grotesk', sans-serif; }
.feature-item p { color: var(--text-dim); font-size: 13px; line-height: 1.7; margin: 0; }

/* ---------- Chapter view ---------- */
.chapter { padding: 40px 60px 80px; max-width: 980px; }
.chapter__hero {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 30px; align-items: center;
  margin-bottom: 46px; padding-bottom: 40px; border-bottom: 1px solid var(--border);
}
.chapter__eyebrow {
  display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700;
  margin-bottom: 14px; font-family: 'Inter', sans-serif; letter-spacing: 0.3px;
}
.chapter__title { font-family: 'Space Grotesk', sans-serif; font-size: 32px; margin: 0 0 8px; line-height: 1.25; }
.chapter__title-ar { color: var(--text-faint); font-size: 15px; font-family: 'Tajawal', sans-serif; margin: 0; }
.schema-canvas { width: 100%; height: 220px; }

.chapter__sections { display: flex; flex-direction: column; gap: 18px; }
.lesson-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px 26px; }
.lesson-card__head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.lesson-card__index {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; font-family: 'Space Grotesk', sans-serif;
}
.lesson-card__head h3 { font-size: 16.5px; margin: 0; font-weight: 700; font-family: 'Inter', sans-serif; }
.lesson-card__body { color: var(--text-dim); font-size: 14.5px; line-height: 1.85; margin: 0 0 16px; }

.lesson-card__ar {
  background: linear-gradient(135deg, #22D3EE0A, #84E67A08);
  border: 1px solid #22D3EE33; border-radius: 12px; padding: 16px 18px; margin-bottom: 16px;
  font-family: 'Tajawal', sans-serif;
}
.lesson-card__ar-label {
  display: flex; align-items: center; gap: 6px; font-size: 11px; color: #22D3EE;
  margin-bottom: 8px; font-weight: 700;
}
.lesson-card__ar h4 { font-size: 14.5px; margin: 0 0 8px; color: var(--text); }
.lesson-card__ar p { font-size: 14px; line-height: 2; color: var(--text-dim); margin: 0; }

.lesson-card__actions { display: flex; gap: 10px; flex-wrap: wrap; }
.lesson-card__ask, .lesson-card__toggle-ar, .lesson-card__toggle-trad {
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; border: 1px solid; padding: 7px 14px;
  border-radius: 20px; font-size: 12.5px; cursor: pointer;
  font-family: 'Inter', sans-serif; font-weight: 600;
}
.lesson-card__toggle-ar {
  border-color: #84E67A55; color: #84E67A; font-family: 'Tajawal', sans-serif;
}
.lesson-card__toggle-trad {
  border-color: #FB923C55; color: #FB923C; font-family: 'Tajawal', sans-serif;
}

/* ---------- Revision ---------- */
.revision { padding: 40px 60px 80px; max-width: 900px; }
.revision__head h3 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; margin: 0 0 8px; }
.revision__head p { color: var(--text-dim); font-size: 14px; margin: 0 0 30px; }
.revision__list { display: flex; flex-direction: column; gap: 14px; }
.revision-card { display: flex; gap: 16px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.revision-card__num { font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: var(--text-faint); flex-shrink: 0; }
.revision-card__q { font-size: 14.5px; font-weight: 600; margin-bottom: 8px; }
.revision-card__hint { font-size: 13.5px; color: var(--text-dim); line-height: 1.8; background: #ffffff06; padding: 10px 14px; border-radius: 10px; margin-bottom: 12px; }
.revision-card__solution { color: var(--text); }
.revision-card__solution strong { color: #84E67A; }
.revision-card__solution-ar {
  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  font-family: 'Tajawal', sans-serif; color: var(--text-dim); line-height: 2;
}
.revision-card__q-ar { font-weight: 700; color: var(--text); margin-bottom: 6px; }
.revision-card .revision-card__ar-label {
  display: flex; align-items: center; gap: 5px; font-size: 11px; color: #FB923C;
  margin-bottom: 6px; font-weight: 700;
}
.revision-card__actions { display: flex; gap: 8px; }
.chip-btn {
  font-size: 12px; padding: 6px 12px; border-radius: 20px;
  background: transparent; border: 1px solid var(--border); color: var(--text-dim);
  cursor: pointer; font-family: 'Inter', sans-serif;
}
.chip-btn--ai { display: flex; align-items: center; gap: 5px; color: #22D3EE; border-color: #22D3EE44; }

/* ---------- AI Chat panel ---------- */
.chat-overlay { position: fixed; inset: 0; background: #00000066; z-index: 58; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.chat-overlay--open { opacity: 1; pointer-events: all; }

.chat-panel {
  position: fixed; top: 0; bottom: 0; right: -420px; width: 400px;
  background: #0D1428; border-left: 1px solid var(--border);
  z-index: 59; display: flex; flex-direction: column;
  transition: right 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', sans-serif;
}
.chat-panel--open { right: 0; }
.chat-panel__head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border); }
.chat-panel__head-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: #22D3EE; }
.chat-panel__context { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-faint); padding: 10px 20px; border-bottom: 1px solid var(--border); }
.chat-panel__messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.chat-msg { max-width: 88%; padding: 12px 16px; border-radius: 16px; font-size: 13.5px; line-height: 1.7; }
.chat-msg--assistant { background: var(--bg-card); align-self: flex-start; border: 1px solid var(--border); }
.chat-msg--user { background: linear-gradient(135deg, #22D3EE22, #22D3EE11); align-self: flex-end; border: 1px solid #22D3EE33; }
.chat-msg--loading { display: flex; align-items: center; gap: 8px; color: var(--text-faint); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.chat-panel__input-row { display: flex; gap: 8px; padding: 16px 20px; border-top: 1px solid var(--border); }
.chat-input { flex: 1; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 11px 14px; color: var(--text); font-size: 13.5px; font-family: 'Inter', sans-serif; }
.chat-input:focus { outline: none; border-color: #22D3EE88; }
.chat-send {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  background: #22D3EE; border: none; color: #061018;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .sidebar-wrap { position: fixed; top: 0; right: -300px; height: 100vh; z-index: 45; transition: right 0.25s ease; }
  .sidebar-wrap--open { right: 0; }
  .mobile-nav-toggle { display: flex; }
  .mobile-nav-overlay { display: block; position: fixed; inset: 0; background: #00000077; z-index: 44; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
  .mobile-nav-overlay--open { opacity: 1; pointer-events: all; }
  .home__hero-content, .chapter, .revision, .home__grid, .home__features { padding-left: 20px; padding-right: 20px; }
  .home__grid, .feature-row { grid-template-columns: 1fr; }
  .chapter__hero { grid-template-columns: 1fr; }
  .home__title-line { font-size: 42px; }
  .chat-panel {
    inset: 0;
    width: auto;
    right: auto;
    left: 0;
    max-width: 100vw;
    transform: translateX(100%);
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .chat-panel--open { transform: translateX(0); right: auto; }
  .chat-panel__messages { -webkit-overflow-scrolling: touch; }
  .chat-input { font-size: 16px; }
  .topbar {
    padding: 12px 14px 12px 56px;
    gap: 8px;
  }
  .topbar__crumbs { display: none; }
  .topbar__home span, .topbar__home { font-size: 12.5px; white-space: nowrap; }
  .topbar__ai-btn {
    font-size: 12px; padding: 7px 12px; white-space: nowrap; flex-shrink: 0;
  }
}
`;
