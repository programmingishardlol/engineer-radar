import { describe, expect, it } from "vitest";
import { calculateUpdateScore } from "../src/lib/scoring";

describe("calculateUpdateScore", () => {
  it("applies the MVP weighted scoring formula", () => {
    const result = calculateUpdateScore({
      importance: 5,
      novelty: 4,
      technicalDepth: 3,
      careerRelevance: 4,
      sourceTrust: 5
    });

    expect(result.finalScore).toBe(4.25);
    expect(result.label).toBe("High");
  });

  it("rejects scores outside the 1 to 5 range", () => {
    expect(() =>
      calculateUpdateScore({
        importance: 6,
        novelty: 4,
        technicalDepth: 3,
        careerRelevance: 4,
        sourceTrust: 5
      })
    ).toThrow("Score dimensions must be between 1 and 5");
  });
});
