import Dexie from "https://cdn.jsdelivr.net/npm/dexie@4.2.1/+esm";

const DB_KEY = "PWA::AGENDAMENTO:DB"; 

export default class AgendamentoService {
  #db = [];

  constructor() {
    this.#initializeDB();
  }

  #initializeDB() {
    console.log(`[AgendamentoService.js] initializing DB`);
    const db = new Dexie(DB_KEY);
    db.version(1).stores({
      agendamentos: "++id", 
    });
    
    db.on("populate", async () => {
      db.agendamentos.bulkPut([
        {
          paciente: "João Silva",
          data: "2025-11-15",
          hora: "10:00",
          medico: "Dra. Ana Costa",
          createdDate: new Date(),
        },
        {
          paciente: "Maria Souza",
          data: "2025-11-12",
          hora: "15:30",
          medico: "Dr. Carlos Lima",
          createdDate: new Date(),
        },
      ]);
    });
    db.open();
    this.#db = db;
  }

  // O método save suporta tanto criação (id undefined) quanto edição (id definido)
  async save({ id, paciente, data, hora, medico }) {
    if (!paciente || !data || !hora || !medico) {
      console.error(`[AgendamentoService.js] Dados incompletos fornecidos`);
      return;
    }
    const agendamentoRecord = {
      id: id, // Dexie usa o ID para decidir se insere ou atualiza
      paciente,
      data,
      hora,
      medico,
      updatedDate: new Date(),
    };
    if (!id) agendamentoRecord.createdDate = new Date();

    try {
      const savedId = await this.#db.agendamentos.put(agendamentoRecord);
      // Se não tinha ID, Dexie retorna o novo ID gerado
      if (!id) agendamentoRecord.id = savedId; 
      console.log(`[AgendamentoService.js] Agendamento para ${paciente} salvo`);
      return { id: agendamentoRecord.id, ...agendamentoRecord };
    } catch (error) {
      console.error(`Error when adding/editing agendamento: ${paciente}`, error);
    }
  }

  async getAll() {
    return this.#db.agendamentos.toArray(); 
  }

  async delete(agendamentoId) {
    await this.#db.agendamentos.delete(agendamentoId); 
    console.log(`[AgendamentoService.js] Agendamento ID ${agendamentoId} deletado`);
    return true;
  }
}