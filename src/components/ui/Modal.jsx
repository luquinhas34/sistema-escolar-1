import React, { useState } from 'react';
import Modal from './Modal';

const ExampleComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div>
            <button onClick={toggleModal}>Abrir Modal</button>

            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <h2>Conteúdo do Modal</h2>
                <p>Este é um exemplo de modal.</p>
            </Modal>
        </div>
    );
};

export default ExampleComponent;
