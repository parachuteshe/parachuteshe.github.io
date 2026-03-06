// Mock data for Eng Debate Studio

const MOTIONS = [
  { id: '1', text: 'This House would ban the use of facial recognition technology by governments.', year: 2024, region: 'World', source: 'WUDC-style' },
  { id: '2', text: 'This House believes that social media companies should be held legally responsible for content posted on their platforms.', year: 2024, region: 'Europe', source: 'EUDC' },
  { id: '3', text: 'This House would require wealthy nations to pay climate reparations to developing countries.', year: 2023, region: 'Asia', source: 'QatarDebate' },
  { id: '4', text: 'This House supports the use of mandatory national service programmes.', year: 2023, region: 'World', source: 'WUDC' },
  { id: '5', text: 'This House would ban the production and sale of meat.', year: 2024, region: 'Middle East', source: 'QatarDebate' },
  { id: '6', text: 'This House believes that universities should prioritise vocational training over academic research.', year: 2023, region: 'Europe', source: 'EUDC' },
  { id: '7', text: 'This House would make voting compulsory.', year: 2024, region: 'Asia', source: 'Asian BP' },
  { id: '8', text: 'This House regrets the rise of the influencer economy.', year: 2023, region: 'World', source: 'WUDC-style' },
];

const TOURNAMENTS = [
  { id: '1', name: 'World Universities Debating Championship 2026', region: 'TBD', fee: 'Team fee varies', requirement: 'University team, qualified via regional', link: 'https://wudc.debate.earth/', ongoing: true },
  { id: '2', name: 'Asian British Parliamentary Championship 2026', region: 'Asia', fee: '~$50–100 per team', requirement: 'Asian institution', link: '', ongoing: true },
  { id: '3', name: 'European Universities Debating Championship 2026', region: 'Europe', fee: 'Varies by host', requirement: 'European university', link: '', ongoing: true },
  { id: '4', name: 'Seasons Novice British Parliamentary 2026', region: 'Online', fee: 'Free / low fee', requirement: 'Novice debaters', link: 'https://seasons.calicotab.com/', ongoing: true },
  { id: '5', name: 'National Schools / Universities Championships 2026', region: 'Various', fee: 'School or team registration', requirement: 'Regional qualification', link: '', ongoing: false },
];

// 精选辩论稿（真实辩稿，来源 Debating404 等）
// 参考 https://debating404.com/category/debate-transcripts/
const FEATURED_TRANSCRIPTS = [
  { id: 'ft-1', event: 'WSDC 2025', title: 'Panama WSDC 2025 Grand Final (India vs Australia)', motion: 'This House prefers a world with a strong belief in Seriti', link: 'https://debating404.com/category/debate-transcripts/', source: 'Debating404' },
  { id: 'ft-2', event: 'WSDC 2017', title: 'Indonesia WSDC 2017 Grand Final (England vs Singapore)', motion: 'This House supports restrictions on free speech to combat the rise of right-wing populism', link: 'https://debating404.com/category/debate-transcripts/', source: 'Debating404' },
  { id: 'ft-3', event: 'WSDC 2024', title: 'Serbia WSDC 2024 Semi Finals (Bulgaria vs Greece)', motion: 'This House would allow violent offenders to opt into Pavlovian conditioning as a substitution for prison time', link: 'https://debating404.com/category/debate-transcripts/', source: 'Debating404' },
  { id: 'ft-4', event: 'WSDC 2024', title: 'Serbia WSDC 2024 Grand Final (Scotland vs Bulgaria)', motion: 'This House regrets the glorification of champions', link: 'https://debating404.com/category/debate-transcripts/', source: 'Debating404' },
  { id: 'ft-5', event: 'WUDC 2016', title: 'Thessaloniki WUDC 2016 Open Finals [Opening Half]', motion: "This House believes that the world's poor would be justified in pursuing complete Marxist revolution", link: 'https://debating404.com/category/debate-transcripts/', source: 'Debating404' },
];

const BP_SLOTS = [
  { id: 'OG-PM', role: 'Prime Minister', team: 'Opening Government' },
  { id: 'OG-DPM', role: 'Deputy PM', team: 'Opening Government' },
  { id: 'OO-LO', role: 'Leader of Opposition', team: 'Opening Opposition' },
  { id: 'OO-DLO', role: 'Deputy LO', team: 'Opening Opposition' },
  { id: 'CG-MG', role: 'Member of Government', team: 'Closing Government' },
  { id: 'CG-GW', role: 'Government Whip', team: 'Closing Government' },
  { id: 'CO-MO', role: 'Member of Opposition', team: 'Closing Opposition' },
  { id: 'CO-OW', role: 'Opposition Whip', team: 'Closing Opposition' },
];

function getMotionYears() {
  const set = new Set(MOTIONS.map(m => m.year));
  return [...set].sort((a, b) => b - a);
}

function getRegionsFromMotions() {
  const set = new Set(MOTIONS.map(m => m.region));
  return [...set].sort();
}

function getRegionsFromTournaments() {
  const set = new Set(TOURNAMENTS.map(t => t.region));
  return [...set].sort();
}
