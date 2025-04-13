// utils/dateUtils.js
export const formatDate = (date, format = "DD MMM YYYY") => {
    if (!date) return "";
    
    try {
      const d = new Date(date);
      
      if (isNaN(d.getTime())) {
        return "Invalid date";
      }
      
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.getMonth();
      const year = d.getFullYear();
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      // Replace tokens in format string
      let result = format
        .replace('DD', day)
        .replace('MMM', months[month])
        .replace('YYYY', year.toString());
        
      return result;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error";
    }
  };