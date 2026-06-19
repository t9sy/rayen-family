import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  createInitialFilterState,
  type FilterOptions,
  type FilterState,
  type MatchMode,
  type PresenceMode,
  type PersonFieldKey,
} from '../family/filtering';

type LegendProps = {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  options: FilterOptions;
  visiblePeopleCount: number;
  visibleRelationsCount: number;
  totalPeopleCount: number;
  totalRelationsCount: number;
};

function updateRecord<T extends string>(record: Record<string, boolean>, key: T, enabled: boolean) {
  return {
    ...record,
    [key]: enabled,
  };
}

function selectAllPresenceFilter(keys: string[], state: boolean) {
  return keys.reduce<Record<string, boolean>>((accumulator, key) => {
    accumulator[key] = state;
    return accumulator;
  }, {});
}

export function Legend({
  filters,
  setFilters,
  options,
  visiblePeopleCount,
  visibleRelationsCount,
  totalPeopleCount,
  totalRelationsCount,
}: LegendProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const updateFilter = (updater: (current: FilterState) => FilterState) => setFilters((current) => updater(current));

  const setKeyword = (value: string) => {
    updateFilter((current) => ({ ...current, keyword: value }));
  };

  const setPersonField = (field: PersonFieldKey, value: string) => {
    updateFilter((current) => ({
      ...current,
      personFields: {
        ...current.personFields,
        [field]: value,
      },
    }));
  };

  const setMatchMode = (value: MatchMode) => {
    updateFilter((current) => ({ ...current, matchMode: value }));
  };

  const setPresenceMode = (key: 'socialPresenceMode' | 'relationPresenceMode', value: PresenceMode) => {
    updateFilter((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="legend legend-with-filters" id="legend-root">
      <article className={`legend-filters${filtersExpanded ? ' is-expanded' : ' is-collapsed'}`}>
        <div className="legend-filters-head">
          <div>
            <span className="legend-kicker">Filter</span>
            <strong>Client-side only</strong>
            <p>
              {visiblePeopleCount} of {totalPeopleCount} people and {visibleRelationsCount} of {totalRelationsCount} links are visible.
            </p>
          </div>
          <div className="filter-toolbar">
            <label className="filter-select">
              <span>Match</span>
              <select value={filters.matchMode} onChange={(event) => setMatchMode(event.target.value as MatchMode)}>
                <option value="all">All</option>
                <option value="any">Any</option>
              </select>
            </label>
            <button
              type="button"
              className="filter-clear"
              onClick={() => setFilters(createInitialFilterState())}
            >
              Reset
            </button>
            <button type="button" className="filter-toggle" onClick={() => setFiltersExpanded((current) => !current)}>
              {filtersExpanded ? 'Collapse' : 'Expand filters'}
            </button>
          </div>
        </div>

        {filtersExpanded ? (
          <>
            <div className="filter-section">
              <div className="filter-section-head">
                <strong>Keyword and fields</strong>
                <span>Text searches stay local to the browser.</span>
              </div>
              <div className="filter-grid filter-grid-text">
                <label>
                  <span>Any keyword</span>
                  <input value={filters.keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search everything" />
                </label>
                {options.personFields.map((field) => (
                  <label key={field.key}>
                    <span>{field.label}</span>
                    <input
                      value={filters.personFields[field.key]}
                      onChange={(event) => setPersonField(field.key, event.target.value)}
                      placeholder={`Search ${field.label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-head">
                <strong>Social links</strong>
                <span>Check a network to keep or exclude people with that profile.</span>
              </div>
              <div className="filter-toolbar">
                <label className="filter-select">
                  <span>Presence</span>
                  <select
                    value={filters.socialPresenceMode}
                    onChange={(event) => setPresenceMode('socialPresenceMode', event.target.value as PresenceMode)}
                  >
                    <option value="present">Has selected</option>
                    <option value="absent">Missing selected</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="filter-clear"
                  onClick={() =>
                    updateFilter((current) => ({
                      ...current,
                      socialFilters: selectAllPresenceFilter(options.socialNetworks, false),
                    }))
                  }
                >
                  Clear
                </button>
              </div>
              <div className="filter-checkbox-grid">
                {options.socialNetworks.map((network) => (
                  <label key={network} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(filters.socialFilters[network])}
                      onChange={(event) =>
                        updateFilter((current) => ({
                          ...current,
                          socialFilters: updateRecord(current.socialFilters, network, event.target.checked),
                        }))
                      }
                    />
                    <span>{network}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-head">
                <strong>Relations</strong>
                <span>These filters also hide people whose links do not match.</span>
              </div>
              <div className="filter-toolbar">
                <label className="filter-select">
                  <span>Presence</span>
                  <select
                    value={filters.relationPresenceMode}
                    onChange={(event) => setPresenceMode('relationPresenceMode', event.target.value as PresenceMode)}
                  >
                    <option value="present">Has selected</option>
                    <option value="absent">Missing selected</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="filter-clear"
                  onClick={() =>
                    updateFilter((current) => ({
                      ...current,
                      relationToneFilters: selectAllPresenceFilter(options.relationTones, false),
                      relationLabelFilters: selectAllPresenceFilter(options.relationLabels, false),
                    }))
                  }
                >
                  Clear
                </button>
              </div>
              <div className="filter-subgrid">
                <div>
                  <span className="filter-subtitle">Tones</span>
                  <div className="filter-checkbox-grid">
                    {options.relationTones.map((tone) => (
                      <label key={tone} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={Boolean(filters.relationToneFilters[tone])}
                          onChange={(event) =>
                            updateFilter((current) => ({
                              ...current,
                              relationToneFilters: updateRecord(current.relationToneFilters, tone, event.target.checked),
                            }))
                          }
                        />
                        <span>{tone}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="filter-subtitle">Labels</span>
                  <div className="filter-checkbox-grid">
                    {options.relationLabels.map((label) => (
                      <label key={label} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={Boolean(filters.relationLabelFilters[label])}
                          onChange={(event) =>
                            updateFilter((current) => ({
                              ...current,
                              relationLabelFilters: updateRecord(current.relationLabelFilters, label, event.target.checked),
                            }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="filter-collapsed-note">Open the filters to search people, networks, and relations.</p>
        )}
      </article>
    </section>
  );
}
