#!/usr/bin/env node

/**
 * Script automatizado para configurar Firebase
 *
 * Uso:
 * 1. Faça login no Firebase CLI: firebase login
 * 2. Execute: node setup-firebase.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'flutter-ide-project';
const APP_NICKNAME = 'flutter-ide-web';

console.log('🔥 Configurando Firebase automaticamente...\n');

try {
  // 1. Verificar se está logado
  console.log('1️⃣ Verificando login no Firebase...');
  try {
    execSync('firebase login:list', { stdio: 'pipe' });
    console.log('✅ Você está logado no Firebase\n');
  } catch (error) {
    console.log('❌ Você não está logado no Firebase');
    console.log('\n📝 Execute primeiro: firebase login');
    console.log('   Depois rode este script novamente.\n');
    process.exit(1);
  }

  // 2. Selecionar o projeto
  console.log('2️⃣ Selecionando projeto Firebase...');
  try {
    execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' });
    console.log(`✅ Projeto ${PROJECT_ID} selecionado\n`);
  } catch (error) {
    console.log(`❌ Erro ao selecionar projeto ${PROJECT_ID}`);
    console.log('   Verifique se o projeto existe no Firebase Console\n');
    process.exit(1);
  }

  // 3. Criar app web (se não existir)
  console.log('3️⃣ Criando Web App no Firebase...');
  try {
    const output = execSync(
      `firebase apps:create WEB ${APP_NICKNAME}`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    console.log('✅ Web App criado com sucesso\n');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Web App já existe, continuando...\n');
    } else {
      console.log('⚠️  Aviso ao criar Web App (pode já existir)\n');
    }
  }

  // 4. Obter configuração do app
  console.log('4️⃣ Obtendo credenciais do Firebase...');
  const configOutput = execSync(
    `firebase apps:sdkconfig WEB`,
    { stdio: 'pipe', encoding: 'utf-8' }
  );

  // Parse JSON output (formato novo do Firebase CLI)
  let firebaseConfig;
  try {
    firebaseConfig = JSON.parse(configOutput);
    console.log('✅ Credenciais obtidas com sucesso\n');
  } catch (error) {
    // Tentar formato antigo com regex
    const apiKeyMatch = configOutput.match(/apiKey:\s*["']([^"']+)["']/);
    const authDomainMatch = configOutput.match(/authDomain:\s*["']([^"']+)["']/);
    const projectIdMatch = configOutput.match(/projectId:\s*["']([^"']+)["']/);
    const storageBucketMatch = configOutput.match(/storageBucket:\s*["']([^"']+)["']/);
    const messagingSenderIdMatch = configOutput.match(/messagingSenderId:\s*["']([^"']+)["']/);
    const appIdMatch = configOutput.match(/appId:\s*["']([^"']+)["']/);

    if (!apiKeyMatch || !authDomainMatch || !appIdMatch) {
      console.log('❌ Erro ao extrair credenciais do Firebase');
      console.log('\n📋 Saída do comando:');
      console.log(configOutput);
      process.exit(1);
    }

    firebaseConfig = {
      apiKey: apiKeyMatch[1],
      authDomain: authDomainMatch[1],
      projectId: projectIdMatch[1],
      storageBucket: storageBucketMatch[1],
      messagingSenderId: messagingSenderIdMatch[1],
      appId: appIdMatch[1],
    };
    console.log('✅ Credenciais obtidas com sucesso\n');
  }

  // 5. Criar arquivo .env.local
  console.log('5️⃣ Criando arquivo .env.local...');
  const envContent = `# Firebase Configuration - Gerado automaticamente
# NÃO commitar este arquivo no Git!

VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
`;

  fs.writeFileSync('.env.local', envContent, 'utf-8');
  console.log('✅ Arquivo .env.local criado com sucesso\n');

  // 6. Instruções finais
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Configuração concluída com sucesso!\n');
  console.log('📋 PRÓXIMOS PASSOS:\n');
  console.log('1. Habilitar Authentication no Firebase Console:');
  console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/authentication/providers`);
  console.log('   - Clique em "Get Started"');
  console.log('   - Habilite "Google" e "GitHub"\n');
  console.log('2. Para GitHub OAuth, você também precisa:');
  console.log('   - Criar OAuth App em: https://github.com/settings/developers');
  console.log('   - Homepage URL: http://localhost:1420');
  console.log('   - Callback URL: https://flutter-ide-project.firebaseapp.com/__/auth/handler\n');
  console.log('3. Rodar a aplicação:');
  console.log('   npm run tauri dev\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

} catch (error) {
  console.error('❌ Erro durante a configuração:', error.message);
  process.exit(1);
}
