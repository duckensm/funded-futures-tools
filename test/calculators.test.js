import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_CALCULATORS,
  calculateDrawdownState,
  calculateFuturesRisk,
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

test('futures risk defaults use a 2000 drawdown cushion and target field', () => {
  assert.deepEqual(DEFAULT_CALCULATORS.nq, {
    market: '20',
    contracts: 2,
    stopPts: 12.5,
    dailyLoss: 1000,
    cushion: 2000,
    target: 3000,
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
  assert.equal(result.pctTarget, 16.666666666666664);
});
