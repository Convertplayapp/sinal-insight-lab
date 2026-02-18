import { motion } from 'framer-motion';
import { Download, CheckCircle2, AlertTriangle, Heart, BookOpen, MessageCircle, ShieldAlert, Lightbulb, Star } from 'lucide-react';
import { Result, levelLabels, levelColors } from '@/lib/scoring';
import { Pillar, pillarLabels, pillarIcons, pillarDescriptions } from '@/data/questions';
import logoBlack from '@/assets/logo-black.png';

interface FullResultProps {
  result: Result;
  showSuccess?: boolean;
}

/* ─── Interpretações dinâmicas por pilar e faixa ─── */
const pillarInterpretations: Record<Pillar, { high: string; mid: string; low: string }> = {
  S: {
    high: 'Você sente que precisa se proteger emocionalmente dentro do relacionamento. Isso indica que o espaço entre vocês não está sendo seguro para vulnerabilidade — e isso não é frescura. Quando a gente não pode ser quem é perto de quem ama, a gente vai se apagando aos poucos.',
    mid: 'Existem momentos em que você consegue se abrir, mas em outros sente que precisa segurar o que sente. Essa inconsistência pode gerar confusão emocional e desgaste silencioso.',
    low: 'Você demonstra sentir segurança emocional na relação. Isso é um pilar fundamental para a saúde do vínculo entre vocês.',
  },
  I: {
    high: 'Há um padrão forte de dependência emocional. Você pode estar abrindo mão de quem você é para manter a relação funcionando — e esse é um dos sinais mais silenciosos e perigosos de um relacionamento desequilibrado.',
    mid: 'Você demonstra alguma dificuldade em manter sua individualidade. Perceba se está tomando decisões baseadas no que ele vai achar, e não no que você realmente quer.',
    low: 'Você consegue manter sua identidade e autonomia dentro da relação. Continue cultivando seus interesses e espaços individuais.',
  },
  N: {
    high: 'A comunicação entre vocês está significativamente comprometida. Quando você tenta falar, a conversa é desviada, minimizada ou vira ataque. Isso não é "jeito dele" — é um padrão que te silencia.',
    mid: 'Vocês conseguem conversar sobre alguns assuntos, mas temas sensíveis tendem a ser evitados ou geram conflito desproporcional. Isso pode estar criando assuntos "proibidos" na relação.',
    low: 'A comunicação entre vocês funciona de forma saudável. Vocês conseguem abordar temas difíceis com respeito mútuo.',
  },
  A: {
    high: 'Existe um desequilíbrio importante no apoio e respeito. Suas conquistas são minimizadas, suas opiniões desconsideradas. Quando a pessoa que deveria te apoiar é quem te diminui, o impacto é profundo.',
    mid: 'Há momentos de apoio, mas também situações em que você sente que sua voz não tem o mesmo peso. Essa dinâmica pode estar corroendo sua autoestima de forma sutil.',
    low: 'Vocês demonstram um bom nível de apoio mútuo e respeito. Continuem celebrando as conquistas um do outro.',
  },
  L: {
    high: 'Sua liberdade pessoal está sendo significativamente restrita. Vigilância, controle de comportamento e mudança forçada de hábitos são sinais claros de um relacionamento que precisa de atenção urgente.',
    mid: 'Você percebe certa restrição na sua liberdade, mesmo que sutil. Talvez mude seu comportamento para "não dar problema". Essa adaptação constante é um sinal de alerta.',
    low: 'Você sente liberdade para ser quem é dentro da relação. Esse espaço para individualidade é essencial para um vínculo saudável.',
  },
};

const getPillarInterpretation = (pillar: Pillar, percentage: number) => {
  if (percentage >= 65) return pillarInterpretations[pillar].high;
  if (percentage >= 35) return pillarInterpretations[pillar].mid;
  return pillarInterpretations[pillar].low;
};

/* ─── Plano de ação adaptado por faixa ─── */
const actionPlans: Record<Pillar, { high: string[]; mid: string[]; low: string[] }> = {
  S: {
    high: [
      'Identifique 3 situações recentes em que você quis falar algo e não falou. Escreva o que sentiu.',
      'Considere conversar com uma amiga de confiança ou profissional sobre o que está vivendo.',
      'Estabeleça um "diário emocional" — escrever ajuda a processar o que não conseguimos dizer.',
    ],
    mid: [
      'Pratique expressar um sentimento pequeno por dia, mesmo que pareça bobo.',
      'Observe quando você "edita" o que vai falar. Pergunte-se: por que estou me censurando?',
      'Crie momentos intencionais de conversa leve para fortalecer a conexão.',
    ],
    low: [
      'Continue praticando a vulnerabilidade — ela fortalece o vínculo.',
      'Reserve momentos para conversas mais profundas sobre sentimentos.',
      'Demonstre apreciação quando seu parceiro também se abrir com você.',
    ],
  },
  I: {
    high: [
      'Liste 5 coisas que você gostava de fazer antes do relacionamento e que parou de fazer.',
      'Comece a retomar UMA dessas atividades esta semana, sem pedir permissão.',
      'Pergunte-se: "Se eu estivesse solteira, qual decisão eu tomaria?" Use isso como bússola.',
    ],
    mid: [
      'Pratique tomar uma decisão por dia sem consultar ou "checar" com ele.',
      'Mantenha pelo menos uma atividade que seja só sua — academia, hobby, amizade.',
      'Observe se você está buscando aprovação antes de agir. Quando perceber, pause e reflita.',
    ],
    low: [
      'Continue investindo nos seus interesses pessoais e amizades.',
      'Incentive o espaço individual do parceiro também — é saudável para ambos.',
      'Celebre suas próprias conquistas antes de buscar validação externa.',
    ],
  },
  N: {
    high: [
      'Antes de iniciar uma conversa difícil, escreva seus pontos principais em um papel.',
      'Use a técnica do "eu sinto": "Quando acontece X, eu sinto Y, e gostaria que Z".',
      'Se a conversa escalar, diga: "Preciso de um momento para me organizar. Podemos retomar em 30 minutos?"',
    ],
    mid: [
      'Identifique os "assuntos proibidos" da relação. Eles são pistas do que precisa ser dito.',
      'Pratique escuta ativa: repita o que ouviu antes de dar sua opinião.',
      'Agendem conversas importantes — evitem abordar temas sérios em momentos de estresse.',
    ],
    low: [
      'Continuem praticando a comunicação aberta e respeitosa.',
      'Experimentem novas formas de se conectar: cartas, mensagens sinceras.',
      'Celebrem quando conseguirem resolver um conflito de forma construtiva.',
    ],
  },
  A: {
    high: [
      'Anote suas conquistas diárias, por menores que sejam. A validação precisa vir de você primeiro.',
      'Quando sentir que sua opinião foi desconsiderada, diga: "Isso é importante pra mim e preciso ser ouvida."',
      'Avalie: nas decisões do casal, quantas vezes sua vontade prevaleceu? Esse equilíbrio importa.',
    ],
    mid: [
      'Pratique expressar sua opinião mesmo quando diferir da dele.',
      'Peça reconhecimento quando fizer algo importante. Você merece ser vista.',
      'Observe padrões: você está sempre cedendo? Onde está seu limite?',
    ],
    low: [
      'Continue celebrando as conquistas um do outro genuinamente.',
      'Pratiquem a gratidão diária — reconhecer o esforço do outro fortalece o vínculo.',
      'Mantenham o equilíbrio nas decisões do casal.',
    ],
  },
  L: {
    high: [
      'Seu celular, suas roupas, suas amizades e seus horários são SEUS. Isso não é negociável.',
      'Se você mudou seu jeito de ser para evitar conflito, isso é um sinal vermelho sério.',
      'Converse com alguém de fora da relação sobre o que está vivendo. Perspectiva externa é essencial.',
    ],
    mid: [
      'Identifique em quais áreas você sente que precisa "pedir licença" para ser você mesma.',
      'Resgate um hábito ou amizade que ficou em segundo plano por causa da relação.',
      'Lembre-se: parceria saudável não exige que você abra mão de quem você é.',
    ],
    low: [
      'Continue preservando seu espaço individual dentro da relação.',
      'Incentive o parceiro a também cultivar seus próprios interesses.',
      'Mantenham o respeito mútuo pela individualidade de cada um.',
    ],
  },
};

const getActionPlan = (pillar: Pillar, percentage: number) => {
  if (percentage >= 65) return actionPlans[pillar].high;
  if (percentage >= 35) return actionPlans[pillar].mid;
  return actionPlans[pillar].low;
};

/* ─── Guia de Sinais de Alerta (bônus prometido) ─── */
const warningSignsGuide = [
  {
    category: 'Sinais de Controle',
    icon: '🚩',
    signs: [
      'Verifica constantemente seu celular, redes sociais ou mensagens',
      'Controla como você se veste, onde vai ou com quem sai',
      'Decide sozinho questões que afetam vocês dois',
      'Usa o dinheiro como forma de poder ou controle',
    ],
  },
  {
    category: 'Sinais de Manipulação Emocional',
    icon: '🎭',
    signs: [
      'Faz você se sentir culpada por coisas que não são sua responsabilidade',
      'Usa o silêncio como punição (tratamento de gelo)',
      'Distorce situações para que você sempre pareça estar errada (gaslighting)',
      'Alterna entre ser extremamente carinhoso e distante/agressivo',
    ],
  },
  {
    category: 'Sinais de Isolamento',
    icon: '🔒',
    signs: [
      'Dificulta ou critica seu convívio com amigos e família',
      'Faz você se sentir culpada quando quer tempo para si',
      'Cria situações que te afastam das pessoas que te apoiam',
      'Quer ser sua única fonte de afeto e validação',
    ],
  },
  {
    category: 'Sinais de Desrespeito',
    icon: '💔',
    signs: [
      'Minimiza seus sentimentos com frases como "você é sensível demais"',
      'Faz piadas que te humilham, especialmente na frente de outros',
      'Ignora seus limites ou descarta seus pedidos',
      'Compara você com outras pessoas de forma negativa',
    ],
  },
];

/* ─── Reflexão guiada ─── */
const getReflectionQuestions = (percentage: number) => {
  if (percentage >= 65) {
    return [
      'Se uma amiga sua estivesse vivendo exatamente o que você vive, o que você diria pra ela?',
      'Quais partes de você ficaram "para trás" desde o início desse relacionamento?',
      'Você se sente mais leve quando ele não está por perto? O que isso significa?',
      'Se você pudesse mudar uma coisa na dinâmica de vocês, sem medo da reação dele, o que seria?',
    ];
  }
  if (percentage >= 35) {
    return [
      'Em quais momentos você se sente mais à vontade para ser você mesma na relação?',
      'Existe algo que você gostaria de falar, mas ainda não encontrou coragem? O que te impede?',
      'Como você se sentia sobre si mesma antes desse relacionamento? Algo mudou?',
      'O que te faria sentir mais valorizada e ouvida na relação?',
    ];
  }
  return [
    'Quais são os pontos fortes da relação de vocês que você mais valoriza?',
    'Existe algum aspecto que vocês poderiam investir mais atenção?',
    'Como você se sente sobre sua individualidade dentro da relação?',
    'O que vocês poderiam fazer para continuar crescendo juntos?',
  ];
};

/* ─── Frases assertivas adaptadas ─── */
const getAssertivePhrases = (percentage: number) => {
  if (percentage >= 65) {
    return [
      '"Eu preciso te falar algo que está me incomodando há um tempo. Preciso que você me escute até o fim."',
      '"Quando você faz isso, eu me sinto diminuída. E isso não é aceitável pra mim."',
      '"Eu te amo, mas não vou abrir mão de quem eu sou. Preciso que você respeite isso."',
      '"Essa situação está me machucando. Se não mudar, vou precisar repensar o que é melhor pra mim."',
      '"Eu mereço ser tratada com respeito. Sempre. Sem exceção."',
    ];
  }
  if (percentage >= 35) {
    return [
      '"Preciso te falar algo importante. Podemos conversar com calma?"',
      '"Quando isso acontece, eu me sinto... e gostaria que pudéssemos encontrar um caminho."',
      '"Eu valorizo nosso relacionamento e quero que a gente cresça junto."',
      '"Preciso de um tempo para organizar meus pensamentos. Podemos retomar depois?"',
      '"Eu entendo seu ponto de vista, e ao mesmo tempo, sinto que preciso ser ouvida também."',
    ];
  }
  return [
    '"Fico feliz que a gente consiga conversar sobre isso de forma aberta."',
    '"Eu aprecio quando você me ouve com atenção. Isso me faz sentir segura."',
    '"Vamos continuar mantendo esse espaço de diálogo — faz bem pra nós dois."',
    '"Obrigada por respeitar meus limites. Isso fortalece o que temos."',
  ];
};

/* ─── Checklist adaptado ─── */
const getChecklist = (percentage: number) => {
  if (percentage >= 65) {
    return [
      'Reconheço que mereço um relacionamento onde me sinta segura',
      'Identifico os padrões que me fazem mal nessa relação',
      'Tenho pelo menos uma pessoa de confiança com quem posso falar',
      'Sei que pedir ajuda não é fraqueza, é coragem',
      'Entendo que amor não justifica desrespeito',
      'Estou disposta a colocar minha saúde emocional em primeiro lugar',
      'Conheço os canais de apoio disponíveis (CVV: 188 | Ligue 180)',
    ];
  }
  if (percentage >= 35) {
    return [
      'Comunico minhas necessidades com clareza e respeito',
      'Respeito os limites do(a) meu(minha) parceiro(a)',
      'Não abro mão dos meus valores para evitar conflitos',
      'Permito que ambos tenham tempo e espaço individual',
      'Busco resolver conflitos de forma construtiva',
      'Reconheço sinais de desrespeito e ajo com firmeza',
    ];
  }
  return [
    'Mantenho minha individualidade dentro da relação',
    'Comunico o que sinto sem medo de julgamento',
    'Celebro as conquistas do meu parceiro genuinamente',
    'Respeito o espaço e os limites de cada um',
    'Invisto na relação sem me anular',
    'Tenho vida social e interesses próprios saudáveis',
  ];
};

const getChecklistTitle = (percentage: number) => {
  if (percentage >= 65) return 'Checklist de Autocuidado e Proteção';
  if (percentage >= 35) return 'Checklist de Limites Saudáveis';
  return 'Checklist de Manutenção do Relacionamento';
};

/* ─── Mensagem de abertura ─── */
const getResultMessage = (percentage: number) => {
  if (percentage >= 70)
    return 'Seu resultado revela padrões que merecem atenção real. Reconhecer esses sinais é um ato de coragem — e agora você tem clareza para agir com consciência. Este diagnóstico foi feito para te ajudar a enxergar o que talvez você já sentia, mas não conseguia nomear.';
  if (percentage >= 40)
    return 'Existem dinâmicas no seu relacionamento que podem estar te afetando mais do que você percebe. Esse diagnóstico vai te ajudar a entender cada uma delas, dar nome ao que você sente, e fortalecer sua posição.';
  return 'Seu relacionamento demonstra uma base saudável. Confira os detalhes de cada pilar para manter e fortalecer o que já funciona bem. Mesmo em relações saudáveis, sempre há espaço para crescimento.';
};

/* ─── Componente ─── */
const FullResult = ({ result, showSuccess }: FullResultProps) => {
  const levelColor = levelColors[result.level];
  const pct = result.percentage;
  const sortedPillars = [...result.pillarScores].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {showSuccess && (
          <div className="mb-6 text-center text-xs text-accent font-body">
            ✅ Diagnóstico completo liberado com sucesso.
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <img
            src={logoBlack}
            alt="Método SINAL"
            className="w-44 md:w-52 mx-auto mb-4 opacity-90"
            loading="lazy"
          />
          <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-2 block">
            Diagnóstico Completo — Método SINAL
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Seu Resultado Personalizado
          </h1>
          <p className="font-body text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            {getResultMessage(pct)}
          </p>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={levelColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * pct) / 100 }}
                transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-display text-3xl font-bold text-foreground block">{pct}%</span>
              <span className="font-body text-xs text-muted-foreground">{levelLabels[result.level]}</span>
            </div>
          </div>
        </motion.div>

        {/* ─── SEÇÃO 1: Análise Detalhada dos 5 Pilares ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Análise Detalhada dos 5 Pilares
            </h2>
          </div>

          <div className="space-y-5">
            {result.pillarScores.map((p, i) => (
              <motion.div
                key={p.pillar}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="card-gradient rounded-xl shadow-card p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="text-xl">{pillarIcons[p.pillar]}</span>
                    {pillarLabels[p.pillar]}
                  </span>
                  <span
                    className="font-body text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      background: p.percentage >= 65 ? 'hsl(0 70% 95%)' : p.percentage >= 35 ? 'hsl(40 90% 93%)' : 'hsl(150 50% 93%)',
                      color: p.percentage >= 65 ? 'hsl(0 70% 40%)' : p.percentage >= 35 ? 'hsl(40 70% 35%)' : 'hsl(150 50% 30%)',
                    }}
                  >
                    {p.percentage}%
                  </span>
                </div>
                <p className="font-body text-xs text-muted-foreground mb-3">{pillarDescriptions[p.pillar]}</p>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${levelColor}, hsl(var(--accent)))` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percentage}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="font-body text-sm text-foreground/85 leading-relaxed">
                  {getPillarInterpretation(p.pillar, p.percentage)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── SEÇÃO 2: Plano de Ação Personalizado ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Plano de Ação Personalizado
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            Baseado nos seus 3 pilares que mais precisam de atenção:
          </p>
          <div className="space-y-6">
            {sortedPillars.slice(0, 3).map((p) => (
              <div key={p.pillar} className="card-gradient rounded-xl shadow-card p-6">
                <h4 className="font-body text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span>{pillarIcons[p.pillar]}</span>
                  {pillarLabels[p.pillar]} — {p.percentage}%
                </h4>
                <ul className="space-y-3">
                  {getActionPlan(p.pillar, p.percentage).map((action, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-body text-sm text-foreground/80 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── SEÇÃO 3: Bônus — Guia de Sinais de Alerta ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Guia Rápido de Sinais de Alerta
            </h2>
          </div>
          <p className="text-center text-xs text-accent font-body mb-6 uppercase tracking-widest">
            ⭐ Bônus exclusivo
          </p>
          <div className="space-y-4">
            {warningSignsGuide.map((group, i) => (
              <div key={i} className="card-gradient rounded-xl shadow-card p-6">
                <h4 className="font-body text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-lg">{group.icon}</span>
                  {group.category}
                </h4>
                <ul className="space-y-2">
                  {group.signs.map((sign, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="font-body text-sm text-foreground/80">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── SEÇÃO 4: Reflexão Guiada ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <Heart className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Reflexão Guiada
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            Reserve um momento de calma para refletir honestamente sobre essas perguntas:
          </p>
          <div className="card-gradient rounded-xl shadow-card p-6 space-y-5">
            {getReflectionQuestions(pct).map((question, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent">{i + 1}</span>
                </span>
                <p className="font-body text-sm text-foreground/85 leading-relaxed italic">{question}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── SEÇÃO 5: Frases para Conversas Difíceis ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <MessageCircle className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Frases Prontas para Usar
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            Copie e adapte essas frases para conversas que você precisa ter:
          </p>
          <div className="card-gradient rounded-xl shadow-card p-6 space-y-4">
            {getAssertivePhrases(pct).map((phrase, i) => (
              <p key={i} className="font-body text-sm text-foreground/80 italic border-l-2 border-accent/40 pl-4 leading-relaxed">
                {phrase}
              </p>
            ))}
          </div>
        </motion.div>

        {/* ─── SEÇÃO 6: Checklist ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <Star className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              {getChecklistTitle(pct)}
            </h2>
          </div>
          <p className="text-center text-xs text-accent font-body mb-6 uppercase tracking-widest">
            ⭐ Bônus exclusivo — Checklist em PDF
          </p>
          <div className="card-gradient rounded-xl shadow-card p-6 space-y-3">
            {getChecklist(pct).map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="font-body text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* ─── Apoio emocional (para pontuações altas) ─── */}
        {pct >= 60 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
            className="mb-12"
          >
            <div className="card-gradient rounded-xl shadow-card p-6 border border-accent/20">
              <h3 className="font-display text-lg font-bold text-foreground mb-3 text-center">
                💜 Você não está sozinha
              </h3>
              <p className="font-body text-sm text-foreground/80 leading-relaxed text-center mb-4">
                Se em algum momento você sentir que precisa de ajuda, existem canais seguros e gratuitos que podem te acolher:
              </p>
              <div className="space-y-2 text-center">
                <p className="font-body text-sm font-semibold text-foreground">
                  📞 CVV — Centro de Valorização da Vida: <span className="text-accent">188</span>
                </p>
                <p className="font-body text-sm font-semibold text-foreground">
                  📞 Ligue 180 — Central de Atendimento à Mulher
                </p>
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Ambos funcionam 24h, são gratuitos e sigilosos.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Download ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="accent-gradient text-accent-foreground font-body font-semibold px-8 py-4 rounded-full text-base shadow-glow transition-all duration-300 inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Salvar Resultado Completo (PDF)
          </motion.button>
          <p className="text-xs text-muted-foreground mt-3 font-body">
            Use Ctrl+P ou Cmd+P para salvar como PDF
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FullResult;
