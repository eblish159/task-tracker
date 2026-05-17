export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getQuickRange(days) {
   const end = new Date();
   const start = new Date();

   start.setDate(end.getDate() - (days -1));

   return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        };
   }


   export function getThisMonthRange() {
     const now = new Date();

     const start = new Date(now.getFullYear(), now.getMonth(), 1);
     const end = new Date();

     return {
       startDate: formatDate(start),
       endDate: formatDate(end),
     };
   }

