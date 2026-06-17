type HeroProps = {
  title: string;
  subtitle: string;
  onEdit: () => void;
};

export function Hero({ title, subtitle, onEdit }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="terminal-line">rayen@family-tree ~</p>
        <h1>{title}</h1>
        <p className="intro">{subtitle}</p>
      </div>

      <div className="hero-actions">
        <p className="hero-note">Read only. Hover a person to open the record.</p>
        <button className="edit-button" type="button" onClick={onEdit}>
          Request an edit on Discord
        </button>
      </div>
    </section>
  );
}
