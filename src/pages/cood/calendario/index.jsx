import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function CalendarioPage() {
    const [mes, setMes] = useState(new Date().getMonth());
    const [ano, setAno] = useState(new Date().getFullYear());
    const [dias, setDias] = useState([]);
    const [calendarios, setCalendarios] = useState([]);
    const [calendarioSelecionado, setCalendarioSelecionado] = useState(null);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axios.get("/api/calendarios").then((res) => {
            if (Array.isArray(res.data)) {
                setCalendarios(res.data);
                setCalendarioSelecionado(res.data[0]?.id || null);
            }
        });
    }, []);

    useEffect(() => {
        if (calendarioSelecionado) {
            axios
                .get(`/api/calendarios/${calendarioSelecionado}/eventos`)
                .then((res) => setEventos(res.data || []));
        }
    }, [calendarioSelecionado]);

    useEffect(() => {
        const date = new Date(ano, mes, 1);
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();
        const inicioSemana = (date.getDay() + 6) % 7; // começa em segunda
        const diasArray = [];

        for (let i = 0; i < inicioSemana; i++) {
            diasArray.push(null);
        }

        for (let i = 1; i <= diasNoMes; i++) {
            diasArray.push(i);
        }

        setDias(diasArray);
    }, [mes, ano]);

    const getEventosDoDia = (dia) => {
        if (!dia) return null;
        const data = new Date(ano, mes, dia).toISOString().split("T")[0];
        return eventos.filter((ev) => ev.data.startsWith(data));
    };

    const legenda = {
        INICIO_BIMESTRE: "green",
        RECESSO: "red",
        SABADO_LETIVO: "orange",
        FERIADO: "purple",
    };

    return (
        <div className="calendario-container">
            <div className="calendario-header">
                <select onChange={(e) => setCalendarioSelecionado(e.target.value)} value={calendarioSelecionado || ""}>
                    {calendarios.map((cal) => (
                        <option key={cal.id} value={cal.id}>
                            {cal.ano}/{cal.semestre}
                        </option>
                    ))}
                </select>
                <div>
                    <button onClick={() => setMes(mes - 1)}>&lt;</button>
                    <span>{new Date(ano, mes).toLocaleString("pt-BR", { month: "long", year: "numeric" })}</span>
                    <button onClick={() => setMes(mes + 1)}>&gt;</button>
                </div>
            </div>

            <div className="dias-semana">
                {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].map((dia) => (
                    <div key={dia} className="dia-semana">{dia}</div>
                ))}
            </div>

            <div className="dias-grid">
                {dias.map((dia, idx) => {
                    const eventosDia = getEventosDoDia(dia);
                    return (
                        <div key={idx} className="dia-celula">
                            <div className="numero-dia">{dia}</div>
                            {eventosDia?.map((ev, i) => (
                                <div key={i} className={`evento ${legenda[ev.tipo] || ""}`}>
                                    {ev.tipo.replace("_", " ")}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="legenda-eventos">
                <span><div className="box green" /> Início do bimestre</span>
                <span><div className="box red" /> Recesso</span>
                <span><div className="box orange" /> Sábado letivo</span>
                <span><div className="box purple" /> Feriado</span>
            </div>
        </div>
    );
}
