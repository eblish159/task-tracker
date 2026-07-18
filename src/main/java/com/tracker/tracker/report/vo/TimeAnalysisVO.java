package com.tracker.tracker.report.vo;

public class TimeAnalysisVO {

    private double averageCompletionDays;
    private double averageDelayDays;
    private double onTimeRate;
    private String longestTaskTitle;
    private int longestCompletionDays;

    public double getAverageCompletionDays() {
        return averageCompletionDays;
    }

    public void setAverageCompletionDays(double averageCompletionDays) {
        this.averageCompletionDays = averageCompletionDays;
    }

    public double getAverageDelayDays() {
        return averageDelayDays;
    }

    public void setAverageDelayDays(double averageDelayDays) {
        this.averageDelayDays = averageDelayDays;
    }

    public double getOnTimeRate() {
        return onTimeRate;
    }

    public void setOnTimeRate(double onTimeRate) {
        this.onTimeRate = onTimeRate;
    }

    public String getLongestTaskTitle() {
        return longestTaskTitle;
    }

    public void setLongestTaskTitle(String longestTaskTitle) {
        this.longestTaskTitle = longestTaskTitle;
    }

    public int getLongestCompletionDays() {
        return longestCompletionDays;
    }

    public void setLongestCompletionDays(int longestCompletionDays) {
        this.longestCompletionDays = longestCompletionDays;
    }
}