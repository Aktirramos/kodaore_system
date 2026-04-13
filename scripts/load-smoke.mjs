function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.ceil((p / 100) * sortedValues.length) - 1));
  return sortedValues[index] ?? 0;
}

async function requestOnce(url, timeoutMs) {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    const elapsedMs = performance.now() - startedAt;
    return {
      ok: response.ok,
      status: response.status,
      elapsedMs,
    };
  } catch {
    const elapsedMs = performance.now() - startedAt;
    return {
      ok: false,
      status: 0,
      elapsedMs,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const baseUrl = process.env.LOAD_BASE_URL ?? "http://127.0.0.1:3000";
  const durationSeconds = parsePositiveInt(process.env.LOAD_DURATION_SECONDS, 30);
  const concurrency = parsePositiveInt(process.env.LOAD_CONCURRENCY, 8);
  const timeoutMs = parsePositiveInt(process.env.LOAD_TIMEOUT_MS, 8000);
  const maxErrorRatePercent = parsePositiveInt(process.env.LOAD_MAX_ERROR_RATE_PERCENT, 2);

  const targets = ["/api/health", "/eu", "/eu/acceso"];
  const deadline = Date.now() + durationSeconds * 1000;

  const latencies = [];
  let totalRequests = 0;
  let failedRequests = 0;

  async function worker(workerId) {
    let targetIndex = workerId % targets.length;

    while (Date.now() < deadline) {
      const target = targets[targetIndex] ?? targets[0];
      targetIndex = (targetIndex + 1) % targets.length;

      const url = `${baseUrl}${target}`;
      const result = await requestOnce(url, timeoutMs);

      totalRequests += 1;
      latencies.push(result.elapsedMs);

      if (!result.ok) {
        failedRequests += 1;
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i)));

  latencies.sort((a, b) => a - b);

  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);
  const avg = latencies.length > 0 ? latencies.reduce((sum, value) => sum + value, 0) / latencies.length : 0;
  const errorRatePercent = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 100;

  console.log("Load smoke report", {
    baseUrl,
    durationSeconds,
    concurrency,
    timeoutMs,
    totalRequests,
    failedRequests,
    errorRatePercent: Number(errorRatePercent.toFixed(2)),
    avgLatencyMs: Number(avg.toFixed(2)),
    p50LatencyMs: Number(p50.toFixed(2)),
    p95LatencyMs: Number(p95.toFixed(2)),
    p99LatencyMs: Number(p99.toFixed(2)),
  });

  if (errorRatePercent > maxErrorRatePercent) {
    console.error(`Load smoke failed: error rate ${errorRatePercent.toFixed(2)}% > ${maxErrorRatePercent}%`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Load smoke failed", error);
  process.exitCode = 1;
});
