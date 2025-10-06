import { getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const options = await getClarinetVitestsArgv();
(global as any).options = { clarinet: options };
(global as any).simnet = await initSimnet();
(global as any).coverageReports = [];
(global as any).costsReports = [];
