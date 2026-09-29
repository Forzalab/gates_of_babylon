// theme.js: the engine's fonts + design tokens, in ONE place. Both the chrome (main.jsx) and the art (art/index.js)
// import this, so art CSS that reads --cond / --jp / --jp-serif never loses them when the chrome CSS changes
// (UXUI R2b finding 1: without the tokens every `font:` shorthand went invalid and ADORE ME fell to 16 px).
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/nunito/900.css';
import '@fontsource-variable/nunito/wght.css';
import '@fontsource/m-plus-rounded-1c/500.css';
import '@fontsource/m-plus-rounded-1c/800.css';
import './tokens.css';
import '../fontTrial.js';
