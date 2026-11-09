import React from 'react';
import { motion } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import ContactCTA from '../components/ContactCTA';
import AnimatedCounter from '../components/AnimatedCounter';
import { siteData } from '../data/siteData';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="w-full bg-[#000000] text-white pt-28 sm:pt-36">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Main Studio Introduction Statement */}
        <div className="pb-16 sm:pb-24 border-b border-white/20">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1] max-w-6xl text-white">
            Magno — Especialista em Criação de Sites e Estratégia de Social Media focado em impulsionar marcas no ambiente digital.
          </h1>

          {/* Two Story Paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-12 sm:pt-16 max-w-5xl">
            <p className="text-lg sm:text-xl font-semibold text-white/70 leading-relaxed">
              Minha missão é ajudar empresas e empreendedores a construírem uma presença digital sólida e profissional. Acredito que um site rápido e bonito somado a redes sociais com conteúdo consistente e bem produzido são os maiores aceleradores de vendas para qualquer negócio hoje.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white/70 leading-relaxed">
              Seja desenvolvendo uma landing page focada em conversão, criando um site corporativo completo ou gerenciando perfis de redes sociais com postagens atrativas e estratégicas, priorizo clareza, pontualidade e resultados concretos em cada entrega.
            </p>
          </div>
        </div>

        {/* 4 Stats Numbers Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 sm:py-24 border-b border-white/20">
          {[
            { value: '50+', label: 'Projetos Entregues' },
            { value: '99%', label: 'Satisfação dos Clientes' },
            { value: '100k+', label: 'Alcance Digital' },
            { value: '5+', label: 'Anos de Mercado' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col space-y-2"
            >
              <AnimatedCounter
                value={stat.value}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white"
              />
              <span className="text-lg sm:text-xl font-semibold text-white/60">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Studio Group Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my-16 sm:my-28 w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#111111]"
        >
          <img
            src="/assets/images/studio/group-team__NNSUobq8lPFNxj8uNsBHBLm7Ijw.png"
            alt="Ambiente de Criação e Projetos"
            className="w-full h-auto max-h-[850px] object-cover object-center"
          />
        </motion.div>

        {/* Philosophy Statement */}
        <div className="py-16 sm:py-24 border-b border-white/20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-tight max-w-5xl text-white/95">
            Unindo design funcional, tecnologia ágil e conteúdo estratégico para posicionar sua marca no centro das atenções.
          </h2>
        </div>

        {/* Clients / Brands Section */}
        <div className="py-20 border-b border-white/20">
          <div className="flex items-baseline justify-between pb-8">
            <span className="text-sm sm:text-base font-semibold text-white/50 uppercase tracking-widest">
              (Clientes & Marcas)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {siteData.brands.map((b, i) => (
              <div
                key={b.id + '-about-' + i}
                className="aspect-square rounded-[24px] sm:rounded-[28px] bg-[#b3b3b3] flex items-center justify-center p-8 hover:brightness-105 transition-all duration-300 group"
              >
                <img
                  src={b.logo}
                  alt={b.alt}
                  className="max-h-12 sm:max-h-14 max-w-[70%] object-contain filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="py-20 border-b border-white/20">
          <div className="flex items-baseline justify-between pb-8">
            <span className="text-sm sm:text-base font-semibold text-white/50 uppercase tracking-widest">
              (Serviços Especializados)
            </span>
          </div>

          <div className="divide-y divide-white/20">
            {siteData.studioServices.map((svc) => (
              <div
                key={svc.title}
                className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                <h3 className="md:col-span-5 text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                  {svc.title}
                </h3>
                <p className="md:col-span-7 text-base sm:text-lg font-semibold text-white/70 leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="py-20 border-b border-white/20">
          <div className="flex items-baseline justify-between pb-8">
            <span className="text-sm sm:text-base font-semibold text-white/50 uppercase tracking-widest">
              (Reconhecimentos)
            </span>
          </div>

          <div className="divide-y divide-white/20">
            {siteData.awards.map((awd, idx) => (
              <div
                key={idx}
                className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {awd.award}
                </span>
                <span className="text-lg font-semibold text-white/60">
                  {awd.platform}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Partners / Team */}
        <div className="py-20 border-b border-white/20">
          <div className="pb-12">
            <BlurRevealHeading
              text="Parceiros"
              className="text-4xl sm:text-6xl font-bold tracking-[-0.04em]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteData.team.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group flex flex-col space-y-4"
              >
                <div className="w-full aspect-[3/4] rounded-[24px] overflow-hidden bg-[#111111]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {member.name}
                  </h4>
                  <p className="text-sm sm:text-base font-semibold text-white/60">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ContactCTA onNavigate={onNavigate} />
    </div>
  );
}
