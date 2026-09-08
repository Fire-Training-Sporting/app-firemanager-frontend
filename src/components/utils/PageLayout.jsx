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
  customControls = null,
  showSearch = true,
  showAddButton = true,
}) {
  const role = sessionStorage.getItem("cargo");

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 w-full bg-[#FAFAFA] flex flex-col items-center justify-start overflow-auto">
        <div className={`w-full max-w-7xl flex-1 min-h-0 flex flex-col mt-5 px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
          <h1 className={`text-3xl sm:text-4xl font-bold text-[#23272F] mb-5 sm:mb-6 ${titleClassName}`}>{title}</h1>
          <div className={`flex flex-col gap-3 mb-4 lg:flex-row lg:items-center ${controlsClassName}`}>
            {customControls ? (
              <div className="w-full min-w-0 sm:flex-1">{customControls}</div>
            ) : showSearch ? (
              <div className="flex w-full flex-row gap-2 items-center lg:w-auto">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={onSearch}
                  className="w-full lg:w-70 border border-gray-300 rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ) : (
              <div className="flex-1" />
            )}
            {showAddButton && (role === "root" || role === "Administracao") && (
              <button
                className="w-full lg:w-auto bg-[#2563EA] hover:bg-[#1E40AF] text-white px-6 py-2 rounded-md font-semibold shadow-md transition-all duration-150"
                onClick={onAdd}
              >
                {addLabel}
              </button>
            )}
          </div>
          <div className={`flex-1 min-h-0 flex flex-col overflow-visible ${contentClassName}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
