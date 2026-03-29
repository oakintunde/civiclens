function Placeholder({ title }: { title: string }) {
  return (
    <div className="page-content p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h1>
      <p className="text-gray-600">This section is coming soon.</p>
    </div>
  );
}

/** Linked from Home and footer; full comparison UI not built yet. */
export function YearComparison() {
  return <Placeholder title="Year-over-Year Trends" />;
}
