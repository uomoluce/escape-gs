'use client'

import React, { useState, cloneElement } from 'react'
import { X } from 'lucide-react'
import type { Item } from '@/components/CollectionList/types'

interface EventsPageProps {
  children: React.ReactElement<{ items: Item[] }>
}

export function EventsPage({ children }: EventsPageProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Define all possible event types and their labels
  const eventTypeLabels: Record<string, string> = {
    dj_set: 'dj_set',
    live: 'live',
    residency: 'residency',
    n_a: 'n_a',
  }

  // Get unique event types and ensure all types are included
  const eventTypes = Object.entries(eventTypeLabels)

  // Filter children based on selected type
  const filteredChildren = selectedType
    ? cloneElement(children, {
        items: children.props.items.filter((item) => item.eventType === selectedType),
      })
    : children

  return (
    <>
      <div className="flex justify-between py-1">
        {eventTypes.map(([type, label], index) => {
          // Custom opacity values for each type
          const opacityMap: Record<string, number> = {
            n_a: 0.2,
            residency: 0.4,
            live: 1.0,
            dj_set: 1.0,
          }
          const opacity = opacityMap[type] || 0.6
          const isSelected = selectedType === type
          const isLastItem = index === eventTypes.length - 1
          const isNA = type === 'n_a'

          if (isNA) {
            return (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-[var(--accent-color)]"
                  style={{ opacity }}
                />
                <span className="text-[11px] text-[var(--secondary-text)] uppercase">{label}</span>
              </div>
            )
          }

          return (
            <button
              key={type}
              onClick={() => setSelectedType(isSelected ? null : type)}
              className={`flex items-center gap-2 cursor-pointer transition-all group ${
                isSelected
                  ? 'underline underline-offset-4 decoration-[var(--nav-link-active-color)]'
                  : ''
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full bg-[var(--accent-color)] ${
                  type === 'live' ? 'border border-[var(--accent-color)] bg-transparent' : ''
                }`}
                style={{ opacity }}
              />
              <span
                className={`text-[11px] uppercase ${
                  isSelected
                    ? 'text-[var(--nav-link-active-color)]'
                    : 'text-[var(--secondary-text)]'
                }`}
              >
                {label}
              </span>
              {!isLastItem && (
                <span className="w-3 h-3">
                  {isSelected && (
                    <X className="w-3 h-3 text-[var(--nav-link-active-color)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </span>
              )}
              {isLastItem && isSelected && (
                <X className="w-3 h-3 text-[var(--nav-link-active-color)] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          )
        })}
      </div>
      <div className="py-5">{filteredChildren}</div>
    </>
  )
}
