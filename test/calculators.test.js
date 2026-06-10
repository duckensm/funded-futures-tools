import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_CALCULATORS,
  calculateDrawdownState,
  calculateFuturesRisk,
  calculateLossStreakSurvival,
} from '../src/calculatorLogic.js';

test('drawdown simulator defaults match the 50K intraday trailing example', () => {
  assert.deepEqual(DEFAULT_CALCULATORS.drawdown, {
    startBal: 50000,
    currentBal: 50000,
    highBal: 50000,
    ddAmount: 2500,
    ddType: 'trailing',
    consistencyPct: 40,
    totalProfit: 3000,
    bestDay: 0,
  });

  const result = calculateDrawdownState(DEFAULT_CALCULATORS.drawdown);

  assert.equal(result.threshold, 47500);
  assert.equal(result.cushion, 2500);
  assert.equal(result.used, 0);
  assert.equal(result.maxBestDayAllowed, 1200);
  assert.equal(result.currentBestDayPct, 0);
  assert.equal(result.extraProfitNeeded, 0);
  assert.equal(result.consistencyPass, true);
});

test('futures risk defaults show reward-to-risk multiple from target and risk', () => {
  assert.deepEqual(DEFAULT_CALCULATORS.nq, {
    market: '20',
    contracts: 2,
    stopPts: 12.5,
    dailyLoss: 1000,
    cushion: 2000,
    target: 3000,
    spikePts: 12.5,
  });

  const result = calculateFuturesRisk({
    pointValue: 20,
    contracts: 2,
    stopPts: 12.5,
    dailyLoss: 1000,
    cushion: 2000,
    target: 3000,
  });

  assert.equal(result.risk, 500);
  assert.equal(result.pctDaily, 50);
  assert.equal(result.pctCushion, 25);
  assert.equal(result.rewardRisk, 6);
});

test('loss streak survival: static and EOD match during a pure losing streak', () => {
  // 2 NQ contracts, 12.5pt stop -> $500 risk per trade, $2,000 cushion
  const result = calculateLossStreakSurvival({
    pointValue: 20,
    contracts: 2,
    stopPts: 12.5,
    cushion: 2000,
    spikePts: 12.5,
  });

  assert.equal(result.riskPerTrade, 500);
  assert.equal(result.staticTrades, 4);
  assert.equal(result.eodTrades, 4);
  // 12.5pt spike = $500 of cushion consumed by the trailing threshold first
  assert.equal(result.spikeDollars, 500);
  assert.equal(result.intradayTrades, 3);
});

test('loss streak survival clamps at zero and handles zero risk', () => {
  const drained = calculateLossStreakSurvival({
    pointValue: 20,
    contracts: 2,
    stopPts: 12.5,
    cushion: 400,
    spikePts: 50,
  });
  assert.equal(drained.intradayTrades, 0);
  assert.equal(drained.staticTrades, 0);

  const zeroRisk = calculateLossStreakSurvival({
    pointValue: 20,
    contracts: 0,
    stopPts: 12.5,
    cushion: 2000,
    spikePts: 12.5,
  });
  assert.equal(zeroRisk.staticTrades, 0);
  assert.equal(zeroRisk.intradayTrades, 0);
});

test('futures risk reward-to-risk multiple follows target divided by risk', () => {
  const result = calculateFuturesRisk({
    pointValue: 20,
    contracts: 1,
    stopPts: 25,
    dailyLoss: 1000,
    cushion: 2000,
    target: 1000,
  });

  assert.equal(result.risk, 500);
  assert.equal(result.rewardRisk, 2);
});
