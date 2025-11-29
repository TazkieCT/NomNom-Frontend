interface StoreMapProps {
  mapsLink?: string
  storeName: string
  address: string
}

export default function StoreMap({ mapsLink, storeName, address }: StoreMapProps) {
  if (!mapsLink) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-600 text-sm">
          Map location not available
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {address}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md">
      <iframe
        src={mapsLink}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map location of ${storeName}`}
        className="w-full"
      />
    </div>
  )
}
