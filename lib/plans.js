export const PREMIUM_PLANS=[
{id:'starter',name:'Starter',price:49,days:30,dailyXp:200,icon:'🌱'},
{id:'bronze',name:'Bronze+',price:99,days:30,dailyXp:500,icon:'🥉'},
{id:'silver',name:'Silver+',price:180,days:30,dailyXp:1000,icon:'🥈'},
{id:'gold',name:'Gold+',price:299,days:30,dailyXp:1300,icon:'🥇'},
{id:'platinum',name:'Platinum+',price:449,days:30,dailyXp:1600,icon:'💠'},
{id:'diamond',name:'Diamond+',price:699,days:30,dailyXp:2000,icon:'💎'},
{id:'master',name:'Master+',price:999,days:30,dailyXp:2500,icon:'🛡️'},
{id:'elite',name:'Elite+',price:1499,days:30,dailyXp:3000,icon:'⚡'},
{id:'legend',name:'Legend+',price:1999,days:30,dailyXp:4000,icon:'👑'},
{id:'cobra',name:'Cobra+',price:2999,days:30,dailyXp:5000,icon:'🐍'}
];
export function getPlan(id){return PREMIUM_PLANS.find(x=>x.id===id)||null}
