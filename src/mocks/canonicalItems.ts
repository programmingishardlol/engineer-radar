import { mockRawItems } from "./rawItems";
import { normalizeRawItems } from "../pipeline/normalize";

export const mockCanonicalItems = normalizeRawItems(mockRawItems);
