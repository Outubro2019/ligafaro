# 🤝 Guia de Contribuição - LigaFaro

Obrigado por estar interessado em contribuir para o LigaFaro! Este guia ajudará você a começar.

## 📋 Índice

- [Code of Conduct](#code-of-conduct)
- [Como Contribuir](#como-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits e PRs](#commits-e-prs)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Melhorias](#sugerir-melhorias)

---

## 📜 Code of Conduct

Por favor, leia nosso [Code of Conduct](CODE_OF_CONDUCT.md) antes de contribuir. Esperamos um comportamento respeitoso e inclusivo.

---

## 🎯 Como Contribuir

Existem várias formas de contribuir:

### 1. **Reportar Bugs**
- Abra uma [issue no GitHub](https://github.com/Outubro2019/ligafaro/issues)
- Inclua título descritivo e reprodução clara

### 2. **Sugerir Melhorias**
- Abra uma [discussion ou issue](https://github.com/Outubro2019/ligafaro/discussions)
- Descreva o problema e a solução proposta

### 3. **Enviar Código**
- Fork o repositório
- Crie uma branch (`git checkout -b feature/sua-feature`)
- Faça commit das mudanças
- Push para a branch (`git push origin feature/sua-feature`)
- Abra um Pull Request

### 4. **Melhorar Documentação**
- Correções de typos
- Melhoria de clareza
- Adicionar exemplos

---

## 🔧 Processo de Desenvolvimento

### Setup Local

```bash
# 1. Fork e clone
git clone https://github.com/SEU-USUARIO/ligafaro.git
cd ligafaro

# 2. Crie uma branch de feature
git checkout -b feature/minha-feature

# 3. Instale dependências
npm install
pip install -r requirements.txt

# 4. Crie um environment file
cp .env.example .env
# Edite .env com suas chaves

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

### Estrutura de Branches

```
main (produção)
  ├── develop (desenvolvimento)
  └── feature/* (novas features)
```

**Nomear branches:**
- `feature/nome-da-feature` - Novas funcionalidades
- `bugfix/nome-do-bug` - Correção de bugs
- `docs/nome-do-doc` - Documentação
- `refactor/nome-refactor` - Refatoração

---

## 📐 Padrões de Código

### TypeScript/React

```typescript
// ✓ BOM
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ✗ RUIM
const UserCard = (props) => {
  return <div>{props.user.name}</div>;
};
```

**Regras:**
- Sempre use tipos TypeScript
- Use PascalCase para componentes
- Use camelCase para variáveis
- Componentes funcionais com hooks
- Prop drilling mínimo (use Context/Query)

### Python

```python
#!/usr/bin/env python3
"""
Module: Descrição do módulo
Uso: python script_name.py
"""

import json
from typing import List, Dict

def process_data(data: List[Dict]) -> Dict:
    """
    Processa dados.

    Args:
        data: Lista de dicionários

    Returns:
        Dicionário processado
    """
    return {"processed": True}

if __name__ == "__main__":
    main()
```

**Regras:**
- Use type hints
- Docstrings em inglês ou português
- Follow PEP 8
- Use venv para ambiente virtual

### CSS/Tailwind

```typescript
// ✓ BOM
<button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
  Click me
</button>

// ✗ RUIM
<button style={{padding: "8px 16px", backgroundColor: "blue"}}>
  Click me
</button>
```

---

## 💬 Commits e PRs

### Mensagens de Commit

Use o padrão convencional:

```
type(scope): subject

body

footer
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, missing semicolons, etc
- `refactor`: Refatoração sem mudança de funcionalidade
- `perf`: Melhoria de performance
- `test`: Adição de testes
- `chore`: Atualização de dependências

**Exemplos:**

```
feat(events): adicionar filtro por data no calendário

fix(chatbot): corrigir resposta incorreta em português

docs(readme): atualizar instruções de instalação

refactor(api): simplificar lógica de autenticação
```

### Pull Requests

**Título:**
```
[TIPO] Descrição breve - issue #123
```

**Descrição:**
```markdown
## Descrição
Breve descrição do que muda

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Mudança de documentação

## Teste
Descrever como testar

## Checklist
- [ ] Código segue os padrões
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Sem console.log ou debug code
```

---

## 🐛 Reportar Bugs

**Título Claro:**
```
[BUG] Descrição breve do problema
```

**Template:**

```markdown
## Descrição
Descrição clara do bug

## Passos para Reproduzir
1. Ir para...
2. Clicar em...
3. Observar...

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que acontece

## Ambiente
- SO: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Versão Node.js: [versão]

## Screenshots
[Se aplicável]
```

---

## 💡 Sugerir Melhorias

**Título:**
```
[FEATURE] Descrição breve da melhoria
```

**Template:**

```markdown
## Problema
Descrever o problema ou limitação atual

## Solução Proposta
Descrever a solução

## Alternativas Consideradas
Outras abordagens

## Impacto
- Performance: Alto/Médio/Baixo
- UX: Alto/Médio/Baixo
- Complexidade: Alta/Média/Baixa

## Exemplo de Uso
```

---

## 📦 Dependências

Antes de adicionar dependências:

1. Verifique se já existe
2. Considere alternativas
3. Atualize `package.json` ou `requirements.txt`
4. Documente o motivo

---

## 🧪 Testes

Ao adicionar features:

```bash
# Frontend
npm run test

# Backend
pytest tests/

# Linting
npm run lint
```

---

## 📚 Documentação

Mantenha documentação atualizada:

- `README.md` - Visão geral
- `README_SCRIPTS.md` - Scripts e utilitários
- `README_DEPLOY.md` - Deployment
- Comentários de código para lógica complexa
- Type definitions para TypeScript

---

## 🎨 Design System

Use componentes Shadcn UI:

```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
```

---

## 🚀 Processo de Review

1. **Automático:** GitHub Actions (linting, testes)
2. **Manual:** Revisão de código
3. **Aprovação:** Pelo menos 1 revisor
4. **Merge:** Squash or merge commits

---

## 🎓 Recursos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Python PEP 8](https://pep8.org/)

---

## ❓ Dúvidas?

- 📧 Email: contato@ligafaro.pt
- 💬 Discussions: [GitHub Discussions](https://github.com/Outubro2019/ligafaro/discussions)
- 🐦 Issues: [GitHub Issues](https://github.com/Outubro2019/ligafaro/issues)

---

## 🙏 Agradecimentos

Obrigado por contribuir para o LigaFaro! Suas contribuições ajudam a fortalecer a comunidade de Faro.

---

**Última atualização:** 27 de Outubro de 2025
