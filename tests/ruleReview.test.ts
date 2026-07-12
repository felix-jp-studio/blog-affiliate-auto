import { describe, expect, it } from "vitest";
import {
  computeCompositeScore,
  decideReview,
  type ReviewInput,
  type ReviewState,
  type RuleMetrics,
  type RuleWeights,
} from "../scripts/lib/ruleReview.js";

const weights: RuleWeights = {
  taskCompletionRate: 0.25,
  docQualityScore: 0.2,
  manualInterventionCount: 0.15,
  pipelineProgress: 0.2,
  agentFollowedRulesRate: 0.2,
};

const baseMetrics: RuleMetrics = {
  taskCompletionRate: 0.9,
  docQualityScore: 5,
  manualInterventionCount: 0,
  pipelineProgress: 8,
  agentFollowedRulesRate: 0.95,
};

describe("computeCompositeScore", () => {
  it("高いメトリクスほど高スコア", () => {
    const high = computeCompositeScore(baseMetrics, weights);
    const low = computeCompositeScore(
      {
        ...baseMetrics,
        taskCompletionRate: 0.3,
        manualInterventionCount: 8,
      },
      weights,
    );
    expect(high).toBeGreaterThan(low);
  });
});

describe("decideReview", () => {
  const input: ReviewInput = {
    weekId: "2026-W29",
    ruleSet: "current",
    metrics: {
      taskCompletionRate: 0.5,
      docQualityScore: 2,
      manualInterventionCount: 5,
      pipelineProgress: 1,
      agentFollowedRulesRate: 0.5,
    },
  };

  it("前週スコアが高い場合は rollback", () => {
    const state: ReviewState = {
      lastReviewWeek: "2026-W28",
      lastDecision: "update",
      activeRuleVersionSha: "abc",
      periods: {
        current: {
          weekId: "2026-W28",
          ruleSet: "current",
          metrics: baseMetrics,
          compositeScore: 90,
        },
        previous: null,
      },
    };

    const result = decideReview(state, input, weights);
    expect(result.decision).toBe("rollback");
    expect(result.currentScore).toBeLessThan(90);
  });

  it("前週スコアが低い場合は update", () => {
    const state: ReviewState = {
      lastReviewWeek: "2026-W28",
      lastDecision: "update",
      activeRuleVersionSha: "abc",
      periods: {
        current: {
          weekId: "2026-W28",
          ruleSet: "current",
          metrics: {
            taskCompletionRate: 0.2,
            docQualityScore: 1,
            manualInterventionCount: 9,
            pipelineProgress: 0,
            agentFollowedRulesRate: 0.2,
          },
          compositeScore: 20,
        },
        previous: null,
      },
    };

    const result = decideReview(state, input, weights);
    expect(result.decision).toBe("update");
    expect(result.currentScore).toBeGreaterThan(20);
  });

  it("同一 weekId は skip", () => {
    const state: ReviewState = {
      lastReviewWeek: "2026-W29",
      lastDecision: "update",
      activeRuleVersionSha: "abc",
      periods: { current: null, previous: null },
    };

    const result = decideReview(state, input, weights);
    expect(result.decision).toBe("skip");
  });
});
