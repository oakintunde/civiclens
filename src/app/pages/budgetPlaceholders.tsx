function Placeholder({ title }: { title: string }) {
  return (
    <div className="page-content p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h1>
      <p className="text-gray-600">This section is coming soon.</p>
    </div>
  );
}

export function FederalBudget() {
  return <Placeholder title="Federal Budget" />;
}

export function ProvincialBudgets() {
  return <Placeholder title="Provincial Budgets" />;
}

export function MunicipalBudgets() {
  return <Placeholder title="Municipal Budgets" />;
}

export function YearComparison() {
  return <Placeholder title="Year-over-Year Trends" />;
}
