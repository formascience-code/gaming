import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const resolve = createRequire(import.meta.url).resolve;
const flags = process.argv.slice(2).filter(flag=>flag!=='--strictPort').map(flag=>flag==='--host'?'--hostname':flag);
const child = spawn(process.execPath,[resolve('next/dist/bin/next'),'dev','--webpack',...flags],{stdio:'inherit'});
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
child.on('exit',code=>{process.exitCode=code ?? 1;});
