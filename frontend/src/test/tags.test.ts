import { describe, expect, test } from "vitest";
import { formatTags, parseTags } from "../services/tagUtils.ts";

describe("tag helpers", () => {
    test("parses comma separated tags", () => {
        expect(parseTags("react, frontend, typescript")).toEqual(["react", "frontend", "typescript"]);
    });

    test("ignores empty tag values", () => {
        expect(parseTags("react, , frontend,")).toEqual(["react", "frontend"]);
    });

    test("formats tags for the form state", () => {
        expect(formatTags(["react", "testing"])).toBe("react, testing");
    });
});
