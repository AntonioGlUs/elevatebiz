"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { supabase } from "@/lib/supabase";
import Dictate, { useLiveText } from "./Dictate";
import styles from "./onboarding.module.css";

type Lang = "en" | "es";
export type ExtraLink = { url: string; note: string };
export type ExtraFile = { id: number; path: string; name: string; size_bytes: number };
export type ExtrasData = { colors: string[]; links: ExtraLink[]; notes: string; files: ExtraFile[] };

export const EMPTY_EXTRAS: ExtrasData = { colors: [], links: [], notes: "", files: [] };
// Test mode (no account): colors, links and notes are kept in the browser. Files need an account.
export const TEST_EXTRAS_KEY = "eb-onboarding-test-extras";

const BUCKET = "onboarding-files";
const MAX_BYTES = 10 * 1024 * 1024; // same limit as the storage bucket
const ACCEPT = ".png,.jpg,.jpeg,.webp,.gif,.svg,.pdf,.doc,.docx";
const ALLOWED = /\.(png|jpe?g|webp|gif|svg|pdf|docx?)$/i;

const COPY = {
  en: {
    back: "All questionnaires",
    title: "Materials and extras",
    intro: "Everything here is optional. Add what you think will help us; it is saved as you go.",
    files: "Files",
    filesHelp: "Logos, photos, catalogs, menus, price lists. Images, PDF or Word, up to 10 MB each.",
    drop: "Drag files here or",
    choose: "choose files",
    uploading: "Uploading...",
    tooBig: "{name} is larger than 10 MB.",
    badType: "{name} is not an image, PDF or Word file.",
    uploadError: "We couldn't upload {name}. Please try again.",
    filesTest: "Uploading files needs an account. Sign in with your email to try it.",
    colors: "Brand colors",
    colorsHelp: "Colors you want to keep in the look of your website and materials.",
    addColor: "Add color",
    pickColor: "Pick a color",
    links: "Sites you like",
    linksHelp: "Websites or brands whose style you like, and what you like about each.",
    linkUrl: "https://",
    linkNote: "What do you like about it?",
    addLink: "Add a link",
    notes: "Anything else",
    notesHelp: "Any other information about your business you want us to have.",
    notesPlaceholder: "Write here...",
    remove: "Remove",
    saving: "Saving...",
    saved: "All changes saved",
    saveError: "We couldn't save your changes. Check your connection.",
    testBanner: "Test mode: what you add here stays in this browser only and is not sent to us.",
  },
  es: {
    back: "Todos los cuestionarios",
    title: "Materiales y extras",
    intro: "Todo aquí es opcional. Agrega lo que creas que nos ayuda; se guarda conforme avanzas.",
    files: "Archivos",
    filesHelp: "Logos, fotos, catálogos, menús, listas de precios. Imágenes, PDF o Word, hasta 10 MB cada uno.",
    drop: "Arrastra archivos aquí o",
    choose: "elige archivos",
    uploading: "Subiendo...",
    tooBig: "{name} pesa más de 10 MB.",
    badType: "{name} no es una imagen, PDF ni Word.",
    uploadError: "No pudimos subir {name}. Intenta de nuevo.",
    filesTest: "Subir archivos requiere una cuenta. Entra con tu correo para probarlo.",
    colors: "Colores de marca",
    colorsHelp: "Colores que quieres conservar en el estilo de tu sitio web y materiales.",
    addColor: "Agregar color",
    pickColor: "Elige un color",
    links: "Sitios que te gustan",
    linksHelp: "Sitios web o marcas cuyo estilo te gusta, y qué te gusta de cada uno.",
    linkUrl: "https://",
    linkNote: "¿Qué te gusta de él?",
    addLink: "Agregar un link",
    notes: "Algo más",
    notesHelp: "Cualquier otra información de tu negocio que quieras que tengamos.",
    notesPlaceholder: "Escribe aquí...",
    remove: "Quitar",
    saving: "Guardando...",
    saved: "Cambios guardados",
    saveError: "No pudimos guardar tus cambios. Revisa tu conexión.",
    testBanner: "Modo de prueba: lo que agregues aquí se queda solo en este navegador y no se nos envía.",
  },
};

const sizeLabel = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

type Props = {
  userId: string | null; // null = test mode
  lang: Lang;
  initial: ExtrasData;
  onChange: (data: ExtrasData) => void; // keeps the list screen's summary up to date
  onExit: () => void;
};

// Free page: files, brand colors, sites the client likes and notes. Nothing is required; it saves as the client goes.
export default function Extras({ userId, lang, initial, onChange, onExit }: Props) {
  const t = COPY[lang];
  const [data, setData] = useState<ExtrasData>(initial);
  const [pick, setPick] = useState("#01c3cc");
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  // Dictation writes straight into the notes while the client speaks
  const live = useLiveText(data.notes, (notes) => setData((current) => ({ ...current, notes })));

  useEffect(() => {
    onChange(data);
    // onChange is stable enough for this: the list only needs the latest data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Colors, links and notes are saved a moment after the client stops editing
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setStatus("saving");
    const timer = setTimeout(async () => {
      const links = data.links.filter((link) => link.url.trim() || link.note.trim());
      if (userId) {
        const { error } = await supabase
          .from("onboarding_extras")
          .upsert({ user_id: userId, colors: data.colors, reference_links: links, notes: data.notes }, { onConflict: "user_id" });
        setStatus(error ? "error" : "saved");
      } else {
        try {
          localStorage.setItem(TEST_EXTRAS_KEY, JSON.stringify({ colors: data.colors, links, notes: data.notes }));
        } catch {
          /* storage unavailable: kept in memory for this visit */
        }
        setStatus("saved");
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [data.colors, data.links, data.notes, userId]);

  const upload = async (list: FileList | null) => {
    if (!list || !userId) return;
    setFileError(null);
    setUploading(true);
    for (const file of Array.from(list)) {
      if (!ALLOWED.test(file.name)) {
        setFileError(t.badType.replace("{name}", file.name));
        continue;
      }
      if (file.size > MAX_BYTES) {
        setFileError(t.tooBig.replace("{name}", file.name));
        continue;
      }
      // Each client's files live in a folder named with their user id (the storage rules require it)
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
      const stored = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined });
      if (stored.error) {
        setFileError(t.uploadError.replace("{name}", file.name));
        continue;
      }
      const row = await supabase
        .from("onboarding_files")
        .insert({ user_id: userId, path, name: file.name, size_bytes: file.size, mime_type: file.type || null })
        .select("id,path,name,size_bytes")
        .single();
      if (row.error || !row.data) {
        await supabase.storage.from(BUCKET).remove([path]);
        setFileError(t.uploadError.replace("{name}", file.name));
        continue;
      }
      const added = row.data as ExtraFile;
      setData((current) => ({ ...current, files: [...current.files, added] }));
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeFile = async (file: ExtraFile) => {
    if (!userId) return;
    await supabase.storage.from(BUCKET).remove([file.path]);
    await supabase.from("onboarding_files").delete().eq("id", file.id);
    setData((current) => ({ ...current, files: current.files.filter((f) => f.id !== file.id) }));
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    upload(event.dataTransfer.files);
  };

  const setLink = (index: number, patch: Partial<ExtraLink>) =>
    setData((current) => ({ ...current, links: current.links.map((link, i) => (i === index ? { ...link, ...patch } : link)) }));

  return (
    <section className={styles.card}>
      <button type="button" className={`${styles.link} ${styles.backLink}`} onClick={onExit}>
        ← {t.back}
      </button>
      {!userId && <p className={styles.testBanner}>{t.testBanner}</p>}
      <h1 className={styles.title}>{t.title}</h1>
      <p className={styles.text}>{t.intro}</p>

      <div className={styles.block}>
        <h2 className={styles.blockTitle}>{t.files}</h2>
        <p className={styles.help}>{t.filesHelp}</p>
        {userId ? (
          <div
            className={dragging ? `${styles.drop} ${styles.dropOn}` : styles.drop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {uploading ? (
              t.uploading
            ) : (
              <>
                {t.drop}{" "}
                <button type="button" className={styles.link} onClick={() => fileInput.current?.click()}>
                  {t.choose}
                </button>
              </>
            )}
            <input ref={fileInput} type="file" multiple accept={ACCEPT} hidden onChange={(e) => upload(e.target.files)} />
          </div>
        ) : (
          <p className={styles.drop}>{t.filesTest}</p>
        )}
        {fileError && (
          <p className={styles.error} role="alert">
            {fileError}
          </p>
        )}
        {data.files.length > 0 && (
          <ul className={styles.rows}>
            {data.files.map((file) => (
              <li key={file.id} className={styles.row}>
                <span className={styles.rowName}>{file.name}</span>
                <span className={styles.rowMeta}>{sizeLabel(file.size_bytes)}</span>
                <button type="button" className={styles.link} onClick={() => removeFile(file)}>
                  {t.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.block}>
        <h2 className={styles.blockTitle}>{t.colors}</h2>
        <p className={styles.help}>{t.colorsHelp}</p>
        <div className={styles.colorAdd}>
          <input type="color" className={styles.colorInput} value={pick} aria-label={t.pickColor} onChange={(e) => setPick(e.target.value)} />
          <span className={styles.rowMeta}>{pick.toUpperCase()}</span>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              const hex = pick.toUpperCase();
              setData((current) => (current.colors.includes(hex) ? current : { ...current, colors: [...current.colors, hex] }));
            }}
          >
            + {t.addColor}
          </button>
        </div>
        {data.colors.length > 0 && (
          <ul className={styles.chips}>
            {data.colors.map((hex) => (
              <li key={hex} className={styles.chip}>
                <i style={{ background: hex }} />
                {hex}
                <button
                  type="button"
                  aria-label={`${t.remove} ${hex}`}
                  onClick={() => setData((current) => ({ ...current, colors: current.colors.filter((c) => c !== hex) }))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.block}>
        <h2 className={styles.blockTitle}>{t.links}</h2>
        <p className={styles.help}>{t.linksHelp}</p>
        <div className={styles.faqs}>
          {data.links.map((link, i) => (
            <div key={i} className={styles.faq}>
              <input
                className={styles.input}
                type="url"
                inputMode="url"
                placeholder={t.linkUrl}
                aria-label={`Link ${i + 1}`}
                value={link.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
              />
              <input
                className={styles.input}
                type="text"
                placeholder={t.linkNote}
                aria-label={`${t.linkNote} ${i + 1}`}
                value={link.note}
                onChange={(e) => setLink(i, { note: e.target.value })}
              />
              <button type="button" className={styles.link} onClick={() => setData((current) => ({ ...current, links: current.links.filter((_, j) => j !== i) }))}>
                {t.remove}
              </button>
            </div>
          ))}
          <button type="button" className={styles.secondary} onClick={() => setData((current) => ({ ...current, links: [...current.links, { url: "", note: "" }] }))}>
            + {t.addLink}
          </button>
        </div>
      </div>

      <div className={styles.block}>
        <h2 className={styles.blockTitle}>{t.notes}</h2>
        <p className={styles.help}>{t.notesHelp}</p>
        <textarea
          className={styles.textarea}
          rows={6}
          placeholder={t.notesPlaceholder}
          aria-label={t.notes}
          value={data.notes}
          onChange={(e) => {
            live.onTyped();
            setData((current) => ({ ...current, notes: e.target.value }));
          }}
        />
        <Dictate
          lang={lang}
          onLive={live.onLive}
          onClear={
            data.notes
              ? () => {
                  live.onTyped();
                  setData((current) => ({ ...current, notes: "" }));
                }
              : undefined
          }
        />
      </div>

      <div className={styles.actions}>
        <span className={status === "error" ? styles.error : styles.saveState} role="status">
          {status === "saving" ? t.saving : status === "error" ? t.saveError : t.saved}
        </span>
        <button type="button" className={styles.primary} onClick={onExit}>
          {t.back}
        </button>
      </div>
    </section>
  );
}
