# WeightSynth 📦

Calculadora de massa industrial para objetos cilíndricos, blocos e tubos.
Desenvolvida com **React Native + Expo**, pronta para publicação na **Play Store** e **App Store**.

---

## Estrutura do projeto

```
weightsynth-rn/
├── App.js                        ← entrada principal, navegação por tabs
├── app.json                      ← configurações Expo (nome, ícone, bundle ID)
├── eas.json                      ← configurações de build e submit (EAS)
├── package.json
├── babel.config.js
└── src/
    ├── data/
    │   └── materials.js          ← banco de materiais + paleta do editor
    ├── components/
    │   ├── PixelView.js          ← renderiza pixel art 8×8
    │   └── PixelEditor.js        ← editor de pixel art interativo
    └── screens/
        ├── CalcScreen.js         ← tela de cálculo
        └── CustomScreen.js       ← tela de materiais personalizados
```

---

## Pré-requisitos

- Node.js 18+
- Conta no [Expo](https://expo.dev) (gratuita)
- Para publicar: conta no [Google Play Console](https://play.google.com/console) e/ou [Apple Developer](https://developer.apple.com)

---

## Instalação e execução local

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o app (abre no Expo Go no celular)
npx expo start

# 3. Escanear o QR code com o app Expo Go
#    (disponível na Play Store e App Store gratuitamente)
```

---

## Build para publicação

O WeightSynth usa o **EAS Build** (Expo Application Services) para gerar os binários.

### 1. Instalar o EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configurar o projeto

```bash
eas build:configure
```

Isso vai preencher o `projectId` no `app.json` automaticamente.

### 3. Build Android (Play Store)

```bash
# Gera um .aab (Android App Bundle) para a Play Store
eas build --platform android --profile production

# Ou um .apk para testes internos
eas build --platform android --profile preview
```

### 4. Build iOS (App Store)

```bash
eas build --platform ios --profile production
```

> Requer conta Apple Developer ($99/ano) e certificados configurados.
> O EAS gerencia os certificados automaticamente na primeira vez.

---

## Publicação na Play Store

1. Acesse o [Google Play Console](https://play.google.com/console)
2. Crie um novo app chamado **WeightSynth**
3. Preencha: descrição, capturas de tela, categoria (Utilitários), classificação etária
4. No EAS, configure o `google-service-account.json` (chave de conta de serviço do Google)
5. Publique automaticamente:

```bash
eas submit --platform android --profile production
```

---

## Publicação na App Store

1. Acesse o [App Store Connect](https://appstoreconnect.apple.com)
2. Crie um novo app com bundle ID `com.seudominio.weightsynth`
3. Preencha: nome, descrição, capturas de tela, palavras-chave
4. No `eas.json`, preencha `appleId`, `ascAppId` e `appleTeamId`
5. Publique:

```bash
eas submit --platform ios --profile production
```

---

## Personalizar antes de publicar

| Arquivo | O que alterar |
|---|---|
| `app.json` | `name`, `bundleIdentifier` (iOS), `package` (Android) |
| `eas.json` | `appleId`, `ascAppId`, `appleTeamId` |
| `assets/` | Substituir `icon.png` (1024×1024), `splash.png` e `adaptive-icon.png` |

---

## Fórmulas utilizadas

| Forma | Fórmula do volume |
|---|---|
| Cilindro sólido | V = π × (∅/2)² × L |
| Bloco | V = A × B × L |
| Tubo | V = π × ((∅e/2)² − (∅i/2)²) × L |

Massa = densidade (kg/m³) × volume (m³)

---

## Materiais incluídos

**Metais:** Aço carbono, Inox 304, Alumínio, Cobre, Latão, Ferro fundido, Titânio, Chumbo  
**Madeiras:** Pinus, Angelim, Eucalipto, MDF  
**Outros:** Papelão, Polietileno, Nylon PA6, Concreto, Vidro  
**+ 4 slots customizáveis** com editor de pixel art e cálculo de densidade por amostra

---

## Referências

- Denidzio. weight-calculator. GitHub, 2022. https://github.com/Denidzio/weight-calculator
- React Native Docs. https://reactnative.dev/docs/getting-started
- Samaterials. Peso específico e densidade. https://www.samaterials.pt/content/specific-weight-and-density.html
