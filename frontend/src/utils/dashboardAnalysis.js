export function getPeriodSummaryLines(data) {
    return [
             `선택 기간의 전체 작업은 ${data.totalCount}건입니다.`,
             `완료된 작업은 ${data.doneCount}건이며 완료율은 ${data.doneRate}%입니다.`,
           ];
         }



export function getDashboardCommentLines(todayTasks, overdueTasks) {
     return [
         todayTasks.length > 0
           ? `오늘 마감 작업이 ${todayTasks.length}건 있습니다.`
           : "오늘 마감 작업은 없습니다.",

         overdueTasks.length > 0
           ? `지연 작업이 ${overdueTasks.length}건 있습니다. 우선 확인이 필요합니다.`
           : "현재 지연 작업은 없습니다.",
       ];
     }