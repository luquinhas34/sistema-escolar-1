import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../../../components/ui/Modal.jsx";
import "../horario/style.css";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const turnos = ["Manhã", "Tarde", "Noite"];

export default function HorarioPage() {
    const [user] = useState({ name: "Coordenador" }); // Simula o nome do usuário
    const [diaSelecionado, setDiaSelecionado] = useState("Seg");
    const [turnoSelecionado, setTurnoSelecionado] = useState("Manhã");
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [toEdit, setToEdit] = useState(null);

    const [novo, setNovo] = useState({ dia: "Segunda-feira", turno: "Manhã", atividade: "", horaInicio: "", horaFim: "" });
    const [editData, setEditData] = useState({ dia: "Seg", turno: "Manhã", atividade: "", horaInicio: "", horaFim: "" });

    useEffect(() => {
        fetch("http://localhost:3000/api/horarios")
            .then((res) => res.json())
            .then((data) => setHorarios(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3000/api/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...novo, dia: fullDia(diaSelecionado), turno: turnoSelecionado }),
        });
        const criado = await res.json();
        setHorarios((prev) => [...prev, criado]);
        setShowModalAdd(false);
        setNovo({ dia: "Segunda-feira", turno: "Manhã", atividade: "", horaInicio: "", horaFim: "" });
    }

    async function handleDelete() {
        await fetch(`http://localhost:3000/api/horarios/${toDeleteId}`, { method: "DELETE" });
        setHorarios((prev) => prev.filter((h) => h.id !== toDeleteId));
        setShowModalDelete(false);
        setToDeleteId(null);
    }

    function openEditModal(horario) {
        setToEdit(horario);
        setEditData({
            dia: horario.dia.slice(0, 3),
            turno: horario.turno,
            atividade: horario.atividade,
            horaInicio: horario.horaInicio,
            horaFim: horario.horaFim,
        });
        setShowModalEdit(true);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        const payload = {
            dia: fullDia(editData.dia),
            turno: editData.turno,
            atividade: editData.atividade,
            horaInicio: editData.horaInicio,
            horaFim: editData.horaFim,
        };
        const res = await fetch(`http://localhost:3000/api/horarios/${toEdit.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        const atualizado = json.atualizado || json;
        setHorarios((prev) => prev.map((h) => (h.id === atualizado.id ? atualizado : h)));
        setShowModalEdit(false);
        setToEdit(null);
    }

    function fullDia(abrev) {
        return {
            Seg: "Segunda-feira",
            Ter: "Terça-feira",
            Qua: "Quarta-feira",
            Qui: "Quinta-feira",
            Sex: "Sexta-feira",
        }[abrev] || abrev;
    }

    const filtrados = horarios.filter(
        (h) => h.dia.slice(0, 3) === diaSelecionado && h.turno === turnoSelecionado
    );



    return (
        <div className="main">
            {/* Sidebar e Cabeçalho */}
            <div className="sidebar">
                <a href="/cood/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/cood/atividades"  ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/cood/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/cood/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
                <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/cood/horario" className="active"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/cood/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/cood/professor"><i className="fa-circle-user" ></i> AD PROFESSOR</a>
                <a href="/cood/aluno"><i className="fa-circle-user" ></i> AD ALUNOS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo principal */}
            <div className="main-content">
                <div className="header ">
                    <div className="welcome ">
                        Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
                    </div>
                    <div className="icons">
                        <a href="/cood/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>
                <div className="welcome">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Horários</h1>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => setEditMode((p) => !p)}>
                                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                {editMode ? 'Concluir' : 'Editar'}
                            </Button>
                            <Button onClick={() => setShowModalAdd(true)} variant="default" className="bg-purple-500 hover:bg-purple-600 text-white">
                                + Adicionar horário
                            </Button>
                        </div>
                    </div>

                    {/* Filtros de horário */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <select value={turnoSelecionado} onChange={(e) => setTurnoSelecionado(e.target.value)} className="border rounded px-4 py-2">
                            {turnos.map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                        {dias.map((d) => (
                            <Button key={d} variant={d === diaSelecionado ? 'default' : 'outline'} onClick={() => setDiaSelecionado(d)}>
                                {d}
                            </Button>
                        ))}
                    </div>

                    {/* Lista de horários */}
                    <div className="bg-white p-6 rounded-xl shadow min-h-[200px] relative">
                        {loading ? (
                            <p className="text-gray-500">Carregando horários…</p>
                        ) : filtrados.length > 0 ? (
                            <div className="space-y-4">
                                {filtrados.map((h) => (
                                    <div key={h.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                                        <span className="text-base font-medium">{h.atividade}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">{h.horaInicio} até {h.horaFim}</span>
                                            {editMode && (
                                                <>
                                                    <Pencil className="h-5 w-5 cursor-pointer text-blue-500" onClick={() => openEditModal(h)} />
                                                    <Trash2 className="h-5 w-5 cursor-pointer text-red-500" onClick={() => {
                                                        setToDeleteId(h.id);
                                                        setShowModalDelete(true);
                                                    }} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nenhum horário encontrado.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modais */}
            {showModalAdd && (
                <Modal title="Adicionar Horário" onClose={() => setShowModalAdd(false)} color="purple">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Atividade"
                            value={novo.atividade}
                            onChange={(e) => setNovo({ ...novo, atividade: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-4">
                            <input
                                type="time"
                                value={novo.horaInicio}
                                onChange={(e) => setNovo({ ...novo, horaInicio: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="time"
                                value={novo.horaFim}
                                onChange={(e) => setNovo({ ...novo, horaFim: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <Button variant="default" type="submit" className="w-full mt-4">
                            Salvar
                        </Button>
                    </form>
                </Modal>
            )}

            {showModalDelete && (
                <Modal title="Confirmar exclusão" onClose={() => setShowModalDelete(false)} color="red">
                    <div>
                        <p>Você tem certeza que deseja excluir este horário?</p>
                        <div className="mt-4 flex gap-4">
                            <Button variant="ghost" onClick={() => setShowModalDelete(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {showModalEdit && (
                <Modal title="Editar Horário" onClose={() => setShowModalEdit(false)} color="yellow">
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Atividade"
                            value={editData.atividade}
                            onChange={(e) => setEditData({ ...editData, atividade: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-4">
                            <input
                                type="time"
                                value={editData.horaInicio}
                                onChange={(e) => setEditData({ ...editData, horaInicio: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="time"
                                value={editData.horaFim}
                                onChange={(e) => setEditData({ ...editData, horaFim: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <Button variant="default" type="submit" className="w-full mt-4">
                            Atualizar
                        </Button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
