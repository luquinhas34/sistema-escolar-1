
function Alunohome() {


    return (
        <h2>aluno</h2>
    );
}

export default Alunohome


// return (
//     <div className="display-flex">
//       <div className="sidebar">
//         <Link to="" className="active">
//           <i className="fas fa-home"></i> INICIO
//         </Link>
//         <Link to="/prof/atividades">
//           <i className="fas fa-tasks"></i> ATIVIDADES
//         </Link>
//         <Link to="/avaliacoes">
//           <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
//         </Link>
//         <Link to="/frequencias">
//           <i className="fas fa-calendar-check"></i> FREQUÊNCIAS
//         </Link>
//         <Link to="/diarios">
//           <i className="fas fa-book"></i> DIÁRIOS
//         </Link>
//         <Link to="/avisos">
//           <i className="fas fa-bell"></i> AVISOS
//         </Link>
//         <Link to="/sair">
//           <i className="fas fa-sign-out-alt"></i> SAIR
//         </Link>
//       </div>
//       <div className="main-content">
//         <div className="header">
//           <div className="welcome">Olá, Bem-vindo <strong>{user.name}</strong></div>
//         </div>
//         <div className="info-cards">
//           <div className="info-card">
//             <h3>Atividades</h3>
//             <p>{dados.atividades} Total</p>
//           </div>
//           <div className="info-card">
//             <h3>Avaliações</h3>
//             <p>{dados.avaliacoes} Total</p>
//           </div>
//           <div className="info-card">
//             <h3>Diários</h3>
//             <p>{dados.diarios} Total</p>
//           </div>
//         </div>
//         <div className="section">
//           <h2>Avisos</h2>
//           <Link to="/avisos" className="view-all">Ver todos</Link>
//           <div className="cards">
//             {dados.avisos.map((aviso, index) => (
//               <div key={index} className="card">
//                 <h3>{aviso.data}</h3>
//                 <p>{aviso.titulo}</p>
//                 <p>{aviso.descricao}</p>
//                 <Link to={`/avisos/${aviso.id}`}>Ver mais</Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );