# 📊 Excel Header Normalizer

<div align="left">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=for-the-badge&logo=shield" />
</div>

<br />

**Excel Header Normalizer** é uma ferramenta web moderna e de alta velocidade para sanitizar, padronizar e converter cabeçalhos de planilhas **Excel (.xlsx / .xls)** e **CSV** para formatos prontos para importação em bancos de dados SQL, ERPs e pipelines de dados.

Desenvolvido com foco em **privacidade absoluta**: todo o processamento de dados acontece na memória local do navegador (Web APIs + WebAssembly), **sem enviar nenhuma informação para servidores externos**.

---

## ⚡ Principais Recursos

- 🔄 **Múltiplas Convenções de Nomenclatura:**
  - `snake_case` (ex: `preco_unitario_venda` — padrão SQL/PostgreSQL)
  - `camelCase` (ex: `precoUnitarioVenda` — padrão JavaScript/JSON)
  - `PascalCase` (ex: `PrecoUnitarioVenda` — padrão C#/Classes)
  - `kebab-case` (ex: `preco-unitario-venda` — URLs e slugs)
  - `UPPER_SNAKE` (ex: `PRECO_UNITARIO_VENDA` — constantes e enums)
- 💾 **Exportação Multi-Formato:**
  - **CSV Padronizado:** Arquivo `.csv` limpo com encoding UTF-8 (com BOM) para compatibilidade perfeita no Excel.
  - **JSON Estruturado:** Array de objetos prontos para APIs REST e GraphQL.
  - **Script SQL Completo:** Gera automaticamente os comandos `CREATE TABLE` (com inferência de tipos `TEXT`, `NUMERIC`, `BIGINT`) e `INSERT INTO` em massa.
- ✏️ **Edição Inline de Colunas:** Possibilidade de renomear e customizar qualquer coluna individualmente antes de exportar.
- 👁️ **Visualização Prévia Instantânea:** Tabela responsiva com paginação e status visual das colunas originais vs. normalizadas.

---

## 🚀 Como Rodar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/marcelotpbezerra/excel-header-normalizer.git
cd excel-header-normalizer
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

### 4. Build de Produção
```bash
npm run build
```

---

## 🔒 Privacidade & Segurança de Dados

- **Zero Chamadas de API Backend:** O arquivo nunca faz upload para a internet.
- **Processamento via FileReader:** Análise direta do buffer de memória do navegador.
- **Conformidade LGPD/GDPR:** Ideal para manipular dados confidenciais de clientes sem risco de vazamento em servidores de terceiros.

---

## 👨‍💻 Autor & Conexões

Desenvolvido por **Marcelo Bezerra**  
- 🌐 Website: [marcelotpbezerra.com.br](https://marcelotpbezerra.com.br/)
- 📱 Linktree: [linktr.ee/marcelotpbezerra](https://linktr.ee/marcelotpbezerra)
- 🛠️ Git Soberano: [git.marcelotpbezerra.com.br](https://git.marcelotpbezerra.com.br/marcelo)

---

## 📄 Licença
Distribuído sob a licença MIT. Livre para uso pessoal e comercial.
EOF
