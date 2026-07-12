# ============================================================
# WeightSynth — GUIA DE REVISÃO E PRÓXIMOS PASSOS
# Leia este arquivo antes de abrir o projeto no computador
# ============================================================

## PASSO 1 — Instalar o ambiente (5 min)

```bash
# Instalar Node.js 18+ em nodejs.org se ainda não tiver

# Instalar o Expo CLI e EAS CLI
npm install -g expo-cli eas-cli

# Entrar na pasta do projeto
cd massapp-rn

# Instalar as dependências
npm install

# Testar no celular (baixe o app "Expo Go" na Play Store)
npx expo start
# Escanear o QR Code com o Expo Go
```

---

## PASSO 2 — O que você PRECISA preencher (busque por TODO no código)

Abra cada arquivo abaixo e substitua os valores marcados:

### app.json
```
"bundleIdentifier": "com.seudominio.weightsynth"
                     ↑ Troque por ex: com.wenson.weightsynth
                       (use só letras minúsculas, pontos e números)

"package": "com.seudominio.weightsynth"
            ↑ Mesmo valor acima — Android e iOS precisam ser iguais
```

### eas.json
```
"appleId": "SEU_APPLE_ID@email.com"
            ↑ Seu e-mail da Apple Developer (só se for publicar no iOS)

"ascAppId": "SEU_APP_ID_APPSTORE_CONNECT"
             ↑ ID numérico do app no App Store Connect

"appleTeamId": "SEU_TEAM_ID"
                ↑ ID do seu time Apple Developer (10 caracteres)
```

### privacy-policy.html
```
href="mailto:seuemail@email.com"
              ↑ Seu e-mail de contato real
```

### STORE_LISTING.md
```
Procure por "seuemail" e substitua pelo seu e-mail real
```

---

## PASSO 3 — Hospedar a Política de Privacidade (obrigatório para Play Store)

Opção mais simples — GitHub Pages (grátis):

1. Crie uma conta em github.com se não tiver
2. Crie um repositório público chamado "weightsynth-privacy"
3. Faça upload do arquivo privacy-policy.html
4. Vá em Settings > Pages > Source: main, pasta: / (root)
5. Sua URL será: https://SEU_USUARIO.github.io/weightsynth-privacy/privacy-policy.html
6. Guarde essa URL — você vai precisar dela no Google Play Console

---

## PASSO 4 — Criar conta na Play Store e publicar

1. Acesse play.google.com/console
2. Pague a taxa única de $25 (cartão de crédito)
3. Crie um novo aplicativo: "WeightSynth"
4. Preencha:
   - Descrição curta e completa (copie do STORE_LISTING.md)
   - Categoria: Ferramentas (Tools)
   - Política de privacidade: URL do GitHub Pages (Passo 3)
   - Screenshots: tire pelo menos 2 capturas de tela do app rodando
   - Ícone: use o arquivo assets/icon.png

5. Gere o build de produção:
```bash
eas login                                           # login na sua conta Expo
eas build --platform android --profile production   # gera o .aab
```
6. Faça upload do .aab gerado na Play Console
7. Envie para revisão

---

## PASSO 5 — Publicar na App Store (opcional, $99/ano)

1. Crie conta em developer.apple.com
2. Acesse appstoreconnect.apple.com
3. Crie novo app com bundle ID: com.seudominio.weightsynth
4. Preencha os dados (copie do STORE_LISTING.md)
5. Preencha eas.json com seus dados da Apple
6. Gere o build:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

## ESTRUTURA DO PROJETO (para referência ao revisar)

```
massapp-rn/
│
├── App.js                    ← NAVEGAÇÃO PRINCIPAL (3 abas)
│                               ⚖ Calcular | ◎ Raio | ✦ Materiais
│
├── app.json                  ← ⚠️ PREENCHER: bundleIdentifier e package
├── eas.json                  ← ⚠️ PREENCHER: dados Apple (se iOS)
├── privacy-policy.html       ← ⚠️ PREENCHER: e-mail + hospedar online
│
├── assets/
│   ├── icon.png              ← Ícone 1024×1024 (já gerado ✓)
│   ├── splash.png            ← Tela de abertura (já gerada ✓)
│   ├── adaptive-icon.png     ← Ícone adaptativo Android (já gerado ✓)
│   └── favicon.png           ← Favicon web (já gerado ✓)
│
└── src/
    ├── data/
    │   └── materials.js      ← 16 materiais com pixel art e densidades
    │
    ├── components/
    │   ├── PixelView.js      ← Renderiza pixel art dos materiais
    │   ├── PixelEditor.js    ← Editor 8×8 para materiais customizados
    │   └── MeasureGuide.js   ← Diagrama visual de medição por forma
    │
    ├── screens/
    │   ├── CalcScreen.js     ← Tela ⚖ Calcular massa
    │   │                        Cilindro / Bloco / Tubo
    │   │                        16 materiais + customizados
    │   │                        Resultado em kg, g ou toneladas
    │   │
    │   ├── RadiusScreen.js   ← Tela ◎ Cálculo de Raio
    │   │                        Fita métrica → circunferência externa
    │   │                        Paquímetro → espessura da parede
    │   │                        Resultado: Re, Ri, ∅e, ∅i, C interna
    │   │
    │   └── CustomScreen.js   ← Tela ✦ Materiais personalizados
    │                            4 slots editáveis
    │                            Editor de pixel art
    │                            Cálculo de densidade por amostra
    │
    └── utils/
        ├── validation.js     ← Limites, sanitização, formatação
        └── storage.js        ← AsyncStorage seguro com retry

```

---

## O QUE FOI IMPLEMENTADO (checklist completo)

### Funcionalidades
- [x] Cálculo de massa — cilindro sólido (barra)
- [x] Cálculo de massa — bloco / chapa
- [x] Cálculo de massa — tubo / perfil oco
- [x] Resultado automático em g / kg / t
- [x] Cálculo de raio por fita métrica + paquímetro
- [x] Raio externo, interno, diâmetro e circunferência interna
- [x] 4 slots de materiais personalizados
- [x] Editor de pixel art 8×8 com paleta de cores
- [x] Instrução de como calcular densidade por amostra
- [x] Persistência dos materiais customizados (AsyncStorage)

### Materiais incluídos (16)
- [x] Aço carbono, Inox 304, Alumínio, Cobre, Latão
- [x] Ferro fundido, Titânio, Chumbo
- [x] Pinus, Angelim, Eucalipto, MDF
- [x] Papelão, Polietileno, Nylon PA6, Concreto, Vidro

### Visual
- [x] Pixel art individual por material (estilo RPG)
- [x] Diagrama visual de medição por tipo de objeto
- [x] Guia passo a passo na tela de raio
- [x] Cores diferentes por material no resultado

### Segurança e qualidade
- [x] Validação de todos os campos com limites reais
- [x] Proteção contra overflow matemático
- [x] Sanitização do nome de materiais customizados
- [x] Storage com retry automático e health check
- [x] Sem coleta de dados / sem internet

### Publicação
- [x] Ícone 1024×1024 gerado
- [x] Splash screen gerada
- [x] Ícone adaptativo Android gerado
- [x] app.json configurado para Play Store e App Store
- [x] eas.json com perfis de build (preview, production)
- [x] Política de privacidade HTML completa (LGPD + COPPA)
- [x] Textos prontos para as lojas (STORE_LISTING.md)
- [x] .gitignore configurado

---

## O QUE VOCÊ AINDA PRECISA FAZER

- [ ] Substituir "com.seudominio" pelo seu domínio real (app.json)
- [ ] Hospedar privacy-policy.html em URL pública (GitHub Pages)
- [ ] Substituir seuemail@email.com pelo seu e-mail real
- [ ] Criar conta no Google Play Console ($25 taxa única)
- [ ] Tirar screenshots reais do app (mínimo 2, veja dimensões no STORE_LISTING.md)
- [ ] Rodar npm install e testar no celular com Expo Go
- [ ] Gerar build de produção: eas build --platform android --profile production
- [ ] Fazer upload do .aab na Play Console e enviar para revisão
- [ ] (Opcional) Criar conta Apple Developer ($99/ano) para App Store

---

## DÚVIDAS COMUNS

**"npm install" deu erro?**
→ Verifique se o Node.js é versão 18 ou superior: node --version

**O app não abre no celular?**
→ Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi

**"eas build" pediu login?**
→ Crie uma conta gratuita em expo.dev e rode: eas login

**Onde fica o .aab gerado?**
→ O EAS faz o build na nuvem e te manda o link para download por e-mail

**Posso testar sem conta na Play Store?**
→ Sim! Use: eas build --platform android --profile preview
→ Isso gera um .apk que você instala direto no Android
