import { useState } from 'react';
import type { Person, Relation } from '../family/types';

type PersonCardProps = {
  person: Person;
  relatedRelations: Relation[];
  otherPersonName: (personId: string) => string;
  setCardRef: (personId: string, node: HTMLElement | null) => void;
};

export function PersonCard({ person, relatedRelations, otherPersonName, setCardRef }: PersonCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const avatarLabel = person.avatarImage ? person.name : '?';
  const aliases = person.aliases ?? [];
  const warnings = person.warnings ?? [];

  return (
    <article
      className={`person-card${isOpen ? ' is-open' : ''}${warnings.length > 0 ? ' has-warnings' : ''}`}
      ref={(node) => {
        setCardRef(person.id, node);
      }}
      onPointerLeave={() => setIsOpen(false)}
    >
      <div className="person-core">
        <div
          className="person-avatar"
          aria-hidden="true"
          onPointerEnter={() => setIsOpen(true)}
        >
          {person.avatarImage ? (
            <img src={person.avatarImage} alt="" />
          ) : (
            <span>{avatarLabel}</span>
          )}
        </div>

        <div className="person-label">
          <p className="person-role">{person.role ?? ''}</p>
          <h2>{person.name}</h2>
        </div>
      </div>

      <div className="person-popover">
        <header className="person-popover-head">
          <div className="person-popover-image" aria-hidden="true">
            {person.avatarImage ? <img src={person.avatarImage} alt="" /> : <span>?</span>}
          </div>
          <div className="person-popover-meta">
            <p className="person-id">{person.id}</p>
            <p className="person-role">{person.role ?? ''}</p>
            <h3>{person.name}</h3>
          </div>
        </header>

        {warnings.length > 0 ? (
          <div className="person-warning-panel" aria-label="Warnings">
            {warnings.map((warning) => (
              <div key={warning} className="person-warning-pill">
                {warning}
              </div>
            ))}
          </div>
        ) : null}

        <dl className="person-facts">
          {person.born ? (
            <div>
              <dt>Born</dt>
              <dd>{person.born}</dd>
            </div>
          ) : null}
          {person.died ? (
            <div>
              <dt>Died</dt>
              <dd>{person.died}</dd>
            </div>
          ) : null}
          {person.location ? (
            <div>
              <dt>Location</dt>
              <dd>{person.location}</dd>
            </div>
          ) : null}
        </dl>

        {person.bio ? <p className="person-bio">{person.bio}</p> : null}

        {aliases.length > 0 ? (
          <div className="person-aliases">
            <span className="person-aliases-label">Aliases</span>
            <div className="person-aliases-list">
              {aliases.map((alias) => (
                <span key={alias} className="person-alias-pill">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {person.socialLinks && Object.keys(person.socialLinks).length > 0 ? (
          <div className="person-aliases">
            <span className="person-aliases-label">Social Links</span>
            <div className="social-links">
              {Object.entries(person.socialLinks).map(([network, href]) => (
                <a key={network} href={href} target="_blank" rel="noreferrer">
                  {network}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <footer className="person-footer">
          {relatedRelations.map((relation, index) => {
            const otherId = relation.from === person.id ? relation.to : relation.from;

            return (
              <div key={`${relation.label}-${index}`} className="relation-chip">
                <span>{relation.label}</span>
                <strong>{otherPersonName(otherId)}</strong>
              </div>
            );
          })}
        </footer>
      </div>
    </article>
  );
}
