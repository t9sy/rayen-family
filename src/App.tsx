import { useMemo, useState } from 'react';
import treeData from './family-tree.json';
import { Hero } from './components/Hero';
import { Legend } from './components/Legend';
import { TreeBoard } from './components/TreeBoard';
import { buildFilterOptions, createInitialFilterState, filterPeople, filterRelations } from './family/filtering';
import type { Person, TreeSettings } from './family/types';

const settings = treeData as TreeSettings;

export default function App() {
  const peopleById = useMemo(
    () => new Map<string, Person>(settings.people.map((person) => [person.id, person])),
    [],
  );
  const [filters, setFilters] = useState(createInitialFilterState);
  const filterOptions = useMemo(() => buildFilterOptions(settings.people, settings.relations), []);
  const visiblePeople = useMemo(
    () => filterPeople(settings.people, settings.relations, filters),
    [filters],
  );
  const visibleRelations = useMemo(
    () => filterRelations(settings.relations, visiblePeople, filters),
    [filters, visiblePeople],
  );

  const openEditDiscordRequest = () => {
    window.open(settings.editContact.href, '_blank', 'noopener,noreferrer');
  };

  const openEditMailRequest = () => {
    window.open(`mailto:${settings.editContact.mail}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="page-shell">
      <Hero
        title={settings.title}
        subtitle={settings.subtitle}
        onEditDiscord={openEditDiscordRequest}
        onEditMail={openEditMailRequest}
      />
      <Legend
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        visiblePeopleCount={visiblePeople.length}
        visibleRelationsCount={visibleRelations.length}
        totalPeopleCount={settings.people.length}
        totalRelationsCount={settings.relations.length}
      />
      <TreeBoard people={visiblePeople} relations={visibleRelations} peopleById={peopleById} />
    </main>
  );
}
