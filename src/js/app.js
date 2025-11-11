import HtmlService from "./HtmlService.js";
import AgendamentoService from "./AgendamentoService.js";

class App {
  constructor() {
    this.#registerServiceWorker();
    const agendamentoService = new AgendamentoService();
    window.htmlService = new HtmlService(agendamentoService);
    this.#initAboutDialog(); 
  }

  #registerServiceWorker() {
    // prettier-ignore
    navigator.serviceWorker
      .register("./sw.js", { type: 'module' })
      .then(() => console.log(`👁️ [app.js] SW registered`))
      .catch(() => console.log(`👁️ [app.js] SW failed to register`));
  }
  
  #initAboutDialog() {
    const dialog = document.getElementById('about-dialog');
    const showButton = document.getElementById('show-about-dialog');
    const closeButton = dialog.querySelector('.close-dialog');

    if (!dialog.showModal) return; 

    showButton.addEventListener('click', () => {
        dialog.showModal();
    });

    closeButton.addEventListener('click', () => {
        dialog.close();
    });
  }
}

new App();