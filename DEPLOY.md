# 📦 Guia de Deploy - GitHub Pages

## Configuração Inicial

### 1. Habilitar GitHub Pages

1. Vá para o repositório no GitHub
2. Clique em **Settings** > **Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Salve as configurações

### 2. Configurar Secrets (Opcional - se usar API)

Se você usar variáveis de ambiente (como a chave da API Gemini):

1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Clique em **New repository secret**
3. Adicione:
   - Name: `REACT_APP_GEMINI_API_KEY`
   - Value: sua chave da API
4. Clique em **Add secret**

### 3. Fazer Deploy

O deploy é automático! Basta fazer push para a branch `main`:

```bash
git checkout main
git merge refactor/add-jesus-phrases
git push origin main
```

Ou se já estiver na branch main:

```bash
git push origin main
```

### 4. Verificar Deploy

Após o push, o GitHub Actions irá:

1. ✅ Fazer checkout do código
2. ✅ Instalar dependências
3. ✅ Fazer build do projeto
4. ✅ Fazer deploy no GitHub Pages

Você pode acompanhar o progresso em **Actions** no repositório.

### 5. Acessar o Site

Após o deploy concluir, o site estará disponível em:

**https://victorandraad.github.io/WiseTeachings-Jesus-Version**

## Troubleshooting

### Build falha

- Verifique os logs em **Actions** > **Deploy to GitHub Pages**
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

### Site não atualiza

- Aguarde alguns minutos (cache do GitHub Pages)
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o workflow foi executado com sucesso

### Variáveis de ambiente não funcionam

- Certifique-se de que os secrets estão configurados corretamente
- Verifique se o nome do secret está exatamente como no código
- O secret deve começar com `REACT_APP_` para ser exposto no build

## Deploy Manual (Alternativa)

Se preferir fazer deploy manual:

```bash
npm run build
npx gh-pages -d build
```

Mas é necessário instalar o pacote `gh-pages` primeiro:

```bash
npm install --save-dev gh-pages
```

E adicionar no `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

