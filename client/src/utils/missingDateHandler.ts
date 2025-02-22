export const fillMissingDates = (data, timeRange, startDate, endDate) => {
  const allDates = new Map();
  const currentDate = new Date(startDate);
  let formattedDate = "";

  while (currentDate <= endDate) {
    if (timeRange === "daily") {
      formattedDate = currentDate.toISOString().split("T")[0];
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (timeRange === "monthly") {
      formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (timeRange === "quarterly") {
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      formattedDate = `${currentDate.getFullYear()}-Q${quarter}`;
      currentDate.setMonth(currentDate.getMonth() + 3);
    } else if (timeRange === "yearly") {
      formattedDate = currentDate.getFullYear().toString();
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    allDates.set(formattedDate, 0);
  }

  data.forEach((entry) => {
    allDates.set(entry.date, entry.totalRevenue);
  });

  return Array.from(allDates, ([date, totalRevenue]) => ({
    date,
    totalRevenue,
  }));
};
