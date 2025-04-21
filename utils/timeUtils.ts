// timeUtils.js
export const getPeriodRange = (period) => {
    const now = new Date();
    const start = new Date();
  
    switch (period) {
      case "Today":
        start.setHours(0, 0, 0, 0);
        break;
      case "Yesterday":
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        break;
      case "This Week":
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        break;
      case "Previous Week":
        start.setDate(now.getDate() - now.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        now.setDate(start.getDate() + 6);
        now.setHours(23, 59, 59, 999);
        break;
      case "This Month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case "Previous Month":
        start.setMonth(now.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        now.setMonth(start.getMonth() + 1, 0);
        now.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }
  
    return {
      from: start.toISOString(),
      to: now.toISOString(),
    };
  };