# Build verification and workload report

**EA5KAO Ham Exam Prep · Anatol EA5KAO · 2026-10-18**

[Español](VALIDACION.es.md) · [Complete procedures](TECHNICAL-GUIDE.en.md)

## 1. Provenance

- Android build source: `0b43ec7025b6dc325588e02f6f933927776273ef`.
- [Android GitHub Actions run](https://github.com/Brico-Hams/exam/actions/runs/39112076520).
- Public mode excludes optional GLAARG translations and uses application-owned ones.
- Spanish review decisions from the previous commit are preserved.
- [Complete HTTP measurements](results/load-local.json) include asset hashes,
  generator hash, base commit and modified-worktree status.
  Measurement occurred while preparing this documentation:
  `workingTreeDirty=true` is intentional, not a claim of benchmarking a clean commit.

## 2. Executed checks

| Check | Result |
|---|---|
| `npm test` | 147 passing tests, 7 files |
| `npm test -- --mode public` | 147 passing tests, 7 files |
| `npm run lint` | Passed |
| `npm run build:public` | TypeScript and Vite passed |
| GLAARG exclusion | 459 distinctive Extra question strings absent from public JS; public mode eliminates the optional overlay |
| PowerShell helper syntax | Parser reported no errors |
| Local APK preflight without JDK21 | Explicitly rejected as expected |
| HTTP 200 with incorrect HTML body | All seven negative-test requests failed content verification |
| Remote target without explicit authorization flag | Rejected before generating requests |
| Forced 1 ms p95 threshold | Report written and exit code 1, without content errors |
| Invalid CLI arguments | Eight configurations rejected before generating load |
| Public-build browser smoke test | All three US banks and Spain load; SVG available; no horizontal overflow at 390 px |
| Hosted Android build | Passed; APK, debug signature, manifest and assets verified |
| APK download and publication | Local SHA-256 matches GitHub release-asset digest |

The public build contains approximately 2.066 decimal MB of uncompressed JS
and 506 kB gzip according to Vite. The large-bundle warning reflects intentionally
bundled banks, not build failure. Gzip size varies by tool and is not a measurement
of actual hosting traffic.

## 3. Load environment and method

- Windows, Node `v22.23.3`, 12 logical CPUs and 31.64 GiB total memory.
- Generator and Vite preview server share the same machine.
- Local target: `http://127.0.0.1:4183/`, without TLS or WAN.
- Closed-loop model, 30 sessions per stage, concurrency 1/5/20.
- `cold-visit`: five files per session: HTML, CSS, JS and two SVGs.
- `figure-navigation`: two SVGs per session, not complete React navigation.
- 180 synthetic sessions, **630 requests**, **zero HTTP/content errors**.
- Approximately 189.94 MB of verified decompressed bytes overall.
- Every response is SHA-256 compared with the local build.
- Threshold: zero errors and per-stage request p95 <=2,000 ms.

## 4. Measurements

| Profile | Concurrency | Requests | Errors | Request p95 (ms) | Session p95 (ms) | Requests/s |
|---|---:|---:|---:|---:|---:|---:|
| Cold visit | 1 | 150 | 0 | 93.681 | 135.837 | 44.85 |
| Cold visit | 5 | 150 | 0 | 190.527 | 263.916 | 105.13 |
| Cold visit | 20 | 150 | 0 | 762.920 | 997.587 | 113.61 |
| Figures | 1 | 60 | 0 | 9.400 | 15.282 | 185.95 |
| Figures | 5 | 60 | 0 | 25.620 | 50.173 | 373.46 |
| Figures | 20 | 60 | 0 | 46.679 | 85.308 | 523.66 |

All stages pass the local threshold. p95 uses the nearest-rank percentile.
Timing includes body reading and hashing, not just time to first byte.
These are short samples on a shared machine, not prolonged endurance tests.

## 5. What this does not establish

It does not certify 20 simultaneous production learners or a maximum capacity.
It does not measure JS/React, learner-device memory, FPS, WebView, `localStorage`,
real CDN, mobile networks, host compression, TLS, browser-cache behavior or
45-minute sessions. No third-party system was load-tested.
Question selection/scoring have functional tests, not a concurrent-browser load benchmark.

Production acceptance requires repetition against an authorized staging server
with the same build, real-device tests, time-to-interaction and stability measurement.
See technical-guide section 8 for commands and criteria.

## 6. Installation and publication

Local compilation correctly stopped: only Java 8 is installed and no Android SDK
was found. No new tools were installed or new SDK licenses accepted on the owner's
behalf. The build uses the hosted Actions environment.

This delivery's APK is **debug-signed for testing**, not an owner-signed release
or Google Play AAB. Automated checks inspect signature, manifest and packaged
assets; they do not mean the APK was installed or executed on a device.

**Result: successful build and published prerelease.**

- [Download debug APK](https://github.com/Brico-Hams/exam/releases/download/v1.0.0-debug.20261018/EA5KAO-Ham-Exam-1.0.0-debug.apk).
- [Prerelease with checksum and provenance](https://github.com/Brico-Hams/exam/releases/tag/v1.0.0-debug.20261018).
- Size: **5,769,967 bytes**; Android 7+ (`minSdk=24`, `targetSdk=36`).
- Package `com.hamexamprep.app`, Android version `1.0`, `versionCode=1`.
- Built: `2026-10-18T08:46:16.7613489Z`.
- SHA-256:
  `d00432e3d233bd57428298efe98e1e1d410616e0ed3cac7f78b53afec7f10f06`.
- [Machine-readable build evidence](results/android-build.json).

The APK was downloaded from artifact `12131220839`, checked against its
`build-info.json`, then uploaded to the prerelease. GitHub confirmed the same
digest. All **93 packaged web files** were also locally SHA-256 compared with
the downloaded CI `dist/`: every file matches. Compared with the local load-test
build, 91 files are byte-identical; only `index.html` and `manifest.webmanifest`
differ in line endings, without content changes.
Actions artifacts have 30-day retention; prerelease assets do not depend
on that retention. This is a private repository, so downloading requires
repository access. **The APK was not installed or executed on a device or
emulator**, and updating an existing installation was not tested.

GitHub Pages is documented and has a manual deployment workflow; the website
was not enabled or deployed as part of these checks.
