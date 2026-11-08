// Lets plain `bun` scripts import modules marked `import "server-only"`.
import { mock } from "bun:test";

mock.module("server-only", () => ({}));
