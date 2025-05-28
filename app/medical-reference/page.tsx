'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets,
  Zap,
  AlertTriangle,
  Info,
  TrendingUp,
  FileText
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

// Type definitions for medical content
interface MedicalImage {
  src: string
  alt: string
  caption: string
}

interface ScoringItem {
  parameter: string
  ranges: string[]
}

interface InterpretationItem {
  score: string
  action: string
}

interface ContentSection {
  title: string
  description?: string
  scoring?: ScoringItem[]
  interpretation?: InterpretationItem[]
  criteria?: string[]
  signs?: string[]
  algorithm?: string[]
}

interface AgeGroup {
  group: string
  values: Record<string, string>
}

interface MedicalContentItem {
  title: string
  description: string
  images?: MedicalImage[]
  content?: ContentSection[]
  ageGroups?: AgeGroup[]
  normalValues: Record<string, string>
}

type MedicalContentType = Record<string, MedicalContentItem>

export default function MedicalReferencePage() {
  const [globalMute, setGlobalMute] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('ecg')

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const handleGlobalMuteToggle = () => {
    setGlobalMute(!globalMute)
  }

  const categories = [
    { id: 'ecg', label: 'ECG', icon: Heart },
    { id: 'pressure', label: 'Pressão Arterial', icon: Activity },
    { id: 'oxygen', label: 'Saturação O₂', icon: Droplets },
    { id: 'respiratory', label: 'Respiratório', icon: Zap },
    { id: 'scores', label: 'EWS/MEWS', icon: FileText },
    { id: 'sepsis', label: 'Sepse', icon: AlertTriangle },
    { id: 'vitals', label: 'Sinais Vitais', icon: TrendingUp }
  ]

  const medicalContent: MedicalContentType = {
    ecg: {
      title: 'Eletrocardiograma (ECG)',
      description: 'O ECG é um exame que registra a atividade elétrica do coração, permitindo detectar arritmias, isquemias e outras alterações cardíacas.',
      images: [
        {
          src: 'https://ecgwaves.com/wp-content/uploads/2017/05/normal-ecg-waves-p-qrs-q-r-s-t-wave-complex-pr-st-t-interval-duration-1536x1358.png',
          alt: 'ECG Normal com ondas P, QRS e T',
          caption: 'ECG normal mostrando as ondas P, QRS e T com intervalos normais'
        },
        {
          src: 'https://ecgwaves.com/wp-content/uploads/2021/06/ECG-example-Normal-ECG-with-sinus-rhythm-2-1396x1536.png',
          alt: 'ECG Normal com Ritmo Sinusal',
          caption: 'Exemplo de ECG normal com ritmo sinusal regular'
        },
        {
          src: 'https://litfl.com/wp-content/uploads/2018/08/ECG-ventricular-fibrillation-VF-rhythm-strips.jpg',
          alt: 'Fibrilação Ventricular',
          caption: 'Fibrilação ventricular - emergência médica que requer desfibrilação imediata'
        },
        {
          src: 'https://litfl.com/wp-content/uploads/2018/08/Monomorphic-ventricular-tachycardia-VT-3.jpg',
          alt: 'Taquicardia Ventricular',
          caption: 'Taquicardia ventricular monomórfica - requer intervenção imediata'
        }
      ],
      normalValues: {
        'Frequência Cardíaca': '60-100 bpm',
        'Intervalo PR': '120-200 ms',
        'Complexo QRS': '<120 ms',
        'Intervalo QT': '350-450 ms'
      }
    },
    pressure: {
      title: 'Pressão Arterial',
      description: 'A pressão arterial é a força exercida pelo sangue contra as paredes das artérias durante os batimentos cardíacos.',
      images: [
        {
          src: 'https://www.derangedphysiology.com/main/sites/default/files/sites/default/files/CICM%20Primary/G%20Cardiovascular%20system/Components%20of%20the%20arterial%20pressure%20waveform.JPG',
          alt: 'Curva de Pressão Arterial',
          caption: 'Componentes da curva de pressão arterial mostrando sístole e diástole'
        },
        {
          src: 'https://rebelem.com/wp-content/uploads/2022/06/Underdamped-Arterial-Waveform.png',
          alt: 'Curva de Pressão Arterial Underdamped',
          caption: 'Curva de pressão arterial com características de underdamping'
        },
        {
          src: 'https://rtmvitalsigns.com/wp-content/uploads/2014/08/arterial-pressure-waveform.jpg',
          alt: 'Forma de Onda da Pressão Arterial',
          caption: 'Forma de onda típica da pressão arterial invasiva'
        }
      ],
      normalValues: {
        'Pressão Sistólica': '90-129 mmHg',
        'Pressão Diastólica': '60-84 mmHg',
        'Pressão Arterial Média': '70-100 mmHg',
        'Pressão de Pulso': '30-50 mmHg'
      }
    },
    oxygen: {
      title: 'Saturação de Oxigênio (SpO₂)',
      description: 'A saturação de oxigênio mede a porcentagem de hemoglobina saturada com oxigênio no sangue.',
      images: [
        {
          src: 'https://i.pinimg.com/736x/f9/a4/af/f9a4afed60282c4c8fc4ebf140740e32.jpg',
          alt: 'Curva de Plestimografia',
          caption: 'Curva de plestimografia mostrando a pulsação arterial'
        },
        {
          src: 'https://www.amperordirect.com/mm5/website_v3/products/medchoice/plethgraph.jpg',
          alt: 'Plestimografia Normal',
          caption: 'Plestimografia normal com boa amplitude de pulso'
        },
        {
          src: 'https://ai2-s2-public.s3.amazonaws.com/figures/2017-08-08/6a1aff822821d1722722cfd5a9f365f29ca2ff77/2-Figure2-1.png',
          alt: 'Análise de Plestimografia',
          caption: 'Análise detalhada da curva de plestimografia'
        }
      ],
      normalValues: {
        'SpO₂ Normal': '95-100%',
        'SpO₂ em DPOC': '88-92%',
        'Hipóxia Leve': '90-94%',
        'Hipóxia Grave': '<90%'
      }
    },
    respiratory: {
      title: 'Monitoramento Respiratório',
      description: 'O monitoramento respiratório inclui frequência respiratória e capnografia para avaliar a ventilação.',
      images: [
        {
          src: 'https://www.respiratorytherapyzone.com/wp-content/uploads/2022/10/Types-of-Scalar-Waveforms.png',
          alt: 'Tipos de Curvas Respiratórias',
          caption: 'Diferentes tipos de curvas respiratórias em ventilação mecânica'
        },
        {
          src: 'https://www.normalbreathing.com/wp-content/uploads/2019/07/normal-breathing-pattern-time.png',
          alt: 'Padrão Respiratório Normal',
          caption: 'Padrão respiratório normal ao longo do tempo'
        },
        {
          src: 'https://i.pinimg.com/originals/80/7c/fa/807cfa9efc6156288de9f78c3bcef396.png',
          alt: 'Capnografia',
          caption: 'Curva de capnografia mostrando CO₂ expirado'
        },
        {
          src: 'https://infiniummedical.com/wp-content/uploads/2021/02/reading-capnography-waveform-1024x683.png',
          alt: 'Leitura de Capnografia',
          caption: 'Como interpretar a curva de capnografia'
        }
      ],
      normalValues: {
        'Frequência Respiratória': '12-20 rpm',
        'ETCO₂': '35-45 mmHg',
        'Volume Corrente': '6-8 mL/kg',
        'Complacência': '50-100 mL/cmH₂O'
      }
    },
    scores: {
      title: 'Sistemas de Pontuação EWS/MEWS',
      description: 'Sistemas de alerta precoce para identificar deterioração clínica em pacientes hospitalizados.',
      content: [
        {
          title: 'Early Warning Score (EWS)',
          description: 'Sistema de pontuação baseado em sinais vitais para identificar pacientes em risco de deterioração.',
          scoring: [
            { parameter: 'Frequência Respiratória', ranges: ['<8 (3pts)', '9-11 (1pt)', '12-20 (0pts)', '21-24 (2pts)', '>25 (3pts)'] },
            { parameter: 'Saturação O₂', ranges: ['<91% (3pts)', '92-93% (2pts)', '94-95% (1pt)', '>96% (0pts)'] },
            { parameter: 'Pressão Sistólica', ranges: ['<90 (3pts)', '91-100 (2pts)', '101-110 (1pt)', '111-219 (0pts)', '>220 (3pts)'] },
            { parameter: 'Frequência Cardíaca', ranges: ['<40 (3pts)', '41-50 (1pt)', '51-90 (0pts)', '91-110 (1pt)', '111-130 (2pts)', '>131 (3pts)'] },
            { parameter: 'Temperatura', ranges: ['<35°C (3pts)', '35.1-36°C (1pt)', '36.1-38°C (0pts)', '38.1-39°C (1pt)', '>39.1°C (2pts)'] }
          ]
        },
        {
          title: 'Modified Early Warning Score (MEWS)',
          description: 'Versão modificada do EWS com diferentes pesos para os parâmetros vitais.',
          interpretation: [
            { score: '0-2', action: 'Monitoramento de rotina a cada 12 horas' },
            { score: '3-4', action: 'Aumentar frequência de monitoramento para 4-6 horas' },
            { score: '5-6', action: 'Avaliação médica urgente, monitoramento a cada hora' },
            { score: '≥7', action: 'Emergência médica, considerar UTI, monitoramento contínuo' }
          ]
        }
      ],
      normalValues: {
        'EWS Baixo': '0-2 pontos',
        'EWS Moderado': '3-4 pontos',
        'EWS Alto': '5-6 pontos',
        'EWS Crítico': '≥7 pontos'
      }
    },
    sepsis: {
      title: 'Predição de Sepse',
      description: 'A sepse é uma resposta sistêmica grave à infecção que pode levar à disfunção orgânica e morte.',
      content: [
        {
          title: 'Critérios de Sepse (Sepsis-3)',
          criteria: [
            'Infecção suspeita ou confirmada',
            'Aumento do SOFA ≥2 pontos',
            'Disfunção orgânica aguda'
          ]
        },
        {
          title: 'Sinais de Alerta Precoce',
          signs: [
            'Febre >38°C ou hipotermia <36°C',
            'Taquicardia >90 bpm',
            'Taquipneia >20 rpm',
            'Leucocitose >12.000 ou leucopenia <4.000',
            'Alteração do estado mental',
            'Hipotensão arterial',
            'Lactato elevado'
          ]
        },
        {
          title: 'Algoritmo de IA para Predição',
          algorithm: [
            'Análise contínua de sinais vitais',
            'Monitoramento de tendências',
            'Correlação com fatores de risco',
            'Cálculo de probabilidade de sepse',
            'Alerta automático quando risco >50%'
          ]
        }
      ],
      normalValues: {
        'Risco Baixo': '<30%',
        'Risco Moderado': '30-70%',
        'Risco Alto': '70-90%',
        'Risco Crítico': '>90%'
      }
    },
    vitals: {
      title: 'Sinais Vitais por Faixa Etária',
      description: 'Valores normais dos sinais vitais variam conforme a idade do paciente.',
      ageGroups: [
        {
          group: 'Bebês (0-1 ano)',
          values: {
            'Frequência Cardíaca': '100-160 bpm',
            'Frequência Respiratória': '30-60 rpm',
            'Pressão Arterial': '70-100/50-70 mmHg',
            'Temperatura': '36.5-37.2°C'
          }
        },
        {
          group: 'Crianças (1-12 anos)',
          values: {
            'Frequência Cardíaca': '80-120 bpm',
            'Frequência Respiratória': '20-30 rpm',
            'Pressão Arterial': '90-110/60-80 mmHg',
            'Temperatura': '36.5-37.2°C'
          }
        },
        {
          group: 'Adultos (18-65 anos)',
          values: {
            'Frequência Cardíaca': '60-100 bpm',
            'Frequência Respiratória': '12-20 rpm',
            'Pressão Arterial': '90-129/60-84 mmHg',
            'Temperatura': '36.5-37.2°C'
          }
        },
        {
          group: 'Idosos (>65 anos)',
          values: {
            'Frequência Cardíaca': '45-90 bpm',
            'Frequência Respiratória': '16-25 rpm',
            'Pressão Arterial': '130-140/80-90 mmHg',
            'Temperatura': '36.5-37.2°C'
          }
        }
      ],
      normalValues: {
        'Saturação O₂': '95-100% (todas as idades)',
        'Glicemia': '70-100 mg/dL (jejum)',
        'pH Arterial': '7.35-7.45',
        'Lactato': '<2 mmol/L'
      }
    }
  }

  const currentContent = medicalContent[selectedCategory]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header globalMute={globalMute} onGlobalMuteToggle={handleGlobalMuteToggle} />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700 text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-green-900/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Referência Médica
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            Guia completo de sinais vitais, algoritmos de alerta e interpretação clínica
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content Display */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6 text-green-600" />
                {currentContent.title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {currentContent.description}
              </p>
            </CardHeader>
            <CardContent>
              {/* Images Section */}
              {currentContent.images && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Imagens de Referência
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentContent.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
                      >
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={300}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-500"><span>Imagem não disponível</span></div>`;
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {image.caption}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Sections */}
              {currentContent.content && (
                <div className="mb-8">
                  {currentContent.content.map((section, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">{section.title}</h4>
                      {section.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{section.description}</p>
                      )}
                      {section.scoring && (
                        <div className="space-y-2">
                          {section.scoring.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="font-medium min-w-[150px]">{item.parameter}:</span>
                              <div className="flex flex-wrap gap-1">
                                {item.ranges.map((range, rangeIdx) => (
                                  <Badge key={rangeIdx} variant="outline" className="text-xs">
                                    {range}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.interpretation && (
                        <div className="space-y-2">
                          {section.interpretation.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Badge variant={idx >= 2 ? "destructive" : idx >= 1 ? "secondary" : "default"}>
                                {item.score}
                              </Badge>
                              <span className="text-sm">{item.action}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.criteria && (
                        <ul className="list-disc list-inside space-y-1">
                          {section.criteria.map((criterion, idx) => (
                            <li key={idx} className="text-sm">{criterion}</li>
                          ))}
                        </ul>
                      )}
                      {section.signs && (
                        <ul className="list-disc list-inside space-y-1">
                          {section.signs.map((sign, idx) => (
                            <li key={idx} className="text-sm">{sign}</li>
                          ))}
                        </ul>
                      )}
                      {section.algorithm && (
                        <ol className="list-decimal list-inside space-y-1">
                          {section.algorithm.map((step, idx) => (
                            <li key={idx} className="text-sm">{step}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Age Groups */}
              {currentContent.ageGroups && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Valores por Faixa Etária</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentContent.ageGroups.map((group, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                          {group.group}
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(group.values).map(([param, value]) => (
                            <div key={param} className="flex justify-between text-sm">
                              <span>{param}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Normal Values */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Valores de Referência
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(currentContent.normalValues).map(([param, value]) => (
                    <div key={param} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        {param}
                      </div>
                      <div className="text-lg font-bold text-green-900 dark:text-green-100">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clinical Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Nota Clínica Importante
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    Este sistema é uma Prova de Conceito (POC) com dados simulados. 
                    Todas as informações apresentadas são baseadas em literatura médica reconhecida, 
                    mas o sistema não deve ser usado para tomada de decisões clínicas reais sem 
                    validação adequada e aprovação regulatória. Sempre consulte protocolos 
                    institucionais e orientação médica especializada.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}