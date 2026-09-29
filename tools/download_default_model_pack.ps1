$ErrorActionPreference = "Stop"
$Model = "SmolLM2-360M-Instruct-q4f32_1-MLC"
$Root = Join-Path (Split-Path $PSScriptRoot -Parent) "models\$Model"
New-Item -ItemType Directory -Force -Path $Root | Out-Null
$Base = "https://huggingface.co/mlc-ai/$Model/resolve/main/"
function Get-Asset($url,$name){$out=Join-Path $Root $name;if(Test-Path $out){Write-Host "Exists $name";return};Write-Host "Downloading $name";Invoke-WebRequest -Uri $url -OutFile $out}
Get-Asset ($Base+"mlc-chat-config.json") "mlc-chat-config.json"
Get-Asset ($Base+"ndarray-cache.json") "ndarray-cache.json"
$cfg=Get-Content (Join-Path $Root "mlc-chat-config.json") -Raw | ConvertFrom-Json
$nd=Get-Content (Join-Path $Root "ndarray-cache.json") -Raw | ConvertFrom-Json
foreach($f in $cfg.tokenizer_files){Get-Asset ($Base+$f) $f}
$shards=$nd.records | ForEach-Object {$_.dataPath} | Select-Object -Unique
foreach($f in $shards){Get-Asset ($Base+$f) $f}
$lib="https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/SmolLM2-360M-Instruct-q4f32_1_cs1k-webgpu.wasm"
Get-Asset $lib "model_lib.wasm"
Write-Host "Pack ready at $Root"
