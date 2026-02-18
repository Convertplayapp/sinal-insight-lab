

# Substituir Logos do Cloudinary por Imagens Locais

## Problema
As imagens da logo estao hospedadas no Cloudinary, que esta com a conta desativada. O usuario enviou duas versoes da logo para uso local.

## Regra de uso
- **Logo com fonte branca** (22_19_32) -- paginas escuras (HeroSection)
- **Logo com fonte preta** (22_43_53) -- paginas claras (Quiz, PartialResult, FullResult, PurchaseScreen)

## Situacao atual e correcoes

| Componente | Fundo | Logo atual | Logo correta | Acao |
|---|---|---|---|---|
| HeroSection | Escuro (hero-gradient) | 22_19_32 (branca) | Branca | Trocar URL por local |
| Quiz | Claro (card-gradient) | 22_43_53 (preta) | Preta | Trocar URL por local |
| PartialResult | Claro (bg-background) | 22_19_32 (branca) | Preta | Trocar URL e versao |
| FullResult | Claro (bg-background) | 22_19_32 (branca) | Preta | Trocar URL e versao |
| PurchaseScreen | Claro | 22_43_53 (preta) | Preta | Trocar URL por local |

## Passos

1. Copiar as duas imagens enviadas para `src/assets/`:
   - `src/assets/logo-white.png` (fonte branca, para fundos escuros)
   - `src/assets/logo-black.png` (fonte preta, para fundos claros)

2. Atualizar cada componente para importar a logo local via ES6 module import e usar a versao correta:
   - **HeroSection.tsx**: import logo-white, usar em `src={logoWhite}`
   - **Quiz.tsx**: import logo-black, usar em `src={logoBlack}`
   - **PartialResult.tsx**: trocar de logo branca para logo-black (correcao)
   - **FullResult.tsx**: trocar de logo branca para logo-black (correcao)
   - **PurchaseScreen.tsx**: import logo-black, usar em `src={logoBlack}`

## Detalhes tecnicos

Cada componente recebera um import no topo do arquivo:

```text
import logoBlack from '@/assets/logo-black.png';
// ou
import logoWhite from '@/assets/logo-white.png';
```

E a tag img passara de:
```text
src="https://res.cloudinary.com/..."
```
para:
```text
src={logoBlack}  // ou src={logoWhite}
```

Isso elimina a dependencia do Cloudinary e garante que as imagens funcionem tanto em preview quanto no site publicado.

