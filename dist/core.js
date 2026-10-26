export class InputError extends Error{constructor(code,detail=''){super(code);this.code=code;this.detail=String(detail);}}
const fail=(c,d)=>{throw new InputError(c,d)};
const number=s=>/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)&&Number.isFinite(Number(s))?Number(s):NaN;
export function parseMatrix(criteriaText,optionsText){
 if(criteriaText.length>12000||optionsText.length>20000)fail('limit');const cl=criteriaText.trim()?criteriaText.trim().split(/\r?\n/):[];if(!cl.length||cl.length>12)fail('criteriaLimit');
 const names=new Set();const criteria=cl.map((l,i)=>{const a=l.split('|').map(x=>x.trim());if(a.length!==3)fail('criteriaFields',i+1);const[name,b,s]=a;if(!name||name.length>60||names.has(name))fail('criterionName',i+1);names.add(name);const weight=number(b),scenarioWeight=number(s);if(!Number.isFinite(weight)||!Number.isFinite(scenarioWeight)||weight>1000000||scenarioWeight>1000000)fail('weight',i+1);return{name,weight,scenarioWeight};});
 if(criteria.reduce((s,c)=>s+c.weight,0)===0)fail('zeroBase');if(criteria.reduce((s,c)=>s+c.scenarioWeight,0)===0)fail('zeroScenario');
 const lines=optionsText.trim()?optionsText.trim().split(/\r?\n/):[];if(!lines.length||lines.length>30)fail('optionLimit');const seen=new Set();
 const options=lines.map((l,i)=>{const a=l.split('|').map(x=>x.trim());if(a.length!==criteria.length+1)fail('scoreFields',i+1);const name=a.shift();if(!name||name.length>60||seen.has(name))fail('optionName',i+1);seen.add(name);const scores=a.map(number);if(scores.some(s=>!Number.isFinite(s)||s<0||s>100))fail('score',i+1);return{name,scores,index:i};});return{criteria,options};
}
export function calculate(model){const sum=model.criteria.reduce((s,c)=>s+c.weight,0),ss=model.criteria.reduce((s,c)=>s+c.scenarioWeight,0);if(!Number.isFinite(sum)||sum<=0)fail('zeroBase');if(!Number.isFinite(ss)||ss<=0)fail('zeroScenario');const criteria=model.criteria.map(c=>({...c,share:c.weight/sum,scenarioShare:c.scenarioWeight/ss}));
 const rows=model.options.map(o=>{const contributions=o.scores.map((s,i)=>s*criteria[i].share),scenarioContributions=o.scores.map((s,i)=>s*criteria[i].scenarioShare);return{...o,contributions,scenarioContributions,total:contributions.reduce((a,b)=>a+b,0),scenarioTotal:scenarioContributions.reduce((a,b)=>a+b,0)};});
 const rank=(field,target)=>{const sorted=[...rows].sort((a,b)=>b[field]-a[field]||a.index-b.index);let anchor=NaN,r=0;sorted.forEach((row,i)=>{if(i===0||Math.abs(row[field]-anchor)>1e-9){r=i+1;anchor=row[field];}row[target]=r;});};rank('total','rank');rank('scenarioTotal','scenarioRank');return{criteria,rows:rows.sort((a,b)=>a.rank-b.rank||a.index-b.index)};
}
export function csv(rows,headers){const escape=x=>'"'+String(x).replace(/^[=+@\-]/,"'$&").replaceAll('"','""')+'"';return'\uFEFF'+[headers,...rows].map(r=>r.map(escape).join(',')).join('\r\n');}
