import { useMemo } from "react";

function useSearchSort(data, searchTerm, sortOption, sortDirection, searchFields = []) {
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = data.filter((item) => {
      const term = searchTerm.toLowerCase();
      return searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(term)
      );
    });

    if (sortOption) {
      filtered.sort((a, b) => {
        let valA = a[sortOption];
        let valB = b[sortOption];

        if (sortOption.toLowerCase().includes("date") || sortOption === "dob") {
          valA = new Date(valA);
          valB = new Date(valB);
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortOption, sortDirection, searchFields]);

  return processedData;
}

export default useSearchSort;
