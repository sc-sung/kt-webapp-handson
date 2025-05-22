const os = require('os');
console.log('현재 호스트 이름:', os.hostname());
console.log('네트워크 인터페이스:');
const nets = os.networkInterfaces();
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    console.log(`  [${name}] ${net.address} (${net.family})`);
  }
}