export default class HtmlService {
  #ul;
  #agendamentoService;
  #agendamentos = new Map();
  #form;
  #submitButton;

  constructor(agendamentoService) {
    this.#agendamentoService = agendamentoService;
    this.#ul = document.querySelector("#agendamentos-list");
    this.#form = document.querySelector("#agendamento-form");
    this.#submitButton = document.querySelector("#submit-button");
    
    // EXPOR MÉTODOS PÚBLICOS PARA O HTML AQUI
    window.htmlService = this;
    
    this.#formInitialization();
    this.#listAgendamentos();
    this.#initConfirmDialog();
  }

  // Novo: Lógica do Dialog de Confirmação
  #initConfirmDialog() {
    const dialog = document.getElementById('confirm-dialog');
    const confirmButton = document.getElementById('confirm-delete-button');
    const cancelButton = document.getElementById('cancel-delete-button');

    if (!dialog.showModal) return; 

    // O método showDeleteConfirmation agora é parte da classe
    // Ele será chamado pelo botão delete via onclick="window.htmlService.showDeleteConfirmation(id)"

    // Adiciona o listener para a exclusão após a confirmação
    confirmButton.addEventListener('click', (event) => {
        const idToDelete = Number(confirmButton.dataset.agendamentoId);
        if (idToDelete) {
            this.deleteAgendamento(idToDelete);
            dialog.close();
        }
    });
    
    cancelButton.addEventListener('click', () => {
        dialog.close();
    });
  }

  // MÉTODO PÚBLICO: Exibe o dialog de confirmação (chamado pelo HTML)
  showDeleteConfirmation(id) {
      const dialog = document.getElementById('confirm-dialog');
      const confirmButton = document.getElementById('confirm-delete-button');
      
      const agendamento = this.#agendamentos.get(id);
      if (!agendamento) return;
      
      const infoElement = document.getElementById('agendamento-delete-info');
      infoElement.textContent = `${agendamento.paciente} com Dr(a). ${agendamento.medico}`;
      
      // Armazena o ID no botão de confirmação
      confirmButton.dataset.agendamentoId = id;
      
      dialog.showModal();
  }


  // MÉTODO PÚBLICO: Lógica de edição (chamado pelo HTML)
  editAgendamento(id) {
    const agendamento = this.#agendamentos.get(id);
    if (!agendamento) return;
    
    // 1. Preenche o formulário com os dados
    this.#form.querySelector('#agendamento-id-input').value = agendamento.id;
    this.#form.querySelector('#paciente-input').value = agendamento.paciente;
    this.#form.querySelector('#medico-input').value = agendamento.medico;
    this.#form.querySelector('#data-input').value = agendamento.data;
    this.#form.querySelector('#hora-input').value = agendamento.hora;

    // 2. Atualiza o texto do botão para indicar "Salvar Alterações"
    this.#submitButton.innerHTML = '<i class="material-icons">save</i> Salvar Alterações';
    this.#submitButton.classList.add('mdl-button--accent'); 

    // 3. Força a atualização dos componentes MDL para que os labels flutuem corretamente
    // Adiciona a classe 'is-dirty' para forçar o label a subir
    if (window.componentHandler) {
      // É crucial atualizar o MDL para reconhecer que os campos estão preenchidos
      const textFields = this.#form.querySelectorAll('.mdl-textfield');
      textFields.forEach(tf => {
        if (tf.MaterialTextfield && tf.querySelector('input').value) {
            tf.MaterialTextfield.checkDirty();
        }
      });
      window.componentHandler.upgradeElements(this.#form);
    }
    
    // 4. Scroll para o topo para facilitar a edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  #resetForm() {
    this.#form.reset();
    this.#form.querySelector('#agendamento-id-input').value = '';
    this.#submitButton.innerHTML = '<i class="material-icons">schedule</i> Agendar Consulta';
    this.#submitButton.classList.remove('mdl-button--accent'); 
    
    // Força a atualização dos componentes MDL para resetar os labels flutuantes
    if (window.componentHandler) {
      const textFields = this.#form.querySelectorAll('.mdl-textfield');
      textFields.forEach(tf => {
          if (tf.MaterialTextfield) {
              tf.MaterialTextfield.checkDirty();
          }
      });
    }
  }

  #formInitialization() {
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const id = this.#form.querySelector('#agendamento-id-input').value;
      const paciente = this.#form.querySelector('#paciente-input').value;
      const data = this.#form.querySelector('#data-input').value;
      const hora = this.#form.querySelector('#hora-input').value;
      const medico = this.#form.querySelector('#medico-input').value;

      const agendamentoData = { 
        id: id ? Number(id) : undefined, 
        paciente, data, hora, medico 
      };

      await this.#addNewAgendamento(agendamentoData);
      this.#resetForm();
      this.#form.querySelector('#paciente-input').focus();
    });
  }

  async #listAgendamentos() {
    this.#ul.innerHTML = ''; 
    const agendamentos = await this.#agendamentoService.getAll();
    agendamentos.forEach((agendamento) => {
      this.#agendamentos.set(agendamento.id, agendamento);
      this.#addAgendamentoToDOM(agendamento);
    });
  }

  async #addNewAgendamento(agendamentoData) {
    const newAgendamento = await this.#agendamentoService.save(agendamentoData);
    if (newAgendamento) {
        // Força a re-renderização da lista para garantir a atualização e/ou ordenação
        this.#listAgendamentos(); 
    }
  }

  #addAgendamentoToDOM(agendamento) {
    const agendamentoHtml = `
      <li id="${agendamento.id}" class="agendamento-card mdl-shadow--2dp">
        <div class="appointment-details">
          
          <div class="paciente-header">
            <i class="material-icons">person</i>
            <span class="main-info">**${agendamento.paciente}**</span>
          </div>
          
          <div class="detail-row">
            <i class="material-icons">medical_services</i>
            <span class="sub-info">Dr(a). ${agendamento.medico}</span>
          </div>
          
          <div class="detail-row">
            <i class="material-icons">calendar_today</i>
            <span class="sub-info">${agendamento.data}</span>
            <i class="material-icons time-icon">schedule</i>
            <span class="sub-info">${agendamento.hora}</span>
          </div>

        </div>
        
        <div class="action-buttons">
            <button class="mdl-button mdl-js-button mdl-button--icon" 
                    onclick="window.htmlService.editAgendamento(${agendamento.id})">
                <i class="material-icons edit-icon">edit</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--icon" 
                    onclick="window.htmlService.showDeleteConfirmation(${agendamento.id})">
                <i class="material-icons delete-icon">delete</i>
            </button>
        </div>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", agendamentoHtml);
    
    if(window.componentHandler) {
      window.componentHandler.upgradeElements(this.#ul.lastElementChild);
    }
  }

  // MÉTODO PÚBLICO: Método de exclusão real (chamado após a confirmação)
  async deleteAgendamento(agendamentoId) {
    const isDeleted = await this.#agendamentoService.delete(agendamentoId);
    if (isDeleted) document.getElementById(agendamentoId).remove();
  }
}