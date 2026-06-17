import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Person, Relation } from '../family/types';
import { PersonCard } from './PersonCard';

type TreeBoardProps = {
  people: Person[];
  relations: Relation[];
  peopleById: Map<string, Person>;
};

type ConnectorLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  tone: 'family' | 'romance' | 'legal' | 'custom';
};

function formatRelationTone(tone?: Relation['tone']): ConnectorLine['tone'] {
  switch (tone) {
    case 'romance':
      return 'romance';
    case 'legal':
      return 'legal';
    case 'custom':
      return 'custom';
    default:
      return 'family';
  }
}

export function TreeBoard({ people, relations, peopleById }: TreeBoardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const [connectorLines, setConnectorLines] = useState<ConnectorLine[]>([]);

  const generations = useMemo(() => {
    const grouped = new Map<number, Person[]>();
    for (const person of people) {
      const bucket = grouped.get(person.generation) ?? [];
      bucket.push(person);
      grouped.set(person.generation, bucket);
    }

    return [...grouped.entries()]
      .sort(([left], [right]) => left - right)
      .map(([generation, generationPeople]) => ({
        generation,
        people: [...generationPeople].sort((left, right) => left.order - right.order),
      }));
  }, [people]);

  useLayoutEffect(() => {
    const updateLines = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const containerBox = container.getBoundingClientRect();
      const nextLines = relations.flatMap((relation, index) => {
        const fromCard = cardRefs.current.get(relation.from);
        const toCard = cardRefs.current.get(relation.to);

        if (!fromCard || !toCard) {
          return [];
        }

        const fromBox = fromCard.getBoundingClientRect();
        const toBox = toCard.getBoundingClientRect();

        return [
          {
            id: `${relation.from}-${relation.to}-${index}`,
            x1: fromBox.left - containerBox.left + fromBox.width / 2,
            y1: fromBox.top - containerBox.top + fromBox.height / 2,
            x2: toBox.left - containerBox.left + toBox.width / 2,
            y2: toBox.top - containerBox.top + toBox.height / 2,
            label: relation.label,
            tone: formatRelationTone(relation.tone),
          },
        ];
      });

      setConnectorLines(nextLines);
    };

    updateLines();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateLines);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    for (const node of cardRefs.current.values()) {
      resizeObserver.observe(node);
    }

    window.addEventListener('resize', updateLines);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateLines);
    };
  }, [relations]);

  const relatedRelations = (personId: string) =>
    relations.filter((relation) => relation.from === personId || relation.to === personId);

  const setCardRef = (personId: string, node: HTMLElement | null) => {
    if (node) {
      cardRefs.current.set(personId, node);
    } else {
      cardRefs.current.delete(personId);
    }
  };

  return (
    <section className="tree-board" ref={containerRef}>
      <svg className="connector-layer" aria-hidden="true">
        {connectorLines.map((line) => (
          <g key={line.id} className={`connector connector-${line.tone}`}>
            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
            <text x={(line.x1 + line.x2) / 2} y={(line.y1 + line.y2) / 2 - 8}>
              {line.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="generation-stack">
        {generations.map((group) => (
          <section key={group.generation} className="generation-row">
            <div className="generation-label">Generation {group.generation}</div>
            <div className="generation-grid">
              {group.people.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  relatedRelations={relatedRelations(person.id)}
                  otherPersonName={(personId) => peopleById.get(personId)?.name ?? personId}
                  setCardRef={setCardRef}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
