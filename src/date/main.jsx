// Date mode router. date.html?v=x1|x2|x3 = pit3 variants (x.jsx); v=f3 = pit4 fused variant (f3/), &next=1 = its
// continue screen (the real editor in Date tokens). Each branch loads its own CSS, so the variants never share rules.
const q = new URLSearchParams(location.search);
if (q.get('v') === 'g1') {
  if (q.has('next')) import('./g1/next.jsx');
  else import('./g1/gate.jsx');
} else if (q.get('v') === 'f3') {
  if (q.has('next')) import('./f3/next.jsx');
  else import('./f3/gate.jsx');
} else import('./x.jsx');
