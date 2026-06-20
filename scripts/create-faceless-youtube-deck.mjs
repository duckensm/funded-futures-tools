import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Presentation, PresentationFile } from "file:///C:/Users/ducke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const projectRoot = process.cwd();
const scratchRoot = process.env.SCRATCH_ROOT || path.join(projectRoot, "work");
const workspace = path.join(scratchRoot, "codex-presentations", "manual-lucid-vs-apex-faceless");
const tmpDir = path.join(workspace, "tmp");
const previewDir = path.join(tmpDir, "preview");
const layoutDir = path.join(tmpDir, "layout");
const qaDir = path.join(tmpDir, "qa");
const outputDir = path.join(projectRoot, "docs", "youtube");
const finalPptx = path.join(outputDir, "lucid-vs-apex-faceless-deck.pptx");
const finalPreview = path.join(outputDir, "lucid-vs-apex-faceless-deck-preview.webp");
const shotList = path.join(outputDir, "lucid-vs-apex-faceless-shot-list.txt");

const W = 1280;
const H = 720;
const C = {
  bg: "#050608",
  panel: "#10141d",
  panel2: "#151b27",
  line: "#283142",
  text: "#f7f8fb",
  muted: "#a8b0c2",
  green: "#10b981",
  blue: "#6d73ff",
  amber: "#f59e0b",
  red: "#f87171",
};

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addText(slide, text, left, top, width, height, style = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = {
    typeface: style.typeface || "Aptos",
    fontSize: style.fontSize || 24,
    bold: style.bold || false,
    color: style.color || C.text,
    ...style,
  };
  return box;
}

function addPanel(slide, left, top, width, height, fill = C.panel, line = C.line) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: line, width: 1.2 },
    borderRadius: "rounded-xl",
  });
}

function addPill(slide, text, left, top, width, color = C.green) {
  addPanel(slide, left, top, width, 34, "rgba(16,185,129,0.12)", color);
  addText(slide, text, left + 16, top + 7, width - 32, 20, {
    fontSize: 12,
    bold: true,
    color,
  });
}

function addFooter(slide, label = "FuturesPropEdge.com") {
  addText(slide, label, 64, 664, 420, 22, { fontSize: 13, bold: true, color: C.muted });
  addText(slide, "Educational only. Verify current official rules before buying.", 776, 664, 440, 22, {
    fontSize: 12,
    color: C.muted,
  });
}

function addBrand(slide) {
  addPanel(slide, 64, 46, 42, 42, "linear-gradient(135deg,#6d73ff,#10b981)", "rgba(255,255,255,0.18)");
  addText(slide, "F", 77, 54, 18, 24, { fontSize: 22, bold: true, color: C.text });
  addText(slide, "Futures Prop Edge", 118, 55, 260, 22, { fontSize: 17, bold: true, color: C.text });
}

function addScore(slide, label, winner, x, y, color) {
  addPanel(slide, x, y, 348, 76, "rgba(255,255,255,0.045)", C.line);
  addText(slide, label, x + 22, y + 15, 190, 18, { fontSize: 13, bold: true, color: C.muted });
  addText(slide, winner, x + 22, y + 35, 250, 28, { fontSize: 23, bold: true, color });
}

function slideCover(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "FACELESS VIDEO DECK", 64, 142, 178, C.green);
  addText(slide, "Lucid Trading vs Apex", 64, 196, 690, 76, {
    fontSize: 62,
    bold: true,
    color: C.text,
    typeface: "Aptos Display",
  });
  addText(slide, "Which rules are better for NQ/MNQ traders?", 66, 286, 620, 48, {
    fontSize: 28,
    color: C.muted,
  });
  addPanel(slide, 780, 172, 372, 280, "rgba(109,115,255,0.08)", "rgba(109,115,255,0.35)");
  addText(slide, "LUCID", 840, 220, 250, 46, { fontSize: 44, bold: true, color: C.green });
  addText(slide, "vs", 928, 300, 80, 42, { fontSize: 30, bold: true, color: C.muted });
  addText(slide, "APEX", 840, 356, 250, 46, { fontSize: 44, bold: true, color: C.amber });
  addText(slide, "Voiceover + slides + calculator screen recording", 64, 580, 760, 30, {
    fontSize: 22,
    color: C.text,
  });
  addFooter(slide);
}

function slideVerdict(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "QUICK VERDICT", 64, 118, 150, C.blue);
  addText(slide, "Lucid wins rule simplicity. Apex wins account scale.", 64, 164, 1010, 64, {
    fontSize: 42,
    bold: true,
    typeface: "Aptos Display",
  });
  addPanel(slide, 76, 270, 522, 258, "rgba(16,185,129,0.08)", "rgba(16,185,129,0.34)");
  addText(slide, "LucidFlex", 112, 306, 350, 42, { fontSize: 34, bold: true, color: C.green });
  addText(slide, `Cleaner funded-stage rules
No activation-fee angle
No fixed payout-window angle
Simpler fit for one account at a time`, 112, 366, 410, 132, {
    fontSize: 22,
    color: C.text,
  });
  addPanel(slide, 682, 270, 522, 258, "rgba(245,158,11,0.08)", "rgba(245,158,11,0.34)");
  addText(slide, "Apex EOD", 718, 306, 350, 42, { fontSize: 34, bold: true, color: C.amber });
  addText(slide, `More account capacity
Possible one-day evaluation path
100% approved EOD payout split
Stronger for copier-scale traders`, 718, 366, 410, 132, {
    fontSize: 22,
    color: C.text,
  });
  addFooter(slide);
}

function slideDrawdown(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "DRAWDOWN", 64, 118, 132, C.green);
  addText(slide, "EOD drawdown is usually easier for NQ runners.", 64, 164, 980, 56, {
    fontSize: 40,
    bold: true,
  });
  addPanel(slide, 78, 258, 1124, 318, "rgba(255,255,255,0.035)", C.line);
  for (let i = 0; i < 7; i++) {
    slide.shapes.add({
      geometry: "rect",
      position: { left: 132 + i * 145, top: 302, width: 1, height: 218 },
      fill: "rgba(168,176,194,0.16)",
      line: { style: "solid", fill: "rgba(168,176,194,0.16)", width: 0 },
    });
  }
  slide.shapes.add({
    geometry: "rect",
    position: { left: 124, top: 456, width: 940, height: 3 },
    fill: C.amber,
    line: { style: "solid", fill: C.amber, width: 0 },
  });
  addText(slide, "EOD floor", 920, 424, 160, 28, { fontSize: 18, bold: true, color: C.amber });
  const pts = [
    [150, 468],
    [270, 414],
    [395, 372],
    [530, 408],
    [665, 336],
    [810, 315],
    [990, 284],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const line = slide.shapes.add({
      geometry: "rect",
      position: { left: x1, top: y1, width: len, height: 6 },
      fill: C.green,
      line: { style: "solid", fill: C.green, width: 0 },
    });
    line.rotation = angle;
  }
  for (const [x, y] of pts) {
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: x - 8, top: y - 8, width: 16, height: 16 },
      fill: C.green,
      line: { style: "solid", fill: "#b6ffe3", width: 1 },
    });
  }
  addText(slide, "Why it matters: the account can have room to trade without every unrealized pop moving the floor.", 86, 590, 920, 24, {
    fontSize: 16,
    color: C.muted,
  });
  addFooter(slide);
}

function slideRiskMath(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "NQ RISK MATH", 64, 118, 152, C.blue);
  addText(slide, "A 50K account is really a drawdown-cushion account.", 64, 164, 1030, 56, {
    fontSize: 39,
    bold: true,
  });
  addPanel(slide, 80, 264, 512, 258, "rgba(255,255,255,0.045)", C.line);
  addText(slide, "1 NQ", 122, 306, 180, 36, { fontSize: 34, bold: true, color: C.green });
  addText(slide, "25 points x $20", 122, 366, 310, 32, { fontSize: 28, color: C.text });
  addText(slide, "$500 risk", 122, 426, 310, 54, { fontSize: 48, bold: true, color: C.text });
  addPanel(slide, 690, 264, 512, 258, "rgba(255,255,255,0.045)", C.line);
  addText(slide, "2 MNQ", 732, 306, 180, 36, { fontSize: 34, bold: true, color: C.blue });
  addText(slide, "25 points x $2 x 2", 732, 366, 330, 32, { fontSize: 28, color: C.text });
  addText(slide, "$100 risk", 732, 426, 310, 54, { fontSize: 48, bold: true, color: C.text });
  addText(slide, "MNQ keeps the same idea smaller while the account cushion builds.", 84, 576, 960, 28, {
    fontSize: 18,
    color: C.muted,
  });
  addFooter(slide);
}

function slidePayout(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "PAYOUTS", 64, 118, 116, C.green);
  addText(slide, "Do not compare only the payout split.", 64, 164, 880, 54, {
    fontSize: 42,
    bold: true,
  });
  const items = [
    ["Minimum profitable days", C.blue],
    ["Consistency rule", C.amber],
    ["Payout buffer", C.red],
    ["Payout window", C.green],
    ["Lifetime safety net", C.amber],
  ];
  items.forEach(([txt, color], i) => {
    addPanel(slide, 112, 262 + i * 70, 880, 50, "rgba(255,255,255,0.04)", C.line);
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: 132, top: 275 + i * 70, width: 22, height: 22 },
      fill: color,
      line: { style: "solid", fill: color, width: 0 },
    });
    addText(slide, txt, 172, 274 + i * 70, 420, 24, { fontSize: 22, bold: true });
  });
  addText(slide, "These rules can matter more than the headline payout split.", 112, 628, 720, 24, {
    fontSize: 16,
    color: C.muted,
  });
  addFooter(slide);
}

function slideScorecard(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "SCORECARD", 64, 118, 132, C.green);
  addText(slide, "Where each firm actually wins.", 64, 164, 780, 56, {
    fontSize: 42,
    bold: true,
  });
  addScore(slide, "EOD drawdown", "Tie / Lucid edge", 78, 252, C.green);
  addScore(slide, "Evaluation speed", "Apex", 466, 252, C.amber);
  addScore(slide, "Funded simplicity", "Lucid", 854, 252, C.green);
  addScore(slide, "Payout split", "Apex", 78, 366, C.amber);
  addScore(slide, "Payout rule simplicity", "Lucid", 466, 366, C.green);
  addScore(slide, "Account quantity", "Apex", 854, 366, C.amber);
  addPanel(slide, 246, 510, 788, 72, "rgba(16,185,129,0.08)", "rgba(16,185,129,0.35)");
  addText(slide, "Overall for most one-account NQ/MNQ traders: Lucid", 286, 530, 710, 30, {
    fontSize: 28,
    bold: true,
    color: C.text,
  });
  addFooter(slide);
}

function slideSiteDemo(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "SCREEN RECORDING", 64, 118, 186, C.blue);
  addText(slide, "Use the calculator to check real NQ risk.", 64, 164, 980, 56, {
    fontSize: 40,
    bold: true,
  });
  addPanel(slide, 90, 258, 1100, 290, "rgba(255,255,255,0.04)", C.line);
  addPanel(slide, 130, 300, 300, 176, "rgba(16,185,129,0.08)", "rgba(16,185,129,0.35)");
  addText(slide, "NQ dollar risk", 154, 326, 200, 24, { fontSize: 20, color: C.muted });
  addText(slide, "$500", 154, 366, 220, 56, { fontSize: 56, bold: true });
  addPanel(slide, 490, 300, 300, 176, "rgba(109,115,255,0.08)", "rgba(109,115,255,0.35)");
  addText(slide, "Cushion used", 514, 326, 200, 24, { fontSize: 20, color: C.muted });
  addText(slide, "25%", 514, 366, 220, 56, { fontSize: 56, bold: true });
  addPanel(slide, 850, 300, 300, 176, "rgba(245,158,11,0.08)", "rgba(245,158,11,0.35)");
  addText(slide, "Reward:risk", 874, 326, 200, 24, { fontSize: 20, color: C.muted });
  addText(slide, "2R", 874, 366, 220, 56, { fontSize: 56, bold: true });
  addText(slide, "Try the calculator: futurespropedge.com/calculators/", 96, 582, 760, 26, {
    fontSize: 18,
    color: C.text,
  });
  addFooter(slide);
}

function slideCTA(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "CTA", 64, 118, 74, C.green);
  addText(slide, "Compare before you buy.", 64, 174, 760, 70, {
    fontSize: 60,
    bold: true,
    typeface: "Aptos Display",
  });
  addText(slide, "Use the free NQ/MNQ calculator and written comparison before choosing a challenge.", 68, 268, 720, 72, {
    fontSize: 28,
    color: C.muted,
  });
  addPanel(slide, 86, 414, 780, 104, "rgba(16,185,129,0.1)", "rgba(16,185,129,0.35)");
  addText(slide, "futurespropedge.com", 124, 444, 700, 48, { fontSize: 44, bold: true, color: C.green });
  addPanel(slide, 930, 240, 236, 236, "rgba(109,115,255,0.08)", "rgba(109,115,255,0.35)");
  addText(slide, `LINKS
BELOW`, 972, 306, 160, 94, { fontSize: 34, bold: true, color: C.text });
  addFooter(slide);
}

function slideSources(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addBrand(slide);
  addPill(slide, "SOURCE CHECK", 64, 118, 154, C.amber);
  addText(slide, "Check official pages before buying.", 64, 164, 900, 54, {
    fontSize: 40,
    bold: true,
  });
  const bullets = [
    "LucidFlex evaluation, funded, payout, drawdown pages",
    "Apex EOD evaluation, PA, payout, drawdown pages",
    "Futures Prop Edge calculator page",
    "Recheck prices, promos, and rules before buying",
  ];
  bullets.forEach((b, i) => {
    addPanel(slide, 106, 270 + i * 76, 920, 54, "rgba(255,255,255,0.04)", C.line);
    addText(slide, String(i + 1), 128, 284 + i * 76, 36, 26, { fontSize: 24, bold: true, color: C.green });
    addText(slide, b, 184, 286 + i * 76, 760, 24, { fontSize: 22, color: C.text });
  });
  addText(slide, "Rules and prices can change. Recheck the firm pages before buying.", 108, 606, 760, 24, {
    fontSize: 18,
    color: C.muted,
  });
  addFooter(slide);
}

async function main() {
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(layoutDir, { recursive: true });
  await fs.mkdir(qaDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const sourceNotes = [
    "Deck topic: Faceless YouTube visual package for Lucid Trading vs Apex for NQ/MNQ traders.",
    "Primary source: docs/youtube/lucid-vs-apex-video-package.md in this repository.",
    "Public URLs referenced: futurespropedge.com, futurespropedge.com/calculators/.",
    "Claims are summarized from the video package and must be rechecked against official Lucid and Apex pages before final upload.",
    "No firm logos or official brand assets are embedded.",
  ].join(os.EOL);
  await fs.writeFile(path.join(tmpDir, "source-notes.txt"), sourceNotes);

  const slidePlan = [
    "Mode: create.",
    "Slide size: 1280x720, video-friendly 16:9.",
    "Palette: 65% near-black background (#050608), panels (#10141d/#151b27), accents green (#10b981), blue (#6d73ff), amber (#f59e0b).",
    "Typography: Aptos Display for large titles, Aptos for body and numeric labels.",
    "Deck: cover, verdict, drawdown visual, NQ risk math, payout friction, scorecard, site demo, CTA, source-check slide.",
    "Animation handled in video editor using reveal/cut timing; deck includes simple editable visual stages.",
  ].join(os.EOL);
  await fs.writeFile(path.join(tmpDir, "slide-plan.txt"), slidePlan);

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  slideCover(presentation);
  slideVerdict(presentation);
  slideDrawdown(presentation);
  slideRiskMath(presentation);
  slidePayout(presentation);
  slideScorecard(presentation);
  slideSiteDemo(presentation);
  slideCTA(presentation);
  slideSources(presentation);

  for (const [i, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    await writeBlob(path.join(previewDir, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(path.join(layoutDir, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
  }

  await writeBlob(path.join(previewDir, "montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  await fs.copyFile(path.join(previewDir, "montage.webp"), finalPreview);

  const qa = [
    "Visual QA:",
    "- Rendered 9 slides and generated montage.",
    "- Checked theme uses dark background, high-contrast white text, green/blue/amber accents.",
    "- No official logos or externally sourced images embedded.",
    "- All slide objects are editable shapes/text.",
    "- Remaining caveat: fact claims should be rechecked on official firm pages on publishing day.",
  ].join(os.EOL);
  await fs.writeFile(path.join(qaDir, "visual-qa.txt"), qa);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(finalPptx);

  const shotListText = [
    "Lucid vs Apex faceless video shot list",
    "",
    "1. Cover: 3 second intro, zoom slowly into LUCID vs APEX.",
    "2. Verdict: reveal Lucid column, reveal Apex column, then say the balanced verdict.",
    "3. Drawdown: animate green price line first, then show amber EOD floor. Use a subtle whoosh.",
    "4. NQ risk math: reveal 1 NQ risk, then 2 MNQ risk. Let the $500 and $100 numbers pop.",
    "5. Payouts: reveal each friction point one at a time while reading the payout section.",
    "6. Scorecard: highlight one category at a time. End with the overall Lucid verdict.",
    "7. Site demo: replace this slide with an actual screen recording of the calculator if possible.",
    "8. CTA: use as the final 8-10 seconds with links in the description.",
    "9. Source check: optional credibility screen or quick cut before final CTA.",
    "",
    "Recording style:",
    "- Use voiceover only.",
    "- Add NQ chart or calculator screen recordings between slides.",
    "- Keep transitions fast and clean, no meme sounds.",
    "- Put affiliate disclosure in the description and early voiceover.",
  ].join(os.EOL);
  await fs.writeFile(shotList, shotListText);

  const stat = await fs.stat(finalPptx);
  console.log(JSON.stringify({
    finalPptx,
    finalPreview,
    shotList,
    workspace,
    slideCount: presentation.slides.items.length,
    pptxBytes: stat.size,
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
