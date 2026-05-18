import Header from './Header';

export default function PageLayout({
  title,
  searchPlaceholder,
  onSearch,
  onAdd,
  addLabel,
  children,
  innerClassName = "",
  titleClassName = "",
  controlsClassName = "justify-between",
  contentClassName = "w-full",
  allowOverflow = false,
}) {
  const role = sessionStorage.getItem("cargo");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className={`flex-1 w-full bg-[#FAFAFA] flex flex-col items-center justify-start ${allowOverflow ? "overflow-auto" : "overflow-hidden"}`}>
        <div className={`w-full max-w-7xl flex-1 min-h-0 flex flex-col mt-5 ${innerClassName}`}>
          <h1 className={`text-4xl font-bold text-[#23272F] mb-6 ${titleClassName}`}>{title}</h1>
          <div className={`flex flex-row items-center mb-4 ${controlsClassName}`}>
            <div className="flex flex-row gap-2 items-center">
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={onSearch}
                className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 w-70"
              />
            </div>
            { (role === "root" || role === "admin") && (
              <button
                className="bg-[#2563EA] hover:bg-[#1E40AF] text-white px-6 py-2 rounded-md font-semibold shadow-md transition-all duration-150"
                onClick={onAdd}
              >
                {addLabel}
              </button>
            )}
          </div>
          <div className={`flex-1 min-h-0 flex flex-col ${allowOverflow ? "overflow-visible" : "overflow-hidden"} ${contentClassName}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
