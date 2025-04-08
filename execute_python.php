<?php
// Permitir acesso de qualquer origem (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Verificar se o script foi especificado
if (!isset($_GET['script'])) {
    echo json_encode(['error' => 'Nome do script não fornecido']);
    exit;
}

$script = $_GET['script'];

// Verificar se o script é permitido (por segurança)
$allowedScripts = ['gerar_noticias_json.py'];
if (!in_array($script, $allowedScripts)) {
    echo json_encode(['error' => 'Script não permitido']);
    exit;
}

// Executar o script Python
$output = [];
$returnCode = 0;
exec("python3 $script 2>&1", $output, $returnCode);

// Verificar se o script foi executado com sucesso
if ($returnCode !== 0) {
    echo json_encode([
        'error' => 'Erro ao executar script Python',
        'details' => implode("\n", $output)
    ]);
    exit;
}

// Retornar sucesso
echo json_encode([
    'success' => true,
    'message' => 'Script executado com sucesso',
    'output' => implode("\n", $output)
]);
?>