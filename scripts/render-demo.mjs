import { readFileSync } from 'node:fs'

export function template(name) {
  return readFileSync(new URL('./templates/' + name, import.meta.url), 'utf8').replace(/\r\n/g, '\n').trimEnd()
}

const svgStage = `<div class="stage" id="stage">
      <svg id="svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="{{TITLE}} 算法分步动画"></svg>
    </div>`

export function renderDemo({ slug, title, js, css = '', stage = svgStage }) {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return template('shell.html')
    .replace('/*__TOKENS__*/', () => template('tokens.css'))
    .replace('/*__ARCH_CSS__*/', () => css)
    .replace('<!--__STAGE__-->', () => stage)
    .replace('/*__KERNEL__*/', () => template('kernel.js'))
    .replaceAll('{{TITLE}}', () => safeTitle)
    .replaceAll('{{SLUG}}', slug)
    .replace('/*__ARCH__*/', () => js) + '\n'
}
