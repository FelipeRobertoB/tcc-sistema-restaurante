
---

# 🍽️ Sistema de Gestão para Restaurantes (PDV & KDS)

> **Trabalho de Conclusão de Curso (TCC)**
> Sistema web completo para gerenciamento de pedidos, mesas e fluxo de cozinha em tempo real.

![Status](https://img.shields.io/badge/STATUS-FINALIZADO-brightgreen)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green)
![React](https://img.shields.io/badge/React-Vite-blue)
![Database](https://img.shields.io/badge/H2-Database-blue)

---

## 🎯 Sobre o Projeto

Este sistema moderniza o atendimento em restaurantes de pequeno porte, integrando o **Atendimento** e a **Cozinha** através de telas sincronizadas.

**Principais Funcionalidades:**

* **Gestão de Mesas:** status em tempo real (Livre, Ocupada, Pagamento).
* **KDS (Cozinha):** monitor de pedidos com alerta de atraso (Verde/Amarelo/Vermelho).
* **Financeiro:** fechamento de conta e relatórios.

---

## 🚀 Tecnologias

* **Backend:** Java 21 (LTS), Spring Boot 3, H2 Database
* **Frontend:** React.js, Vite, Axios, CSS Modules

---

## 📦 Como Executar

### 📋 Pré-requisitos

Antes de começar, verifique se sua máquina possui as ferramentas necessárias.

---

### **1. Java JDK 21**

* [Baixar do site oficial (Oracle)](https://www.oracle.com/java/technologies/downloads/#java17)
* **Como testar:** abra o terminal (CMD) e digite:

```bash
java -version
```

---

### **2. Node.js 18 (versão LTS)**

* [Baixar do site oficial](https://nodejs.org/)
* **Como testar:** abra o terminal (CMD) e digite:

```bash
node -v
```

---

### ▶️ Modo Automático (Windows)

Dê um duplo clique no arquivo **`start.bat`** na raiz do projeto.
Ele instalará as dependências e iniciará o Backend e o Frontend automaticamente.

---

### 🛠️ Modo Manual (Terminal)

**1. Iniciar Backend:**

```bash
cd backend
./mvnw spring-boot:run
```

**2. Iniciar Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📱 Acesso via Celular (Rede Local)

Para testar como se fosse um garçom:

1. Conecte o celular no mesmo Wi-Fi do computador.
2. Descubra o IP do seu computador (comando `ipconfig`).
3. No celular, acesse:

```
http://SEU_IP_AQUI:5173
```

---

## 📄 Documentação da API

Acesse o Swagger UI para visualizar os endpoints:

```
http://localhost:8080/swagger-ui.html
```

### 👤 Autor

Este projeto foi desenvolvido por **Felipe Roberto Blanco Joyce** como requisito para obtenção do grau em Sistemas para Internet.

<a href="https://www.linkedin.com/in/felipe-roberto-blanco-joyce-31080b291/" target="_blank">
 <img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank">
</a>
