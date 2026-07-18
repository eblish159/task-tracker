package com.tracker.tracker.report.vo;

public class PriorityPerformanceVO {

    private String priority;
    private int totalCount;
    private int doneCount;

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getDoneCount() {
        return doneCount;
    }

    public void setDoneCount(int doneCount) {
        this.doneCount = doneCount;
    }
}