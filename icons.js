/* ============================================================================
 * SISCCD — Sistema de Ícones (substitui o uso de emojis na interface)
 * Ícones vetoriais inline, estilo stroke 24x24 (linha 2px, cantos arredondados).
 * Uso:
 *   - No HTML estático:  <i class="icon" data-icon="shield"></i>
 *   - No JS (template strings para innerHTML):  icone('shield')
 * ============================================================================ */

const SISCCD_ICONS = {
  'shield': '<path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z"/>',
  'shield-check': '<path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  'lock': '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  'unlock': '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.3-2.3"/>',
  'key': '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 7-7M15 6l2 2M18 3l3 3"/>',
  'alert-triangle': '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none"/>',
  'alert-octagon': '<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2Z"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none"/>',
  'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3L16 10"/>',
  'x': '<path d="M18 6 6 18M6 6l12 12"/>',
  'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9.5 9.5 5 5m0-5-5 5"/>',
  'plus': '<path d="M12 5v14M5 12h14"/>',
  'trash-2': '<path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M18 7l-.8 12.1A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.9L6 7"/><path d="M10 11v6M14 11v6"/>',
  'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  'users': '<circle cx="9" cy="8" r="3.3"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 8.2a3.3 3.3 0 1 1 0 6.1M21.5 20c0-3-2-5.3-5-5.9"/>',
  'user-plus': '<circle cx="9" cy="8" r="3.3"/><path d="M2 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/><path d="M18 8v6M15 11h6"/>',
  'building': '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/><path d="M10 21v-4h4v4"/>',
  'graduation-cap': '<path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M21 9.5V15"/>',
  'scale': '<path d="M12 3v18M7 3h10"/><path d="m5 8-3 6a3 3 0 0 0 6 0l-3-6Zm14 0-3 6a3 3 0 0 0 6 0l-3-6Z"/>',
  'trophy': '<path d="M8 3h8v5a4 4 0 0 1-8 0V3Z"/><path d="M8 4H4v2a4 4 0 0 0 4 4M16 4h4v2a4 4 0 0 1-4 4"/><path d="M12 13v3M9 20h6M9.5 20c0-1.8.9-3 2.5-4 1.6 1 2.5 2.2 2.5 4"/>',
  'accessibility': '<circle cx="12" cy="5" r="1.7"/><path d="M5 9.5h14M12 9.5V14m0 0-4 7m4-7 4 7M8.5 14h7"/>',
  'compass': '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-6 2 2-6 6-2Z"/>',
  'calendar': '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  'map-pin': '<path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/>',
  'save': '<path d="M5 3h12l4 4v14H5V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.4 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.6a7.8 7.8 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2.6 1.5L10 22h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.6Z"/>',
  'camera': '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  'image': '<rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m5 18 5-5.5 3.5 3.5L18 11l2.5 2.5"/>',
  'bar-chart': '<path d="M5 20V10M12 20V4M19 20v-7"/><path d="M3 20h18"/>',
  'edit-3': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  'phone': '<path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5V19a2 2 0 0 1-2 2C10.6 21 3 13.4 3 5.5A2 2 0 0 1 5 4Z"/>',
  'zap': '<path d="M12.5 2 4 14h6l-1 8 9.5-13h-6l1-7Z"/>',
  'smartphone': '<rect x="6" y="2.5" width="12" height="19" rx="2.3"/><path d="M11 18.5h2"/>',
  'eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="M3 3l18 18"/><path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.6 15.6 0 0 1-3.7 4.6M6.5 6.6C4 8.3 2 12 2 12s3.6 7 10 7c1.4 0 2.6-.3 3.7-.8"/><path d="M9.5 9.8a3 3 0 0 0 4.2 4.2"/>',
  'download': '<path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 18v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  'upload': '<path d="M12 21V9m0 0-4 4m4-4 4 4"/><path d="M4 18v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  'printer': '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M6 14h12v7H6v-7Z"/>',
  'book-open': '<path d="M3 5.5c2.3-1 5-1.3 9 0v13c-4-1.3-6.7-1-9 0v-13Z"/><path d="M21 5.5c-2.3-1-5-1.3-9 0v13c4-1.3 6.7-1 9 0v-13Z"/>',
  'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.3 2"/>',
  'tag': '<path d="M3 11.5V5a2 2 0 0 1 2-2h6.5L21 12.5 12.5 21 3 11.5Z"/><circle cx="8" cy="8" r="1.6"/>',
  'brain': '<path d="M9 4a3 3 0 0 0-3 3 2.6 2.6 0 0 0-1.5 4.7A3 3 0 0 0 7 17h2V4Zm6 0a3 3 0 0 1 3 3 2.6 2.6 0 0 1 1.5 4.7A3 3 0 0 1 17 17h-2V4Z"/><path d="M9 7.5h2M9 11h2M9 14.5h2M13 7.5h2M13 11h2M13 14.5h2"/>',
  'refresh-cw': '<path d="M3.5 12a8.5 8.5 0 0 1 14.6-6M20.5 12a8.5 8.5 0 0 1-14.6 6"/><path d="M18.5 2v4.3h-4.3M5.5 22v-4.3h4.3"/>',
  'gift': '<rect x="3.5" y="8.5" width="17" height="4.5" rx="1"/><path d="M4.5 13v8h15v-8M12 8.5V21"/><path d="M12 8.5C9 8.5 7.5 7 7.5 5.5A2.5 2.5 0 0 1 10 3c2 0 2 3.2 2 5.5Zm0 0c3 0 4.5-1.5 4.5-3A2.5 2.5 0 0 0 14 0a2.5 2.5 0 0 0-2 2.5c0 2.3 0 6 0 6Z"/>',
  'arrow-right': '<path d="M5 12h14m0 0-5-5m5 5-5 5"/>',
  'arrow-left': '<path d="M19 12H5m0 0 5-5m-5 5 5 5"/>',
  'monitor': '<rect x="3" y="4" width="18" height="12.5" rx="1.5"/><path d="M8 21h8M12 16.5V21"/>',
  'target': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  'trending-up': '<path d="m3 16 6.5-6.5 4 4L21 6"/><path d="M15 6h6v6"/>',
  'trending-down': '<path d="m3 8 6.5 6.5 4-4L21 18"/><path d="M15 18h6v-6"/>',
  'rocket': '<path d="M12 2c3 1.5 5 5 5 9.5-1.4.7-3 1-5 1s-3.6-.3-5-1C7 7 9 3.5 12 2Z"/><path d="M8.5 15 6 21l4-2M15.5 15 18 21l-4-2"/><circle cx="12" cy="9.5" r="1.6" fill="currentColor" stroke="none"/>',
  'link': '<path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 13 4.5a3.8 3.8 0 0 1 5.4 5.4L16.5 12M13 17.5l-2 2A3.8 3.8 0 0 1 5.6 14l2-2"/>',
  'sparkles': '<path d="M12 3v3M12 18v3M4.5 12h3M16.5 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2"/><circle cx="12" cy="12" r="2.3"/>',
  'cloud': '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 5.5 5.5 0 0 1 10.6-1.8A4.5 4.5 0 0 1 17 18.5H7Z"/>',
  'mouse-pointer': '<path d="M5 3.5 19 10l-6.2 1.8L10 18 5 3.5Z"/>',
  'clipboard-list': '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z"/><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
};

/**
 * Retorna o markup SVG completo de um ícone.
 * @param {string} nome - chave em SISCCD_ICONS
 * @param {string} [classeExtra] - classes CSS adicionais
 */
function icone(nome, classeExtra) {
  const inner = SISCCD_ICONS[nome];
  if (!inner) return '';
  const cls = 'icon' + (classeExtra ? ' ' + classeExtra : '');
  return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
}

/**
 * Hidrata todos os elementos estáticos <i data-icon="nome"></i> do HTML,
 * injetando o SVG correspondente. Chamado uma vez no carregamento da página
 * e pode ser chamado novamente após inserir HTML estático dinamicamente.
 */
function hidratarIcones(escopo) {
  const raiz = escopo || document;
  raiz.querySelectorAll('[data-icon]').forEach(function (el) {
    const nome = el.getAttribute('data-icon');
    if (el.dataset.iconHidratado === nome) return;
    const extra = el.getAttribute('data-icon-class') || '';
    el.innerHTML = icone(nome, extra);
    el.dataset.iconHidratado = nome;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  hidratarIcones();
});
