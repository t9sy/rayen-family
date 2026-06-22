type HeroProps = {
  title: string;
  subtitle: string;
  updatesSubscribed: boolean;
  subscriptionStatus: string;
  isUpdatingSubscription: boolean;
  onToggleUpdatesSubscription: () => void;
  onEditDiscord: () => void;
  onEditMail: () => void;
  onEditGithub: () => void;
};

export function Hero({
  title,
  subtitle,
  updatesSubscribed,
  subscriptionStatus,
  isUpdatingSubscription,
  onToggleUpdatesSubscription,
  onEditDiscord,
  onEditMail,
  onEditGithub,
}: HeroProps) {
  return (
    <section className="hero" id="hero-root">
      <div className="hero-copy">
        <p className="terminal-line">rayen@family-tree ~</p>
        <h1>{title}</h1>
        <p className="intro">{subtitle}</p>
      </div>

      <div className="hero-actions">
        <p className="hero-note">Read only. Hover a person to open the record.</p>
        <p className="hero-note hero-status">{subscriptionStatus}</p>
        <button
          className={`update-button${updatesSubscribed ? ' is-subscribed' : ' is-unsubscribed'}`}
          type="button"
          aria-pressed={updatesSubscribed}
          disabled={isUpdatingSubscription}
          onClick={onToggleUpdatesSubscription}
        >
          {updatesSubscribed ? 'unsubscribe to page update' : 'subscribe to page update'}
        </button>
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
