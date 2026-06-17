import { useMemo } from 'react';
import treeData from './family-tree.json';
import { Hero } from './components/Hero';
import { Legend } from './components/Legend';
import { TreeBoard } from './components/TreeBoard';
import type { Person, TreeSettings } from './family/types';

const settings = treeData as TreeSettings;

export default function App() {
  const peopleById = useMemo(
    () => new Map<string, Person>(settings.people.map((person) => [person.id, person])),
    [],
  );

  const openEditRequest = () => {
    window.open(settings.editContact.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="page-shell">
      <Hero title={settings.title} subtitle={settings.subtitle} onEdit={openEditRequest} />
      <Legend />
      <TreeBoard people={settings.people} relations={settings.relations} peopleById={peopleById} />
    </main>
  );
}
