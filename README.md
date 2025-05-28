# Central Hospitalar Web

Sistema avançado de monitoramento hospitalar com IA para predição de sepse e prevenção de morte súbita.

## Características Principais

### 🏥 Dashboard de Monitoramento
- 16 monitores simulados com visualização em tempo real
- Prévia de curvas de ECG configuráveis
- Sinais vitais principais em cada card
- Pontuações EWS/MEWS com algoritmos de IA

### 📊 Visualização Detalhada
- Tela completa do monitor com todas as curvas
- Estatísticas e plots sobre os dados
- Detalhes sobre pontuação EWS/MEWS
- Justificativas para as pontuações

### 🚨 Sistema de Alarmes
- Alarmes padrão com sons configuráveis
- Possibilidade de mutar por dispositivo ou globalmente
- Diferentes níveis de severidade (Baixo, Médio, Alto, Crítico)
- Alertas visuais e sonoros

### 🤖 Algoritmos de IA Simulados
- Predição de sepse em tempo real
- Prevenção de morte súbita (PMS)
- Análise de risco baseada em sinais vitais
- Alertas urgentes automáticos

### 📈 Histórico e Relatórios
- Página dedicada ao histórico dos dados
- Filtros por data e monitor
- Geração de relatórios em formato texto
- Estatísticas e análises históricas

### 🎨 Design Profissional
- Interface em português
- Cores branco e vermelho (conformidade com área da saúde)
- Design responsivo para todos os dispositivos
- Modo escuro/claro automático
- Animações suaves com Framer Motion

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL com Prisma ORM
- **Charts**: Chart.js com react-chartjs-2
- **UI Components**: Radix UI, Lucide React Icons
- **Theme**: next-themes para modo escuro/claro

## Estrutura do Projeto

```
├── app/
│   ├── api/                 # API routes
│   │   ├── monitors/        # Endpoints dos monitores
│   │   ├── vital-signs/     # Endpoints dos sinais vitais
│   │   └── history/         # Endpoints do histórico
│   ├── monitor/[id]/        # Página de detalhes do monitor
│   ├── history/             # Página de histórico
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Dashboard principal
│   └── globals.css          # Estilos globais
├── components/
│   ├── ui/                  # Componentes UI reutilizáveis
│   ├── monitor-card.tsx     # Card do monitor
│   └── header.tsx           # Cabeçalho da aplicação
├── lib/
│   ├── db.ts                # Configuração do Prisma
│   └── utils.ts             # Utilitários e algoritmos
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
└── README.md
```

## Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd central-hospitalar-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Configure a variável DATABASE_URL no arquivo .env
echo "DATABASE_URL='postgresql://username:password@localhost:5432/central_hospitalar'" > .env

# Execute as migrações
npx prisma db push

# Gere o cliente Prisma
npx prisma generate
```

4. **Execute a aplicação**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Funcionalidades Detalhadas

### Dashboard Principal
- Visualização de 16 monitores em grid responsivo
- Cada monitor mostra:
  - Nome e localização
  - Informações do paciente
  - Prévia do ECG em tempo real
  - Sinais vitais atuais
  - Pontuações EWS/MEWS
  - Riscos de sepse e morte súbita
  - Status de alarmes

### Página de Detalhes do Monitor
- Visualização completa dos sinais vitais
- Gráficos de tendência histórica
- Análise detalhada das pontuações
- Justificativas dos algoritmos de IA
- Lista de alarmes ativos
- Informações do paciente

### Sistema de Alarmes
- **Tipos de alarme**:
  - VITAL_SIGN: Sinais vitais fora dos parâmetros
  - EWS_HIGH: Pontuação EWS elevada
  - SEPSIS_RISK: Alto risco de sepse
  - SUDDEN_DEATH_RISK: Alto risco de morte súbita
  - TECHNICAL: Problemas técnicos

- **Níveis de severidade**:
  - LOW: Monitoramento de rotina
  - MEDIUM: Atenção necessária
  - HIGH: Avaliação urgente
  - CRITICAL: Intervenção imediata

### Algoritmos de IA (Simulados)

#### EWS (Early Warning Score)
Baseado nos seguintes parâmetros:
- Frequência cardíaca
- Pressão arterial sistólica
- Frequência respiratória
- Temperatura
- Saturação de oxigênio

#### MEWS (Modified Early Warning Score)
Versão modificada do EWS com pesos diferentes para os parâmetros.

#### Predição de Sepse
Algoritmo que analisa:
- Sinais vitais
- Pontuações EWS/MEWS
- Tendências históricas
- Fatores de risco

#### Prevenção de Morte Súbita
Análise de risco baseada em:
- Padrões cardíacos
- Instabilidade hemodinâmica
- Deterioração clínica
- Fatores predisponentes

## Banco de Dados

### Schema Principal

```prisma
model Monitor {
  id          String   @id @default(cuid())
  name        String
  location    String
  isActive    Boolean  @default(true)
  patientName String?
  patientAge  Int?
  
  vitalSigns VitalSign[]
  alarms     Alarm[]
}

model VitalSign {
  id                String   @id @default(cuid())
  monitorId         String
  heartRate         Float
  bloodPressureSys  Float
  bloodPressureDia  Float
  respiratoryRate   Float
  temperature       Float
  oxygenSaturation  Float
  ewsScore          Int
  mewsScore         Int
  sepsisRisk        Float
  suddenDeathRisk   Float
  timestamp         DateTime @default(now())
  
  monitor Monitor @relation(fields: [monitorId], references: [id])
}

model Alarm {
  id          String      @id @default(cuid())
  monitorId   String
  type        AlarmType
  severity    AlarmSeverity
  message     String
  isActive    Boolean     @default(true)
  isMuted     Boolean     @default(false)
  timestamp   DateTime    @default(now())
  
  monitor Monitor @relation(fields: [monitorId], references: [id])
}
```

## API Endpoints

### Monitores
- `GET /api/monitors` - Lista todos os monitores
- `POST /api/monitors` - Cria monitores iniciais
- `GET /api/monitors/[id]` - Detalhes de um monitor
- `POST /api/monitors/[id]/mute` - Silencia alarmes do monitor

### Sinais Vitais
- `POST /api/vital-signs` - Atualiza sinais vitais de todos os monitores

### Histórico
- `GET /api/history` - Busca histórico com filtros
  - Query params: `monitorId`, `startDate`, `endDate`, `page`, `limit`

## Configurações de Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executa build de produção
npm run lint         # Executa linting
npm run db:push      # Aplica schema ao banco
npm run db:studio    # Abre Prisma Studio
npm run db:generate  # Gera cliente Prisma
```

### Variáveis de Ambiente
```env
DATABASE_URL="postgresql://username:password@localhost:5432/central_hospitalar"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Estrutura para Expansão Futura

O sistema foi projetado para facilitar a adição de:

### Dispositivos Reais
- Interface para conexão com monitores físicos
- Protocolos de comunicação (HL7, DICOM)
- Drivers para diferentes fabricantes

### Dados Reais
- Integração com sistemas hospitalares existentes
- APIs para prontuários eletrônicos
- Sincronização com laboratórios

### Algoritmos de IA Reais
- Modelos de machine learning treinados
- Integração com serviços de IA em nuvem
- Pipelines de dados para treinamento contínuo

### Internacionalização
- Sistema de tradução preparado
- Arquivos de idioma separados
- Configuração regional de formatos

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é uma Prova de Conceito (POC) para demonstração de capacidades técnicas em sistemas de monitoramento hospitalar.

## Suporte

Para dúvidas ou suporte, entre em contato através dos canais apropriados do projeto.

---

**Nota**: Este é um sistema de demonstração com dados simulados. Não deve ser usado em ambientes de produção médica sem as devidas certificações e validações regulatórias.