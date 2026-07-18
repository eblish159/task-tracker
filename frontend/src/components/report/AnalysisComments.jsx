import {
  Target,
  Lightbulb,
  CircleCheckBig,
  TriangleAlert,
} from "lucide-react";
import "./AnalysisComments.css";

function AnalysisComments({
  summary,
  timeAnalysis,
  categoryPerformance = [],
  priorityPerformance = [],
}) {
  const comments = createAnalysisComments({
    summary,
    timeAnalysis,
    categoryPerformance,
    priorityPerformance,
  });

  return (
    <section className="analysis-comments">
      <div className="analysis-comments-header">
        <h3>작업 패턴 인사이트</h3>
        <p>선택한 기간의 데이터를 바탕으로 분석한 내용입니다.</p>
      </div>

      <div className="analysis-comments-list">
        {comments.map((comment, index) => {
          const Icon = comment.icon;

          return (
            <article
              className={`analysis-comment-item analysis-${comment.type}`}
              key={`${comment.title}-${index}`}
            >
              <span className="analysis-comment-icon">
                <Icon size={18} />
              </span>

              <div className="analysis-comment-content">
                <strong>{comment.title}</strong>
                <p>{comment.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function createAnalysisComments({
  summary,
  timeAnalysis,
  categoryPerformance,
  priorityPerformance,
}) {
  const comments = [];

  const totalCount = Number(summary?.totalCount ?? 0);
  const doneRate = Number(summary?.doneRate ?? 0);
  const overdueCount = Number(summary?.overdueCount ?? 0);

  const averageCompletionDays = Number(
    timeAnalysis?.averageCompletionDays ?? 0
  );

  const averageDelayDays = Number(
    timeAnalysis?.averageDelayDays ?? 0
  );

  const onTimeRate = Number(
    timeAnalysis?.onTimeRate ?? 0
  );

  const longestTaskTitle =
    timeAnalysis?.longestTaskTitle ?? "-";

  const longestCompletionDays = Number(
    timeAnalysis?.longestCompletionDays ?? 0
  );

  if (totalCount === 0) {
    return [
      {
        type: "empty",
        icon: Lightbulb,
        title: "분석할 작업이 없습니다.",
        description:
          "선택한 기간에 작업이 등록되면 분석 결과가 표시됩니다.",
      },
    ];
  }

  comments.push({
    type: "summary",
    icon: Target,
    title: `전체 ${totalCount}개의 작업을 분석했습니다.`,
    description: `이 기간의 완료율은 ${doneRate.toFixed(1)}%입니다.`,
  });

  if (onTimeRate >= 80) {
    comments.push({
      type: "success",
      icon: CircleCheckBig,
      title: "마감 관리가 안정적입니다.",
      description: `마감 준수율이 ${onTimeRate.toFixed(
        1
      )}%로 높은 편입니다.`,
    });
  } else if (onTimeRate >= 50) {
    comments.push({
      type: "warning",
      icon: TriangleAlert,
      title: "마감 관리에 조금 더 주의가 필요합니다.",
      description: `마감 준수율은 ${onTimeRate.toFixed(
        1
      )}%이며, 평균 지연은 ${averageDelayDays.toFixed(1)}일입니다.`,
    });
  } else {
    comments.push({
      type: "danger",
      icon: TriangleAlert,
      title: "마감 지연 개선이 필요합니다.",
      description: `마감 준수율이 ${onTimeRate.toFixed(
        1
      )}%로 낮고, 지연 작업은 ${overdueCount}개입니다.`,
    });
  }

  comments.push({
    type: "time",
    icon: Lightbulb,
    title: `평균 ${averageCompletionDays.toFixed(
      1
    )}일 만에 작업을 완료했습니다.`,
    description:
      averageDelayDays > 0
        ? `지연된 작업은 평균 ${averageDelayDays.toFixed(
            1
          )}일 늦게 완료됐습니다.`
        : "완료된 작업에서 평균 지연이 발생하지 않았습니다.",
  });

  if (
    longestTaskTitle &&
    longestTaskTitle !== "-" &&
    longestCompletionDays > 0
  ) {
    comments.push({
      type: "longest",
      icon: Target,
      title: "가장 오래 걸린 작업이 있습니다.",
      description: `'${longestTaskTitle}' 작업은 완료까지 ${longestCompletionDays}일이 걸렸습니다.`,
    });
  }

  const bestCategory = findBestCategory(
    categoryPerformance
  );

  if (bestCategory) {
    comments.push({
      type: "category",
      icon: CircleCheckBig,
      title: `${bestCategory.categoryName} 카테고리의 성과가 가장 좋습니다.`,
      description: `완료율은 ${bestCategory.doneRate.toFixed(
        1
      )}%입니다.`,
    });
  }

  const mostCommonPriority = findMostCommonPriority(
    priorityPerformance
  );

  if (mostCommonPriority) {
    comments.push({
      type: "priority",
      icon: Lightbulb,
      title: `${mostCommonPriority.priority} 우선순위 작업이 가장 많습니다.`,
      description: `전체 ${mostCommonPriority.totalCount}개의 작업 중 ${mostCommonPriority.doneCount}개를 완료했습니다.`,
    });
  }

  return comments.slice(0, 4);
}

function findBestCategory(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  let bestCategory = null;

  for (const item of data) {
    const totalCount = Number(item.totalCount ?? 0);
    const doneCount = Number(item.doneCount ?? 0);

    if (totalCount === 0) {
      continue;
    }

    const doneRate = doneCount * 100 / totalCount;

    if (
      bestCategory === null ||
      doneRate > bestCategory.doneRate
    ) {
      bestCategory = {
        categoryName: item.categoryName ?? "미분류",
        doneRate,
      };
    }
  }

  return bestCategory;
}

function findMostCommonPriority(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data.reduce((largest, item) => {
    if (!largest) {
      return item;
    }

    return Number(item.totalCount ?? 0) >
      Number(largest.totalCount ?? 0)
      ? item
      : largest;
  }, null);
}

export default AnalysisComments;