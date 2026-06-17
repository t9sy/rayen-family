type HeroProps = {
  title: string;
  subtitle: string;
  onEditDiscord: () => void;
  onEditMail: () => void;
  onEditGithub: () => void;
};

export function Hero({ title, subtitle, onEditDiscord, onEditMail, onEditGithub }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="terminal-line">rayen@family-tree ~</p>
        <h1>{title}</h1>
        <p className="intro">{subtitle}</p>
      </div>

      <div className="hero-actions">
        <p className="hero-note">Read only. Hover a person to open the record.</p>
        <button className="edit-button" type="button" onClick={onEditDiscord}>
          Request an edit on Discord
        </button>
        <button className="edit-button" type="button" onClick={onEditMail}>
          Request an edit by email
        </button>
        <button className="edit-button" type="button" onClick={onEditGithub}>
          Contribute directly on GitHub
        </button>
      </div>
    </section>
  );
}
