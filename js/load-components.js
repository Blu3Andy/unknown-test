/**
 * Load-Components Module
 * 
 * Ein einfaches System zum dynamischen Laden von HTML-Komponenten
 * via Fetch API. Sucht nach allen Elementen mit dem Attribut `data-include`
 * und lädt die angegebene Datei ein.
 * 
 * WICHTIG: Dieses System benötigt einen lokalen Webserver (z.B. VS Code Live Server),
 * da das fetch() nicht mit file:// Protokoll funktioniert (CORS-Sicherheitsrichtlinien).
 * 
 * Verwendung: <div data-include="path/to/component.html"></div>
 */

function initHeaderDropdowns(root = document) {
  const dropdowns = root.querySelectorAll('.uui-navbar02_menu-dropdown');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.uui-navbar02_dropdown-toggle');
    const list = dropdown.querySelector('.uui-navbar02_dropdown-list');

    if (!toggle || !list) {
      return;
    }

    const setOpenState = (isOpen) => {
      list.classList.toggle('w--open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      dropdown.classList.toggle('is-open', isOpen);
    };

    const closeIfFocusLeft = (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget && dropdown.contains(nextTarget)) {
        return;
      }
      setOpenState(false);
    };

    dropdown.addEventListener('mouseenter', () => setOpenState(true));
    dropdown.addEventListener('mouseleave', (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget && dropdown.contains(nextTarget)) {
        return;
      }
      setOpenState(false);
    });
    dropdown.addEventListener('focusin', () => setOpenState(true));
    dropdown.addEventListener('focusout', closeIfFocusLeft);

    toggle.addEventListener('click', (event) => {
      const prefersHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (prefersHover) {
        event.preventDefault();
      }

      const isOpen = list.classList.contains('w--open');
      setOpenState(!isOpen);
    });

    toggle.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  // Alle Elemente mit data-include Attribut finden
  const components = document.querySelectorAll('[data-include]');

  // Für jede Komponente: Datei laden und einfügen
  for (const component of components) {
    const filePath = component.getAttribute('data-include');

    if (!filePath) {
      console.warn('data-include Attribut ist leer');
      continue;
    }

    try {
      // Datei mit fetch laden
      const response = await fetch(filePath);

      // Prüfen ob Request erfolgreich war
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // HTML-Text auslesen
      const html = await response.text();

      // HTML in das Element einfügen
      component.innerHTML = html;
      initHeaderDropdowns(component);

      console.log(`✓ Komponente geladen: ${filePath}`);
    } catch (error) {
      // Error-Handling: Fehler-Nachricht im Element anzeigen
      component.innerHTML = `
        <div style="
          padding: 16px;
          background-color: #fee;
          border: 2px solid #f88;
          border-radius: 4px;
          color: #c00;
          font-family: monospace;
          font-size: 12px;
        ">
          <strong>Fehler beim Laden:</strong> ${filePath}<br>
          <small>${error.message}</small>
        </div>
      `;

      console.error(`✗ Fehler beim Laden von ${filePath}:`, error);
    }
  }
});
