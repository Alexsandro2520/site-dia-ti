DIA DO TI — MULTIVERSO DOS QUADRINHOS

COMO EXECUTAR
1. Extraia a pasta Dia-do-TI.
2. Instale/tenha PHP disponível (por exemplo, via XAMPP).
3. Coloque a pasta dentro de htdocs, se usar XAMPP.
4. Inicie o Apache.
5. Abra http://localhost/Dia-do-TI/ no navegador.

IMPORTANTE
Não abra index.html diretamente pelo explorador de arquivos: o navegador não executará o PHP.
O placar é somente de leitura. Para alterar pontos, edite os arquivos dentro de scores/.

ARQUIVOS DE PONTUAÇÃO
scores/amarelo.txt
scores/azul.txt
scores/roxo.txt
scores/vermelho.txt

Cada arquivo deve conter somente um número inteiro, por exemplo:
150

PERSONALIZAÇÃO
- Logo: substitua o arquivo img/logo.png.
- Imagem da Hero: substitua img/multiverso.jpg.
- Para usar outro caminho de imagem da Hero, altere --hero-image em css/style.css.
- Contatos: edite a área do footer em index.html.
- Pontuações: edite os arquivos .txt em scores/.

A página atualiza as pontuações automaticamente a cada 15 segundos.

Novidades: os placares são reordenados automaticamente a cada atualização, com a maior pontuação à direita. A contagem regressiva termina em 29/10/2026 às 12h40 (horário de Brasília, UTC-03:00); depois disso, o título muda para "O DIA DO TI JÁ COMEÇOU...".
