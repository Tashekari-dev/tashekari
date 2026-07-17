export default function SearchBar({
  searchTerm = "",
  selectedCategory = "All",
  categories = [],
  onSearchChange,
  onCategoryChange,
  onClear,
}) {
  const hasFilters =
    searchTerm.trim() !== "" || selectedCategory !== "All";

  return (
    <div className="mt-8 rounded-2xl border border-[#E7D8CA] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Search Products
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              id="product-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by product name or category..."
              className="w-full rounded-xl border border-[#E7D8CA] bg-[#F8F5F1] py-3 pl-11 pr-4 text-sm text-[#6B4F3A] outline-none transition placeholder:text-gray-400 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20"
            />
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Filter by Category
          </label>

          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full cursor-pointer rounded-xl border border-[#E7D8CA] bg-[#F8F5F1] px-4 py-3 text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20"
          >
            <option value="All">All Categories</option>

            {categories
              .filter(Boolean)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-end lg:pt-7">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasFilters}
            className="w-full rounded-xl border border-[#A67C52] px-6 py-3 text-sm font-medium text-[#6B4F3A] transition hover:bg-[#F8F5F1] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent lg:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}