import type { Texts } from "./types";
import styles from "./PainPoints.module.css";
import Robot3D from "./Robot3D";

export default function PainPoints({ t }: { t: Texts }) {
  const items = [
    { bold: t.pain1Bold, text: t.pain1 },
    { bold: t.pain2Bold, text: t.pain2 },
    { bold: t.pain3Bold, text: t.pain3 },
    { bold: t.pain4Bold, text: t.pain4 },
  ];

  return (
    <div className={styles.section}>
      <div className={`eb-pain-inner ${styles.inner}`}>
        <div className={`eb-pain-left ${styles.left}`}>
          <h2 className={`eb-h2 ${styles.title}`}>{t.painTitle}</h2>
          <span className={styles.accent} />
          <p className={styles.subtitle}>{t.painSubtitle}</p>
        </div>
        <div className={`eb-pain-right ${styles.right}`}>
          {items.map((item, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.dot} />
              <p className={styles.text}>
                <strong>{item.bold}</strong>
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.robot}>
          <Robot3D />
        </div>
      </div>
    </div>
  );
}
