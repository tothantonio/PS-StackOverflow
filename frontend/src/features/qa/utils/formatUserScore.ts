export function formatUserScore(score: number): string {
    if (Number.isInteger(score)) {
        return String(score);
    }
    return score.toFixed(1);
}
