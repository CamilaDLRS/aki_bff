<div align="center">
	<h1>AKI! BFF (Backend-for-Frontend)</h1>
	<p>Backend de agregação entre serviços <strong>Personas</strong> e <strong>Core</strong>, estruturado em <em>Vertical Slice Architecture</em>.</p>
</div>

## 👩‍💻 Equipe / Alunos
| Nome |
|------|
| Camila Delarosa |
| Dimitri Prudente Delinski |
| Guilherme Belo |
| Yasmin Carmona |

## 🏗️ Visão Geral da Arquitetura
Adotamos <strong>Vertical Slice</strong>: cada capability (ex.: events, classes, attendance) encapsula seu controller + use case + DTOs específicos. Evita camadas horizontais anêmicas e reduz acoplamento transversal. Código compartilhado mínimo vive em `shared/`.

### Objetivos da Arquitetura
- Facilitar onboarding: localizar tudo de uma feature em um único lugar.
- Minimizar impacto de mudanças: alterar um slice não exige tocar em outros.
- Proteger limites: testes de arquitetura (TSArch) garantem que slices não se importam entre si.

### Camadas Lógicas
| Camada | Responsabilidade | Local |
|--------|------------------|-------|
| Interface (HTTP) | Boot Express, registra rotas | `src/interface/server.ts` |
| Feature Slice | Orquestra caso de uso e entrada HTTP | `src/features/<domínio>/<feature>/` |
| Use Case | Regras e coordenação de gateways | `useCase.ts` em cada slice |
| Gateways | Comunicação externa (HTTP) | `src/shared/infrastructure/gateways` |
| Shared | Tipos, logger e utilidades | `src/shared` |

### Regras (Convenções)
1. Um slice não importa código de outro slice.
2. Use cases não importam controllers.
3. `shared/` não referencia `features/`.
4. Gateways são o único lugar com chamadas HTTP externas.
5. Controllers somente traduzem HTTP ↔ uso do use case.

Estas regras são validadas automaticamente (ver seção Testes de Arquitetura).

## 📁 Estrutura Atual
```
src/
	features/
		attendance/
		events/
		classes/
		students/
		teachers/
	shared/
		dto.ts
		logger/
			index.ts
		infrastructure/
			gateways/
				CoreGateway.ts
				PersonasGateway.ts
	interface/
		server.ts
		swagger.ts
```

## 🔄 Migração para Vertical Slice
Antes: mistura de pastas `app/usecases`, `core/`, `interface/controllers` (arquitetura em camadas duplicada).
Depois: conteúdos migrados para `features/*` e diretórios legados removidos fisicamente. Restaram apenas stubs temporários que foram eliminados no processo de limpeza.

Benefícios observados:
- Remoção de duplicação de gateways/logger.
- Imports mais curtos via `tsconfig` paths.
- Testes de arquitetura garantindo isolamento.

## 🔍 Testes de Arquitetura (TSArch)
Executados via:
```bash
npm run test:arch
```
Regras avaliadas:
- Independência entre slices.
- Ausência de ciclos internos em cada slice.
- Controllers não importam outros controllers.
- Use cases não importam controllers.
- Shared não depende de features.
- Interface não depende de diretórios deprecados (`app/`, `core/`).

## 🚀 Executando o Projeto
1. Instale dependências:
	 ```bash
	 npm install
	 ```
2. Crie `.env` (se necessário):
	 ```env
	 CORE_URL=http://localhost:3001
	 PERSONAS_URL=http://localhost:3002
	 PORT=3000
	 ```
3. Build & start:
	 ```bash
	 npm run build && npm start
	 ```
4. Desenvolvimento hot-reload:
	 ```bash
	 npm run dev
	 ```

Se os serviços externos não estiverem rodando, endpoints que dependem deles responderão 503 (gateway mapeia ECONNREFUSED).

## 🧪 Testes
| Tipo | Comando |
|------|---------|
| Arquitetura | `npm run test:arch` |

Adicionar testes unitários funcionais (ex.: Jest) segue padrão `tests/`.

## 🧱 Endpoints Principais
| Recurso | Método & Rota | Descrição |
|---------|---------------|-----------|
| Classes | GET `/teachers/:teacherEmail/classes` | Lista classes do professor |
| Classes | GET `/classes/:classId` | Detalhes da turma + eventos recentes |
| Eventos | GET `/classes/:classId/events` | Lista eventos da turma |
| Eventos | GET `/events/:eventId` | Detalhes + presença |
| Eventos | POST `/events` | Cria evento |
| Attendance | POST `/events/attendance` | Registra presença (QR / device) |
| Students | DELETE `/students/:studentId/device` | Remove vínculo de dispositivo |
| Teachers | POST `/auth/login` | Login docente |
| Teachers | POST `/auth/recover-password` | Recuperação de senha |

## 🧪 Exemplo (Criar Evento)
Request:
```http
POST /events
Content-Type: application/json
{
	"classId": 42,
	"teacherId": 9,
	"startAt": "2025-11-08T13:00:00Z",
	"endAt": "2025-11-08T14:00:00Z",
	"location": { "latitude": -23.55052, "longitude": -46.633308 }
}
```
Response (201):
```json
{
	"id": "<event-id>",
	"classId": 42,
	"teacherId": 9,
	"startAt": "2025-11-08T13:00:00Z",
	"endAt": "2025-11-08T14:00:00Z",
	"status": "active",
	"location": { "latitude": -23.55052, "longitude": -46.633308 },
	"qrToken": "<qr-token>",
	"createdAt": "2025-11-08T12:55:00Z",
	"updatedAt": "2025-11-08T12:55:00Z"
}
```

## 🧭 Convenções de Código
- `useCase.ts`: deve conter apenas lógica de orquestração/regra, sem código HTTP.
- `controller.ts`: valida entrada → chama use case → formata saída.
- `gateway`: única camada que chama serviços externos (Axios). Retries e mapeamento de indisponibilidade para 503.
- DTOs cross-slice mínimos em `shared/dto.ts`.

## 🧹 Diretórios Legados
Os diretórios `app/`, `core/` e `interface/controllers/` foram substituídos pela organização em `features/`. Arquivos antigos foram removidos para evitar confusão e asserções de arquitetura garantem que não retornem.

## 🔐 Próximos Melhoramentos (Roadmap)
- Mocks embutidos para `Core` e `Personas` (dev offline).
- Adicionar testes unitários / integração por slice.
- Circuit breaker básico nos gateways.

## 📄 Licença
Uso acadêmico / interno. Ajustar conforme necessidade institucional.

---
Versão: 2.0.0  
Última atualização: 11 Nov 2025

