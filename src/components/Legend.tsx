export function Legend() {
  return (
    <section className="legend">
      <article>
        <span className="legend-kicker">Data source</span>
        <strong>Single JSON file</strong>
        <p>All names, links, avatar URLs, and relation types come from one JSON file.</p>
      </article>
      <article>
        <span className="legend-kicker">Editing</span>
        <strong>Locked UI</strong>
        <p>The tree is read only. Requests route through Discord instead of an editor.</p>
      </article>
      <article>
        <span className="legend-kicker">Connections</span>
        <strong>Hover-driven records</strong>
        <p>The visible node stays minimal. Details expand only when you hover or focus a person.</p>
      </article>
    </section>
  );
}
