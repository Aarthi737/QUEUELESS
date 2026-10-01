import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { SearchBar } from '../components/SearchBar';
import { FilterButton } from '../components/FilterButton';
import { ServiceCard } from '../components/ServiceCard';
import { EmptyState } from '../components/EmptyState';
import { serviceCategories } from '../data/services';
import { SearchX, Building2 } from 'lucide-react';

export const FindQueuePage = () => {
  const { services } = useQueue();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter services by search text and category
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.department.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.location.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [services, searchQuery, selectedCategory]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Find a Queue
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Select any department or facility to check live wait times and issue your digital token.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search hospitals, banks or services..."
          />
        </div>

        <div className="category-filters-container">
          {serviceCategories.map((cat) => {
            const count =
              cat === 'All'
                ? services.length
                : services.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length;

            return (
              <FilterButton
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                count={count}
              />
            );
          })}
        </div>
      </div>

      {/* Service Cards Grid */}
      {filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchX size={32} />}
          title="No services found"
          description={`No active service matched "${searchQuery}". Try changing your search query or filter category.`}
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
};
