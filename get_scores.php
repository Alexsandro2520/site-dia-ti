<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$grupos = ['amarelo', 'azul', 'roxo', 'vermelho'];
$resultado = [];

foreach ($grupos as $grupo) {
    $arquivo = __DIR__ . '/scores/' . $grupo . '.txt';

    if (!is_file($arquivo) || !is_readable($arquivo)) {
        $resultado[$grupo] = null;
        continue;
    }

    $conteudo = trim(file_get_contents($arquivo));

    // Os arquivos devem conter somente um número inteiro, por exemplo: 150
    if ($conteudo !== '' && preg_match('/^-?\\d+$/', $conteudo)) {
        $resultado[$grupo] = (int) $conteudo;
    } else {
        $resultado[$grupo] = null;
    }
}

echo json_encode($resultado, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
