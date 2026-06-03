export const DEFAULT_CALCULATORS = {
  drawdown: {
    startBal: 50000,
    currentBal: 50000,
    highBal: 50000,
    ddAmount: 2500,
    ddType: 'trailing',
    consistencyPct: 40,
    totalProfit: 3000,
    bestDay: 0,
  },
  nq: {
    market: '20',
    contracts: 2,
    stopPts: 12.5,
    dailyLoss: 1000,
    cushion: 2000,
    target: 3000,
  },
  planner: {
    profitTarget: 3000,
    days: 10,
    maxDailyLoss: 1000,
    riskTrade: 250,
  },
};

function boundedPercent(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

export function calculateDrawdownState({
  startBal,
  currentBal,
  highBal,
  ddAmount,
  ddType,
  consistencyPct,
  totalProfit,
  bestDay,
}) {
  const safeDd = Math.max(0, ddAmount);
  const safeConsistencyPct = Math.max(1, Math.min(100, consistencyPct));
  const safeTotalProfit = Math.max(0, totalProfit);
  const safeBestDay = Math.max(0, bestDay);
  const threshold = ddType === 'static' ? startBal - safeDd : highBal - safeDd;
  const cushion = currentBal - threshold;
  const used = Math.max(0, Math.min(100, safeDd > 0 ? (1 - cushion / safeDd) * 100 : 0));
  const maxBestDayAllowed = safeTotalProfit * (safeConsistencyPct / 100);
  const currentBestDayPct = boundedPercent(safeBestDay, safeTotalProfit);
  const extraProfitNeeded = Math.max(0, safeBestDay / (safeConsistencyPct / 100) - safeTotalProfit);
  const consistencyPass = safeBestDay <= maxBestDayAllowed && safeTotalProfit > 0;

  return {
    threshold,
    cushion,
    used,
    maxBestDayAllowed,
    currentBestDayPct,
    extraProfitNeeded,
    consistencyPass,
    consistencyPct: safeConsistencyPct,
  };
}

export function calculateFuturesRisk({
  pointValue,
  contracts,
  stopPts,
  dailyLoss,
  cushion,
  target,
}) {
  const risk = pointValue * contracts * stopPts;
  return {
    risk,
    pctDaily: boundedPercent(risk, dailyLoss),
    pctCushion: boundedPercent(risk, cushion),
    pctTarget: boundedPercent(risk, target),
  };
}
