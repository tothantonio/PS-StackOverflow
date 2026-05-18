package com.stackoverflow.backend.dto;

public class VoteResponse {
    private int voteCount;
    private double authorScore;
    private Double voterScore;

    public VoteResponse() {
    }

    public VoteResponse(int voteCount, double authorScore, Double voterScore) {
        this.voteCount = voteCount;
        this.authorScore = authorScore;
        this.voterScore = voterScore;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public double getAuthorScore() {
        return authorScore;
    }

    public void setAuthorScore(double authorScore) {
        this.authorScore = authorScore;
    }

    public Double getVoterScore() {
        return voterScore;
    }

    public void setVoterScore(Double voterScore) {
        this.voterScore = voterScore;
    }
}
