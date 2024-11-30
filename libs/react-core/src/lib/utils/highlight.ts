import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// ----------------------------------------------------------------------

hljs.configure({
  languages: ['javascript', 'jsx', 'sh', 'bash', 'html', 'scss', 'css', 'json']
});

// @ts-ignore
window.hljs = hljs;
