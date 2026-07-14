# WeightSynth — Changelog

---

## v1.2.071326-BETA — Em desenvolvimento
> 13/07/2026

### ✅ Implementado
- **Pixel art 16×16** para todos os 17 materiais estilo lingote/barra:
  - Metais (Aço, Inox, Alumínio, Titânio) → forma de **barra cilíndrica**
  - Metais pesados (Cobre, Latão, Chumbo) → forma de **lingote**
  - Ferro fundido → forma de **chapa**
  - Madeiras (Pinus, Angelim, Eucalipto, MDF) → forma de **tábua com veios**
  - Polímeros (Polietileno, Nylon, Vidro) → forma de **esfera/bolha**
  - Outros (Papelão, Concreto) → forma de **bloco**
- **PixelView** atualizado para detectar automaticamente grade 8×8 ou 16×16
- **Tela de circunferência** reformulada:
  - Resultado principal agora é a **circunferência interna** (não o raio)
  - Fórmula exibida: C_int = π × (C_ext÷π − 2×espessura)
  - Campo de espessura aceita **vírgula e ponto** como decimal (ex: 3,22 ou 3.22)
  - Preview em tempo real do diâmetro externo enquanto digita
  - Espessura confirmada visualmente após entrada
  - Resultado com **4 casas decimais**
  - Chips secundários: ∅e, ∅i, Re, Ri
- **Sistema de versionamento BETA** implementado em todas as versões

### 🔜 Planejado
- Pixel art 16×16 para slots customizados (editor 16×16)
- Animações suaves entre telas

---

## v1.1.071225-BETA
> 07/12/2025

### ✅ Implementado
- Tema claro e escuro (salvo automaticamente)
- 4 idiomas: Português 🇧🇷, Inglês 🇺🇸, Espanhol 🇪🇸, Chinês 🇨🇳
- Tela de Configurações com créditos, patch notes e política de privacidade
- Sistema de versionamento com data (MAJOR.MINOR.MMDDYY-TAG)

---

## v1.0.071225-BETA
> 07/12/2025 — Lançamento inicial

### ✅ Implementado
- Cálculo de massa para cilindros, blocos e tubos
- 16 materiais com pixel art 8×8
- Cálculo de raio por fita métrica e paquímetro
- 4 slots de materiais personalizados com editor pixel art
- Validação de entrada com limites reais de segurança
- AsyncStorage seguro com retry e health check
- Política de privacidade (LGPD + COPPA)
- Textos prontos para Play Store e App Store
- Ícone, splash screen e adaptive icon

---

## Roadmap

### v1.3.xxxxxx-BETA
- [ ] Editor de pixel art 16×16 para materiais customizados
- [ ] Animações de transição entre abas
- [ ] Ícone do app atualizado com novo estilo

### v1.4.xxxxxx-BETA
- [ ] Histórico dos últimos 10 cálculos
- [ ] Compartilhar resultado por WhatsApp / e-mail
- [ ] Suporte a perfis quadrados e hexagonais

### v2.0.xxxxxx-BETA → STABLE
- [ ] Conversão de unidades (mm ↔ cm ↔ polegadas)
- [ ] Calculadora de custo por kg
- [ ] Lista de materiais para um projeto (soma de massas)
- [ ] Widget para tela inicial Android
- [ ] Publicação STABLE na Play Store e App Store
