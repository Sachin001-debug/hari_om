'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { deleteProperty, fetchAdminProperties } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatLandArea, formatPrice } from '@/lib/formatPrice';

const PAGE_SIZE = 10;
const dateFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? dateFormat.format(date) : '—';
}

function StatusBadge({ status }) {
  const styles = {
    PUBLISHED: 'bg-emerald-50 text-emerald-700',
    DRAFT: 'bg-amber-50 text-amber-700',
    ARCHIVED: 'bg-gray-100 text-gray-600',
  };
  const label = status?.toLowerCase() || 'unknown';
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

function PropertyImage({ property, className }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      {property.image ? (
        <Image
          src={property.image}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center text-[10px] text-admin-muted">No image</div>
      )}
    </div>
  );
}

function DeleteButton({ property, deleting, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(property)}
      disabled={deleting}
      aria-label={`Delete ${property.title}`}
      title="Delete property"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-50"
    >
      {deleting ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Trash2 aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}

export default function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [reload, setReload] = useState(0);
  const debouncedQuery = useDebounce(query.trim(), 250);

  useEffect(() => {
    let active = true;

    fetchAdminProperties({ page, limit: PAGE_SIZE, q: debouncedQuery })
      .then((response) => {
        if (!active) return;
        setProperties(response.properties || []);
        setPagination(response.pagination || { page, limit: PAGE_SIZE, total: 0, totalPages: 0 });
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error.message || 'Unable to load properties.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, debouncedQuery, reload]);

  function updateSearch(event) {
    setQuery(event.target.value);
    setPage(1);
    setLoading(true);
    setLoadError('');
    setDeleteError('');
  }

  function changePage(nextPage) {
    setPage(nextPage);
    setLoading(true);
    setLoadError('');
    setDeleteError('');
  }

  async function handleDelete(property) {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;

    setDeletingId(property.id);
    setDeleteError('');
    try {
      await deleteProperty(property.id);
      if (properties.length === 1 && page > 1) {
        changePage(page - 1);
      } else {
        setLoading(true);
        setReload((count) => count + 1);
      }
    } catch (error) {
      setDeleteError(error.message || 'Unable to delete this property.');
    } finally {
      setDeletingId('');
    }
  }

  const totalPages = Math.max(1, pagination.totalPages);
  const start = pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, pagination.total);

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <header className="flex flex-col gap-3 border-b border-admin-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">Properties</h1>
          <p className="mt-1 text-xs text-admin-muted">Manage published listings, drafts, and archived properties.</p>
        </div>
        <Link
          href="/admin/add-property"
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-admin-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-admin-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 sm:self-auto"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add property
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface shadow-sm">
        <div className="flex flex-col gap-3 border-b border-admin-border p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="relative w-full sm:max-w-sm">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
            <input
              type="search"
              value={query}
              onChange={updateSearch}
              placeholder="Search by title, area, or city"
              aria-label="Search properties"
              className="min-h-10 w-full rounded-lg border border-admin-border bg-white py-2 pl-9 pr-3 text-xs text-admin-text outline-none placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15"
            />
          </div>
          <p className="text-[11px] text-admin-muted" aria-live="polite">
            {loading ? 'Loading listings…' : `${pagination.total} ${pagination.total === 1 ? 'property' : 'properties'}`}
          </p>
        </div>

        {(loadError || deleteError) && (
          <div role="alert" className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-4 py-3 text-xs text-red-800">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{deleteError || loadError}</span>
            {loadError && (
              <button type="button" onClick={() => { setLoadError(''); setLoading(true); setReload((count) => count + 1); }} className="ml-auto shrink-0 font-semibold underline">
                Try again
              </button>
            )}
          </div>
        )}

        {loading && properties.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-xs text-admin-muted">
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            Loading properties…
          </div>
        ) : loadError ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-admin-text">Properties could not be loaded</p>
            <p className="mt-1 text-xs text-admin-muted">Use “Try again” above to retry the request.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-admin-text">{debouncedQuery ? 'No matching properties' : 'No properties yet'}</p>
            <p className="mt-1 text-xs text-admin-muted">{debouncedQuery ? 'Try another title, area, or city.' : 'Add a property to see it listed here.'}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead className="bg-gray-50/80 text-[10px] font-semibold uppercase tracking-wide text-admin-muted">
                  <tr>
                    <th scope="col" className="w-12 px-4 py-3">SN</th>
                    <th scope="col" className="px-3 py-3">Property</th>
                    <th scope="col" className="px-3 py-3">Location</th>
                    <th scope="col" className="px-3 py-3">Price</th>
                    <th scope="col" className="px-3 py-3">Details</th>
                    <th scope="col" className="px-3 py-3">Added</th>
                    <th scope="col" className="px-3 py-3">Status</th>
                    <th scope="col" className="w-14 px-3 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {properties.map((property, index) => (
                    <tr key={property.id} className="text-xs hover:bg-gray-50/60">
                      <td className="px-4 py-3 text-admin-muted">{(page - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-48 items-center gap-3">
                          <PropertyImage property={property} className="h-12 w-16" />
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-medium text-admin-text">{property.title}</p>
                            <p className="mt-1 text-[10px] capitalize text-admin-muted">{property.type === 'house' ? 'House / Villa' : 'Land / Plot'}{property.featured ? ' · Featured' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-admin-text">
                        <span className="block">{property.area}</span>
                        <span className="mt-0.5 block text-[10px] text-admin-muted">{property.city}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-admin-text">
                        {formatPrice(property.price)}
                        {property.priceNegotiable && <span className="mt-0.5 block text-[10px] font-normal text-orange-600">Negotiable</span>}
                      </td>
                      <td className="px-3 py-3 text-admin-muted">
                        <span className="block">{formatLandArea(property.landArea)}</span>
                        {property.type === 'house' && <span className="mt-1 block text-[10px]">{property.bedrooms || '—'} bed · {property.bathrooms || '—'} bath</span>}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-admin-muted">{formatDate(property.createdAt)}</td>
                      <td className="px-3 py-3"><StatusBadge status={property.status} /></td>
                      <td className="px-3 py-3">
                        <DeleteButton property={property} deleting={deletingId === property.id} onDelete={handleDelete} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-admin-border lg:hidden">
              {properties.map((property, index) => (
                <li key={property.id} className="flex items-start gap-3 p-3 sm:p-4">
                  <PropertyImage property={property} className="h-16 w-20 sm:h-20 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs font-semibold text-admin-text">{property.title}</p>
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-admin-muted">
                          <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                          <span className="truncate">{property.area}, {property.city}</span>
                        </p>
                      </div>
                      <DeleteButton property={property} deleting={deletingId === property.id} onDelete={handleDelete} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-admin-muted">
                      <span className="font-semibold text-admin-text">{formatPrice(property.price)}</span>
                      <span>·</span>
                      <span>{formatLandArea(property.landArea)}</span>
                      {property.type === 'house' && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5"><BedDouble aria-hidden="true" className="h-3 w-3" />{property.bedrooms || '—'}</span>
                          <span className="inline-flex items-center gap-0.5"><Bath aria-hidden="true" className="h-3 w-3" />{property.bathrooms || '—'}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={property.status} />
                        <span className="text-[10px] text-admin-muted">#{(page - 1) * PAGE_SIZE + index + 1}</span>
                      </div>
                      <span className="text-[10px] text-admin-muted">{formatDate(property.createdAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <footer className="flex flex-col gap-3 border-t border-admin-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="text-[11px] text-admin-muted">
            Showing {start}–{end} of {pagination.total}
          </p>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => changePage(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Previous
            </button>
            <span className="min-w-20 text-center text-[11px] text-admin-muted">Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => changePage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
